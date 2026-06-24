import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, afterEach } from "vitest";
import app from '../../../app'
import { connectDatabase } from "../../../config/database";
import mongoose from "mongoose";
import { ShortUrlModel } from "../../repositories/mongoose/short-url-mongoose.repository";
import { registerAndLoginUser } from "../../utils/test/register-and-login-user";
import { UserModel } from "../../repositories/mongoose/users-mongoose.repository";

describe('Get User Urls (e2e)', () => {
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

    it('should be possible to list the users URLs.', async () => {
        const token = await registerAndLoginUser()

        const firstLongUrl = `https://example.com/${crypto.randomUUID()}`
        const secondLongUrl = `https://example.com/${crypto.randomUUID()}`

        await request(app)
            .post('/shortener/api/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({
                longUrl: firstLongUrl
            })

        await request(app)
            .post('/shortener/api/shorten')
            .set('Authorization', `Bearer ${token}`)
            .send({
                longUrl: secondLongUrl
            })

        const response = await request(app)
            .get('/shortener/api/urls')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toEqual(200)
        expect(response.body.total).toEqual(2)

        expect(response.body.urls).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    longUrl: firstLongUrl
                }),
                expect.objectContaining({
                    longUrl: secondLongUrl
                })
            ])
        )
    })
})