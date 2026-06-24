import { Request, Response, NextFunction } from "express";
import { makeDeleteUrl } from "../../services/factories/make-delete-url";

const deleteUrlService = makeDeleteUrl()

export async function deleteUrl(req: Request, res: Response, next: NextFunction) {
    try {
        const shortCode = req.params.shortCode as string
        const userId = req.user!.id;

        await deleteUrlService.execute({
            shortCode, 
            userId
        }); 
        
        return res.status(200).json({ 
            message: 'URL deletada com sucesso' 
        });
    } catch (error: unknown) {
        next(error)
    }
}