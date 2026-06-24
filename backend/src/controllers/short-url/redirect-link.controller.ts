import { Request, Response, NextFunction } from 'express';
import { RedirectLinkService } from '../../services/redirect-link';
import { makeRedirectLink } from '../../services/factories/make-redirect-link';

const redirectLinkSerice = makeRedirectLink()

interface RedirectParams {
    shortCode: string;
};

export async function redirectLink(req: Request<RedirectParams>, res: Response, next: NextFunction) {
    try {
        const shortCode = req.params.shortCode;
        const url = await redirectLinkSerice.execute({shortCode});
        res.redirect(url);
    } catch (error: unknown) {
        next(error)
    }
}