import { Request, Response, NextFunction } from "express";
import service from '../services/users.service'

async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
    const { name, email, password } = req.body
    await service.registerUser(name, email, password)
    return res.status(201).json({message: 'Usuário Registrado!'})
    } catch (error: unknown) {
        next(error)
    }
}

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body
        const token = await service.login(email, password)
        return res.status(200).json(token)
    } catch (error) {
       next(error)
    }
}

async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.body
        const { accessToken } = await service.refreshAccessToken(refreshToken);
        return res.status(200).json({ accessToken });
    } catch (error: unknown) {
       next(error)
    }
}

export default{
    registerUser,
    login,
    refresh
}