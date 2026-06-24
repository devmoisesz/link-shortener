import request from "supertest"
import app from '../../../app'
import bcrypt from 'bcrypt'
import { MongooseUsersRepository } from "../../repositories/mongoose/users-mongoose.repository"

const usersRepository = new MongooseUsersRepository()

export async function registerAndLoginUser(){
    const email = `user-${Date.now()}@test.com`

    await usersRepository.create({
            name: 'Fulano',
            email,
            password: await bcrypt.hash('232323', 10),
    })

    const authResponse = await request(app).post('/users/login').send({
        email,
        password: '232323'
    })

    const token = authResponse.body

    return token.accessToken
}