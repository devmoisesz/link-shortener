import { AppError } from '../middleware/AppError';
import { ShortUrlRepository } from '../repositories/short-url.repository'

interface DeleteUrlServiceRequest {
    shortCode: string,
    userId: string
}

export class DeleteUrlService {
    constructor(private shortUrlRepository: ShortUrlRepository){}


    async execute({shortCode, userId}: DeleteUrlServiceRequest){
        const url = await this.shortUrlRepository.findByShortCode(shortCode);
        
        if (!url) {
            throw new AppError('URL não encontrada', 404);
        }
        
        if (url.userId.toString() !== userId) {
            throw new AppError('Sem permissão para deletar esta URL', 401);
        }   
        
        await this.shortUrlRepository.deleteByShortCode(shortCode);
    }
}