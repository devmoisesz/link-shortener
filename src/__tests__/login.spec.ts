import app from "../../app";
import req from 'supertest';
import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { connectDatabase } from "../../config/database";
import mongoose from "mongoose";

describe('POST /users/login', () => {
    beforeAll (async() => {
        await connectDatabase()
    })
    it('deve aprovar login, status code 200', async () =>{
        const res = await req(app)
            .post('/users/login')
            .send({
                email: "teste@gmail.com",
                password: "202020"
            })

        expect(res.status).toBe(200)
    })
    it('deve bloquear login com dados invalidos, status code 400', async () => {
        const res = await req(app)
            .post('/users/login')
            .send({
                email: "teste123@gmail.com",
                password: "121212"
            })

            expect(res.status).toBe(400)
    })
    afterAll(async() => {
        await mongoose.disconnect()
    })
})