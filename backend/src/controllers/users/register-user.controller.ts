import { Request, Response, NextFunction } from "express";
import { makeRegisterUser } from "../../services/factories/make-register-user";

const registerUserService = makeRegisterUser()

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body
        await registerUserService.execute({
            name, 
            email, 
            password
        })
        
        return res.status(201).json({message: 'Usuário Registrado!'})
    } catch (error: unknown) {
        next(error)
    }
}