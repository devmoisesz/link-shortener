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
        throw new Error('URL não encontrada');
    }

    return shortUrl.longUrl;
}

export default {
    shortenUrlService,
    redirectLink
};