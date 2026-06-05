import { Request, Response } from "express";
import service from '../services/users.service'

async function registerUser(req: Request, res: Response) {
    try {
    const { name, email, password } = req.body
    await service.registerUser(name, email, password)
    return res.status(201).json({message: 'Usuário Registrado!'})
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Email já cadastrado'){
            return res.status(400).json({message: 'Email já cadastrado'})
        }
         return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
}

async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body
        const token = await service.login(email, password)
        return res.status(200).json(token)
    } catch (error) {
        if (error instanceof Error && error.message === 'E-mail ou senha incorretos.'){
            return res.status(400).json({message: 'E-mail ou senha incorretos.'})
        }
         return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
}

async function refresh(req: Request, res: Response) {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(400).json({
                message: 'Refresh token é obrigatório'
            });
        }

        const { accessToken } = await service.refreshAccessToken(refreshToken);
        return res.status(200).json({ accessToken });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('inválido')) {
            return res.status(401).json({
                message: 'Refresh token inválido ou expirado. Faça login novamente.'
            });
        }
        return res.status(500).json({
            message: 'Erro interno do servidor'
        });
    }
}

export default{
    registerUser,
    login,
    refresh
}