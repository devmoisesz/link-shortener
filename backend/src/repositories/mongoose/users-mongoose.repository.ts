import { Schema, model } from 'mongoose'
import { UsersRepository } from '../users.repository';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
        }
    },
    {
        timestamps: true
    }
);

const UserSchema = model('User', userSchema);

export interface CreateUserRequest {
    name: string
    email: string
    password: string
}

export class MongooseUsersRepository implements UsersRepository {
    
    async create({name, email, password}: CreateUserRequest) {
        return await UserSchema.create({
            name, 
            email,
            password,
        });
    }

    async findByEmail(email: string) {
        return await UserSchema.findOne({
            email
        })
    }
}