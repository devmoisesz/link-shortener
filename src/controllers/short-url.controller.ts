import { Request, Response } from 'express';
import service from '../services/short-url.service';

type RedirectParams = {
    shortCode: string;
};

async function shortenUrl(req: Request, res: Response) {
    try {
        const { longUrl } = req.body;
        const userId = req.user?.id

        const shortUrl = await service.shortenUrlService(longUrl, userId);

        const baseUrl = `${req.protocol}://${req.get('host')}/shortener`

        return res.status(201).json({
            userId: shortUrl.userId,
            schortCode: shortUrl.shortCode,
            shortUrl: `${baseUrl}/${shortUrl.shortCode}`
        });
    } catch (error: unknown) {
        return res.status(500).json({
            message: error instanceof Error
                ? error.message
                : 'Erro interno do servidor'
        });
    }
}

async function redirectLink(req: Request<RedirectParams>, res: Response) {
    try {
        const shortCode = req.params.shortCode;
        const url = await service.redirectLink(shortCode);
        res.redirect(url);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'URL não encontrada') {
            return res.status(404).json({
                message: 'URL encurtada não encontrada',
                shortCode: req.params.shortCode
            });
        }
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
}


export default {
    shortenUrl,
    redirectLink
};
