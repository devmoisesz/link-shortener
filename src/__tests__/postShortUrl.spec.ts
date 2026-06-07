import app from "../../app";
import req from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import 'dotenv/config';
import { connectDatabase } from "../../config/database";
import mongoose from "mongoose";

const token = process.env.TOKEN_TESTING

describe('POST /shortener/api/shorten', () => {
    beforeAll (async() => {
        await connectDatabase()
    })
    it('deve retornar link encurtado', async () => {
        const res = await req(app)
        .post('/shortener/api/shorten')
        .set('Authorization', `Bearer ${token}`)
        .send({
            longUrl: "https://github.com/devmoisesz"
        });

        expect(res.status).toBe(201)
    });
    afterAll(async() => {
        await mongoose.disconnect()
    })
});