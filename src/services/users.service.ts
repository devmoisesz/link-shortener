import model from '../models/users.models';
import bcrypt from 'bcrypt';

async function registerUser(name: string, email: string, password: string) {
    const checkEmail = await model.findByEmail(email)
    if(checkEmail) throw new Error('Email já cadastrado')
    
    const hashedPassword = await bcrypt.hash(password, 10);

    return await model.create(name, email, hashedPassword)
}

export default {
    registerUser
}