import { Request, Response, NextFunction } from 'express';
import service from '../services/short-url.service';

type RedirectParams = {
    shortCode: string;
};

async function shortenUrl(req: Request, res: Response, next: NextFunction) {
    try {
        const { longUrl } = req.body;
        const userId = req.user!.id

        const shortUrl = await service.shortenUrlService(longUrl, userId);

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

async function redirectLink(req: Request<RedirectParams>, res: Response, next: NextFunction) {
    try {
        const shortCode = req.params.shortCode;
        const url = await service.redirectLink(shortCode);
        res.redirect(url);
    } catch (error: unknown) {
        next(error)
    }
}

async function getUserUrls(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;

        const page =
            typeof req.query.page === 'string'
                ? Number(req.query.page)
                : 1;

        const limit =
            typeof req.query.limit === 'string'
                ? Number(req.query.limit)
                : 10;

        if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
            res.status(400).json({
                message: 'Page and limit must be numbers greater than or equal to 1',
            });
            return;
        }

        const { urls, total } = await service.getUserUrls(userId, page, limit);

        return res.status(200).json({urls, total, page, limit,});
    } catch (error: unknown) {
        next(error)
    }
}

async function DeleteUrl(req: Request<RedirectParams>, res: Response, next: NextFunction) {
    try {
        const shortCode = req.params.shortCode;
        const userId = req.user!.id;

        await service.deleteUserUrl(shortCode, userId); 
        
        return res.status(200).json({ 
            message: 'URL deletada com sucesso' 
        });
    } catch (error: unknown) {
        next(error)
    }
}


export default {
    shortenUrl,
    redirectLink,
    getUserUrls,
    DeleteUrl
};
