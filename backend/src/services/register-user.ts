import bcrypt from 'bcrypt'
import { AppError } from "../middleware/AppError";
import { UsersRepository } from '../repositories/users.repository';

interface RegisterUserServiceRequest {
    name: string,
    email: string,
    password: string
}

export class RegisterUserService{
    constructor(private usersRepository: UsersRepository){}

    async execute({name, email, password}: RegisterUserServiceRequest) {
        const checkEmail = await this.usersRepository.findByEmail(email)
        if(checkEmail) throw new AppError('Email já cadastrado', 422)
        
        const hashedPassword = await bcrypt.hash(password, 10);
    
        return await this.usersRepository.create({
            name, 
            email, 
            password: hashedPassword
        })
    }
}