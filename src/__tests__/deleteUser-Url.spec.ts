import app from "../../app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import req from 'supertest'
import { connectDatabase } from "../../config/database";
import mongoose from "mongoose";
import 'dotenv/config'

const token = process.env.TOKEN_TESTING

describe('DELETE /shotener/api/:shortCode', () => {
    beforeAll(async()=>{
        await connectDatabase()
    })
    it('Deve proibir usuario deletar url que não o pertence', async() => {
        const res = await req(app)
            .delete('/shortener/api/-G4guC')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(401)
    })
    afterAll(async()=> {
        mongoose.disconnect()
    })
})