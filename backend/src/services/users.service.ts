import model from '../models/users.models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { AppError } from '../middleware/AppError';
import { config } from '../../config';

async function registerUser(name: string, email: string, password: string) {
    const checkEmail = await model.findByEmail(email)
    if(checkEmail) throw new AppError('Email já cadastrado', 422)
    
    const hashedPassword = await bcrypt.hash(password, 10);

    return await model.create(name, email, hashedPassword)
}

async function login(email: string, password: string) {
    const user = await model.findByEmail(email)
    if(!user) throw new AppError('E-mail ou senha incorretos.', 400)
    
    const validPassoword = await bcrypt.compare(password, user.password)
    if(!validPassoword) throw new AppError('E-mail ou senha incorretos.', 400)

    const accessToken = jwt.sign(
        {id: user._id},
        config.jwt.secret,
        {expiresIn: '1d'}
    )

    const refreshToken = jwt.sign(
        {id: user._id },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
    )
    return { 
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
     }
}

async function refreshAccessToken(refreshToken: string) {
    try {
        if (!refreshToken) throw new AppError('Refresh token é obrigatório', 400)

        const decoded = jwt.verify(
            refreshToken,
            config.jwt.refreshSecret
        ) as { id: string };

        const accessToken = jwt.sign(
            { id: decoded.id },
            config.jwt.secret,
            { expiresIn: '1d' }
        );

        return { accessToken };
    } catch (error) {
        throw new AppError('Refresh token inválido ou expirado', 400);
    }
}

export default {
    registerUser,
    login,
    refreshAccessToken
}