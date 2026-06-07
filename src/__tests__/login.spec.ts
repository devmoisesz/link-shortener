import app from "../../app";
import req from 'supertest';
import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { connectDatabase } from "../../config/database";
import mongoose from "mongoose";

describe('POST /users/login', () => {
    beforeAll (async() => {
        connectDatabase()
    })
    it('deve retornar status code 400', async () => {
        const res = await req(app)
            .post('/users/login')
            .send({
                email: "teste123@gmail.com",
                password: "121212"
            })

            expect(res.status).toBe(400)
    })
    afterAll(async() => {
        mongoose.disconnect()
    })
})