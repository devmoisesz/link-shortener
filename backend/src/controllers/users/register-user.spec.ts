import request from 'supertest'
import app from '../../../app'
import { afterAll, beforeAll, describe, expect, it, afterEach } from 'vitest'
import { connectDatabase } from '../../../config/database'
import mongoose from 'mongoose'
import { UserModel } from '../../repositories/mongoose/users-mongoose.repository'

describe('register (e2e)', () => {
    beforeAll(async() => {
        await connectDatabase()
    })

    afterEach(async () => {
        await UserModel.deleteMany({email: 'johndoe@example.com'})
    })

    afterAll(async() => {
        await mongoose.connection.close()
    })

    it('should be able to register', async () => {
        const response = await request(app)
            .post('/users/register')
            .send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '232323'
            })

            expect(response.status).toEqual(201)
    })
})