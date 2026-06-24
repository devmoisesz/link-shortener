import { Request, Response, NextFunction } from 'express';
import { ShortenUrlService } from '../../services/shortenUrl';
import { makeShortenUrl } from '../../services/factories/make-shortenUrl';

const shortenUrlService = makeShortenUrl()

export async function shortenUrl(req: Request, res: Response, next: NextFunction) {
    try {
        const { longUrl } = req.body;
        const userId = req.user!.id

        const shortUrl = await shortenUrlService.execute({longUrl, userId});

        const baseUrl = `${req.protocol}://${req.get('host')}/shortener`

        return res.status(201).json({
            userId: shortUrl.userId,
            schortCode: shortUrl.shortCode,
            shortUrl: `${baseUrl}/${shortUrl.shortCode}`
        });
    } catch (error: unknown) {
        next(error)
    }
}