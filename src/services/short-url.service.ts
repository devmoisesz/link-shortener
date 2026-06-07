import { AppError } from '../middleware/AppError';
import model from '../models/short-url.models';
import { generateShortCode } from '../utils/generate.short-code';

async function shortenUrlService(longUrl: string, userId: string | undefined) {
    const existing = await model.findByLongUrl(longUrl)
    if(existing) return existing
    
    let shortCode = generateShortCode();

    while (await model.exists(shortCode)) {
        shortCode = generateShortCode();
    }

    return await model.create(shortCode, userId, longUrl);
}

async function redirectLink(shortCode: string) {
    const shortUrl = await model.findByShortCode(shortCode);

    if(!shortUrl){
        throw new AppError('URL não encontrada', 404);
    }

    return shortUrl.longUrl;
}

async function getUserUrls(userId: string, page: number, limit: number) {
    if (!userId) {
        throw new AppError('Usuário não autenticado!', 401);
    }

    const [urls, total] = await Promise.all([
        model.findByUserId(userId, page, limit),
        model.countByUserId(userId)
    ]);

    return {
        urls,
        total
    };
}

async function deleteUserUrl(shortCode: string, userId: string) {
    const url = await model.findByShortCode(shortCode);

    if (!url) {
        throw new AppError('URL não encontrada', 404);
    }

    if (url.userId.toString() !== userId) {
        throw new AppError('Sem permissão para deletar esta URL', 401);
    }   

    await model.deleteByShortCode(shortCode);
}


export default {
    shortenUrlService,
    redirectLink,
    getUserUrls,
    deleteUserUrl
};