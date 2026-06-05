import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function authentication(req: Request, res: Response, next: NextFunction){
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: 'Token não autorizado'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { id: string };

        req.user = decoded;
        next()
    } catch (error: unknown) {
        throw new Error()
    }
}

export default authentication