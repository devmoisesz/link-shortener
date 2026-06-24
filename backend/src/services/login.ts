import bcrypt from 'bcrypt'
import { AppError } from "../middleware/AppError";
import { MongooseUsersRepository } from '../repositories/mongoose/users-mongoose.repository';
import { UsersRepository } from '../repositories/users.repository';

interface LoginServiceRequest {
    email: string,
    password: string
}

export class LoginService {
    constructor(private usersRepository: UsersRepository){}

    async execute({email, password}: LoginServiceRequest){
        const user = await this.usersRepository.findByEmail(email)

        if(!user) throw new AppError('E-mail ou senha incorretos.', 400)
            
        const validPassoword = await bcrypt.compare(password, user.hashedPassword)

        if(!validPassoword) throw new AppError('E-mail ou senha incorretos.', 400)
        
        return { 
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }
}