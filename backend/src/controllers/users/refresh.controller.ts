import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../../../config'

export async function refresh(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh token não encontrado'
            })
        }

        const decoded = jwt.verify(
            refreshToken,
            config.jwt.refreshSecret
        ) as {
            id: string
        }

        const accessToken = jwt.sign(
            { id: decoded.id },
            config.jwt.secret,
            {
                expiresIn: '30m'
            }
        )

        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            config.jwt.refreshSecret,
            {
                expiresIn: '7d'
            }
        )

        res.cookie('refreshToken', newRefreshToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        return res.status(200).json({
            accessToken
        })
    } catch (error) {
        next(error)
    }
}