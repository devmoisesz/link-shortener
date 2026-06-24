import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryShortUrlRepository } from "../repositories/in-memory/short-url.in-memory";
import { RedirectLinkService } from "./redirect-link";
import { ShortenUrlService } from "./shortenUrl";
import { generateShortCode } from "../utils/generate.short-code";
import { AppError } from "../middleware/AppError";

let shortUrlRepository: InMemoryShortUrlRepository
let redirectLinkService: RedirectLinkService
let shortenUrlService: ShortenUrlService

describe('Register Use Case', () => {
    beforeEach(async() => {
        shortUrlRepository = new InMemoryShortUrlRepository()
        redirectLinkService = new RedirectLinkService(shortUrlRepository)
        shortenUrlService = new ShortenUrlService(shortUrlRepository)
    })

    it('should return a shortened link.', async () => {
        const result = await shortenUrlService.execute({
            longUrl: 'google.com',
            userId: 'user-01'
        })

        await expect(() => 
            redirectLinkService.execute({
                shortCode: result.shortCode
            })
        )
    })

    it('should not return a shortened link.', async () => {
        const shortCode = generateShortCode()

        await expect(() => 
            redirectLinkService.execute({
                shortCode,
            })
        ).rejects.toBeInstanceOf(AppError)
    })

})
