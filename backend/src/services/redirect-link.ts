import { AppError } from '../middleware/AppError';
import { ShortUrlRepository } from '../repositories/short-url.repository';

interface RedirectLinkServiceRequest {
    shortCode: string
}

export class RedirectLinkService{
    constructor(private shortUrlRepository: ShortUrlRepository){}

    async execute({shortCode}: RedirectLinkServiceRequest ){
        const shortUrl = await this.shortUrlRepository.findByShortCode(shortCode);
        
        if(!shortUrl){
            throw new AppError('URL não encontrada', 404);
        }
        
        return shortUrl.longUrl;
    }
}