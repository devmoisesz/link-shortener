import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryShortUrlRepository } from "../repositories/in-memory/short-url.in-memory";
import { ShortenUrlService } from "./shortenUrl";
import { AppError } from "../middleware/AppError";
import { GetUserUrlsService } from "./get-user-urls";

let shortUrlRepository: InMemoryShortUrlRepository
let getUserUrlsService: GetUserUrlsService
let shortenUrlService: ShortenUrlService

describe('Register Use Case', () => {
    beforeEach(async() => {
        shortUrlRepository = new InMemoryShortUrlRepository()
        getUserUrlsService = new GetUserUrlsService(shortUrlRepository)
        shortenUrlService = new ShortenUrlService(shortUrlRepository)
    })

    it('should return the users URLs.', async () => {
        await shortenUrlService.execute({
            longUrl: 'google.com',
            userId: 'user-01'
        })

        await shortenUrlService.execute({
            longUrl: 'github.com',
            userId: 'user-01'
        })

        const { urls } = await getUserUrlsService.execute({
            userId: 'user-01',
            page: 1,
            limit: 10
        })

        expect(urls).toHaveLength(2)
        expect(urls).toEqual([
            expect.objectContaining({userId: 'user-01'}),
            expect.objectContaining({userId: 'user-01'})
        ])
    })

    it('Unauthenticated users should not be allowed to fetch URLs.', async () => {
        await shortenUrlService.execute({
            longUrl: 'google.com',
            userId: ''
        })

        await shortenUrlService.execute({
            longUrl: 'github.com',
            userId: ''
        })

        await expect(() => 
            getUserUrlsService.execute({
                userId: '',
                page: 1,
                limit: 10
            })
        ).rejects.toBeInstanceOf(AppError)   
    })
})
