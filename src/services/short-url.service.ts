import model from '../models/short-url.models';
import { generateShortCode } from '../utils/generate.short-code';

async function shortenUrlService(longUrl: string) {
    let shortCode = generateShortCode();

    while (await model.exists(shortCode)) {
        shortCode = generateShortCode();
    }

    return await model.create(shortCode, longUrl);
}

export default {
    shortenUrlService
};