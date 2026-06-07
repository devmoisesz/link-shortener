import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

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
            config.jwt.secret
        ) as { id: string };

        req.user = decoded;
        next()
    } catch (error: unknown) {
    return res.status(401).json({
        message: 'Token inválido ou expirado'
    });
}
}

export default authentication