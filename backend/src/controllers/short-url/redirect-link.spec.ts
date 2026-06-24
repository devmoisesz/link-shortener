import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, afterEach } from "vitest";
import app from '../../../app'
import { connectDatabase } from "../../../config/database";
import mongoose from "mongoose";
import { registerAndLoginUser } from "../../utils/test/register-and-login-user";
import { ShortUrlModel } from "../../repositories/mongoose/short-url-mongoose.repository";
import { UserModel } from "../../repositories/mongoose/users-mongoose.repository";

describe('Redirect Link (e2e)', () => {
    beforeAll(async() => {
        await connectDatabase()
    })

    afterEach(async () => {
        await ShortUrlModel.deleteMany({})
        await UserModel.deleteOne({})
    })

    afterAll(async() => {
        await mongoose.connection.close()
    })

    it('This should redirect to the original link.', async () => {
        const accessToken = await registerAndLoginUser()


        const longUrl = `https://example.com/${crypto.randomUUID()}`

        const shortUrl = await request(app)
            .post('/shortener/api/shorten')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                longUrl,
        })

        const response = await request(app)
            .get(`/shortener/${shortUrl.body.shortCode}`)

        expect(response.status).toBe(302)
        expect(response.headers.location).toBe(longUrl)
    })
})