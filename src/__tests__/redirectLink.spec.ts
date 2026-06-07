import app from "../../app";
import req from 'supertest'
import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { connectDatabase } from "../../config/database";
import mongoose from "mongoose";

describe('GET /shortener/:shortCode', () => {
    beforeAll(async()=> {
        await connectDatabase()
    })
    it('deve redirecionar ao link original', async() => {
        const res = await req(app)
            .get('/shortener/0MzS7m')
            .expect(302)
    
        expect(res.headers.location).toBe('https://github.com/devmoisesz')
    })
    afterAll(async() => {
        await mongoose.disconnect()
    })
})