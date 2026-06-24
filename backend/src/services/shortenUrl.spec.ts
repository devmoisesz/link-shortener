import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryShortUrlRepository } from "../repositories/in-memory/short-url.in-memory";
import { ShortenUrlService } from "./shortenUrl";

let shortUrlRepository: InMemoryShortUrlRepository
let shortenUrlService: ShortenUrlService

describe('Register Use Case', () => {
    beforeEach(async() => {
        shortUrlRepository = new InMemoryShortUrlRepository()
        shortenUrlService = new ShortenUrlService(shortUrlRepository)
    })

    it('should return a shortened link.', async () => {
        const firstResult = await shortenUrlService.execute({
            longUrl: 'google.com',
            userId: 'user-01'
        })

        const secondResult = await shortenUrlService.execute({
            longUrl: 'google.com',
            userId: 'user-01'
        })

        expect(firstResult.shortCode).toEqual(secondResult.shortCode)
    })

})
