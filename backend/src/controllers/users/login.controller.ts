import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { config } from '../../../config'
import { makeLogin } from "../../services/factories/make-login"

const loginService = makeLogin()

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body
        const { user } = await loginService.execute({
            email, 
            password
        })

        const accessToken = jwt.sign(
            {id: user.id},
            config.jwt.secret,
            {expiresIn: '30m'}
        )
        
        const refreshToken = jwt.sign(
            {id: user.id },
            config.jwt.refreshSecret,
            { expiresIn: '7d' }
        )

        res.cookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: true,
        })

        res.status(200).json({
            accessToken
        })
    } catch (error) {
       next(error)
    }
}