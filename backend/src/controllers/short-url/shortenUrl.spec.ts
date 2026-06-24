import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, afterEach } from "vitest";
import app from '../../../app'
import { connectDatabase } from "../../../config/database";
import mongoose from "mongoose";
import { ShortUrlModel } from "../../repositories/mongoose/short-url-mongoose.repository";
import { registerAndLoginUser } from "../../utils/test/register-and-login-user";
import { UserModel } from "../../repositories/mongoose/users-mongoose.repository";

describe('Shorten Url (e2e)', () => {
    beforeAll(async() => {
        await connectDatabase()
    })

    afterEach(async () => {
        await ShortUrlModel.deleteMany({})
        await UserModel.deleteMany({})
    })

    afterAll(async() => {
        await mongoose.connection.close()
    })

    it('should be able to shorten URLs.', async () => {
        const token = await registerAndLoginUser()

        const longUrl = `https://example.com/${crypto.randomUUID()}`

        const response = await request(app)
            .post('/shortener/api/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({
                longUrl
            })

        expect(response.status).toEqual(201)
    })
})