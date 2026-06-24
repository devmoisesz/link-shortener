import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import app from '../../../app'
import { connectDatabase } from "../../../config/database";
import { UserModel } from "../../repositories/mongoose/users-mongoose.repository";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

describe('Refresh Token (e2e)', () => {
    beforeAll(async() => {
        await connectDatabase()
    })

    afterEach(async () => {
        await UserModel.deleteMany({email: 'fulano@example.com'})
    })

    afterAll(async() => {
        await mongoose.connection.close()
    })

    it('should be able to refresh a token', async () => {
        await request(app).post('/users/register').send({
            name: 'Fulano',
            email: 'fulano@example.com',
            password: '232323'
        })

        const authResponse = await request(app).post('/users/login').send({
            email: 'fulano@example.com',
            password: '232323'
        })

        const cookies = authResponse.get('Set-Cookie')

        const response = await request(app)
            .patch('/users/refresh')
            .set('Cookie', cookies!)
            .send()

        expect(response.status).toEqual(200)

        expect(response.body).toHaveProperty('accessToken')

        const payload = jwt.verify(
            response.body.accessToken,
            process.env.JWT_SECRET!
        )

        expect(payload).toBeTruthy()

        expect(typeof response.body.accessToken).toBe('string')
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ])
    })
})