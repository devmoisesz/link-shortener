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

export default{
    registerUser
}