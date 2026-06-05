import model from '../models/users.models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

async function registerUser(name: string, email: string, password: string) {
    const checkEmail = await model.findByEmail(email)
    if(checkEmail) throw new Error('Email já cadastrado')
    
    const hashedPassword = await bcrypt.hash(password, 10);

    return await model.create(name, email, hashedPassword)
}

async function login(email: string, password: string) {
    const user = await model.findByEmail(email)
    if(!user) throw new Error('E-mail ou senha incorretos.')
    
    const validPassoword = await bcrypt.compare(password, user.password)
    if(!validPassoword) throw new Error('E-mail ou senha incorretos.')

    const accessToken = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET!,
        {expiresIn: '1d'}
    )

    const refreshToken = jwt.sign(
        {id: user._id },
        process.env.JWT_REFRESH_SECRET!,
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

export default {
    registerUser,
    login
}