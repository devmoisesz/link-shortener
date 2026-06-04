import { Request, Response, NextFunction } from "express";

export class shortenUrl{
    async create(
        req: Request, 
        res: Response, 
        next: NextFunction
    ){
        try {
            const {longUrl } = req.body
            
        } catch (error) {
            
        }
    }
}