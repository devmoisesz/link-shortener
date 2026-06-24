import { Request, Response, NextFunction } from "express";
import { GetUserUrlsService } from "../../services/get-user-urls";
import { makeGetUserUrls } from "../../services/factories/make-get-user-urls";

const getUserUrlsService = makeGetUserUrls()

export async function getUserUrls(req: Request, res: Response, next: NextFunction) {
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

        const { urls, total } = await getUserUrlsService.execute({
            userId, 
            page, 
            limit
        });

        return res.status(200).json({urls, total, page, limit,});
    } catch (error: unknown) {
        next(error)
    }
}