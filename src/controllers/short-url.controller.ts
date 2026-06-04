import { Request, Response } from 'express';
import service from '../services/short-url.service';

async function shortenUrl(req: Request, res: Response) {
    try {
        const { longUrl } = req.body;

        const shortUrl = await service.shortenUrlService(longUrl);

        return res.status(201).json(shortUrl);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error
                ? error.message
                : 'Erro interno do servidor'
        });
    }
}

export default {
    shortenUrl
};