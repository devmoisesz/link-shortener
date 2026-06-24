import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, afterEach } from "vitest";
import app from '../../../app'
import { connectDatabase } from "../../../config/database";
import mongoose from "mongoose";
import { registerAndLoginUser } from "../../utils/test/register-and-login-user";
import { ShortUrlModel } from "../../repositories/mongoose/short-url-mongoose.repository";
import { UserModel } from "../../repositories/mongoose/users-mongoose.repository";

describe('Delete URL (e2e)', () => {
    beforeAll(async () => {
        await connectDatabase()
    })

    afterEach(async () => {
        await ShortUrlModel.deleteMany({})
        await UserModel.deleteMany({})
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    it('should be able to delete an URL', async () => {
        const accessToken = await registerAndLoginUser()

        const longUrl = `https://example.com/${crypto.randomUUID()}`

        const shortenResponse = await request(app)
            .post('/shortener/api/shorten')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                longUrl
            })

        const shortCode = shortenResponse.body.shortCode

        const response = await request(app)
            .delete(`/shortener/api/${shortCode}`)
            .set('Authorization', `Bearer ${accessToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            message: 'URL deletada com sucesso'
        })

        const deletedUrl = await ShortUrlModel.findOne({
            shortCode
        })

        expect(deletedUrl).toBeNull()
    })

    it('should not be able to delete another user URL', async () => {
        const token1 = await registerAndLoginUser()
        const token2 = await registerAndLoginUser()

        const shortenResponse = await request(app)
            .post('/shortener/api/shorten')
            .set('Authorization', `Bearer ${token1}`)
            .send({
                longUrl: `https://example.com/${crypto.randomUUID()}`
            })

        const response = await request(app)
            .delete(`/shortener/api/${shortenResponse.body.shortCode}`)
            .set('Authorization', `Bearer ${token2}`)

        expect(response.status).toBe(401) 
})
})