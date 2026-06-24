import { AppError } from '../middleware/AppError';
import { ShortUrlRepository } from '../repositories/short-url.repository';

interface GetUserUrlsServiceRequest {
    userId: string,
    page: number,
    limit: number
}

export class GetUserUrlsService{
    constructor(private shortUrlRepository: ShortUrlRepository){}


    async execute({userId, page, limit}: GetUserUrlsServiceRequest){
        if (!userId) {
            throw new AppError('Usuário não autenticado!', 401);
        }
        
        const [urls, total] = await Promise.all([
            this.shortUrlRepository.findByUserId(userId, page, limit),
            this.shortUrlRepository.countByUserId(userId)
        ]);
        
        return {
            urls,
            total
        };
    }
}