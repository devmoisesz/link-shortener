import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, afterEach } from "vitest";
import app from '../../../app'
import { connectDatabase } from "../../../config/database";
import mongoose from "mongoose";
import { UserModel } from '../../repositories/mongoose/users-mongoose.repository'


describe('Login (e2e)', () => {
    beforeAll(async() => {
        await connectDatabase()
    })

    afterEach(async () => {
        await UserModel.deleteMany({email: 'fulano@example.com'})
    })

    afterAll(async() => {
        await mongoose.connection.close()
    })

    it('should be able to login', async () => {
        await request(app).post('/users/register').send({
            name: 'Fulano',
            email: 'fulano@example.com',
            password: '232323'
        })

        const response = await request(app).post('/users/login').send({
            email: 'fulano@example.com',
            password: '232323'
        })

        expect(response.status).toEqual(200)
    })
})