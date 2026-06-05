import { Request, Response } from 'express';
import service from '../services/short-url.service';

type RedirectParams = {
    shortCode: string;
};

async function shortenUrl(req: Request, res: Response) {
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

async function getUserUrls(req: Request, res: Response) {
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
        res.status(500).json({
            message: 'Internal server error',
        });
    }
}

async function DeleteUrl(req: Request<RedirectParams>, res: Response) {
    try {
        const shortCode = req.params.shortCode;
        const userId = req.user!.id;

        await service.deleteUserUrl(shortCode, userId); 
        
        return res.status(200).json({ 
            message: 'URL deletada com sucesso' 
        });
    } catch (error: unknown) {
        if (error instanceof Error) 
             { if (error.message === 'URL não encontrada') { 
                return res.status(404).json({ 
                    message: 'URL não encontrada' 
                }); 
            }
            
            if (error.message === 'permissão') { 
                return res.status(403).json({ 
                    message: 'Você não tem permissão para deletar esta URL' 
                }); 
            } 
        }
        
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
     }
}


export default {
    shortenUrl,
    redirectLink,
    getUserUrls,
    DeleteUrl
};
