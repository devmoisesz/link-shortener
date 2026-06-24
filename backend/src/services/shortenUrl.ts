import { AppError } from '../middleware/AppError';
import { generateShortCode } from '../utils/generate.short-code';
import { ShortUrlRepository } from '../repositories/short-url.repository';

interface ShortenUrlServiceRequest {
    longUrl: string,
    userId: string | undefined
}

export class ShortenUrlService{
    constructor(private shortUrlRepository: ShortUrlRepository){}

    async execute({longUrl, userId}: ShortenUrlServiceRequest){
        const existing = await this.shortUrlRepository.findByLongUrl(longUrl)
        
        if(existing) return existing
            
        let shortCode = generateShortCode();
        
        while (await this.shortUrlRepository.exists(shortCode)) {
            shortCode = generateShortCode();
        }
        
        return await this.shortUrlRepository.create({
            shortCode, 
            userId, 
            longUrl
        });
    }
}