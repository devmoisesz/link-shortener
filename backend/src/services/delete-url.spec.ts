import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryShortUrlRepository } from "../repositories/in-memory/short-url.in-memory";
import { ShortenUrlService } from "./shortenUrl";
import { generateShortCode } from "../utils/generate.short-code";
import { AppError } from "../middleware/AppError";
import { DeleteUrlService } from "./delete-url";

let shortUrlRepository: InMemoryShortUrlRepository
let deleteUrlService: DeleteUrlService
let shortenUrlService: ShortenUrlService

describe('Register Use Case', () => {
    beforeEach(async() => {
        shortUrlRepository = new InMemoryShortUrlRepository()
        deleteUrlService = new DeleteUrlService(shortUrlRepository)
        shortenUrlService = new ShortenUrlService(shortUrlRepository)
    })

    it('should allow deleting the URL.', async () => {
        const result = await shortenUrlService.execute({
            longUrl: 'github.com',
            userId: 'user-01'
        })

        await expect(() => 
            deleteUrlService.execute({
                shortCode: result.shortCode,
                userId: result.userId
            })
        )
    })

    it('should not allow deleting URLs with non-existent shortcodes.', async () => {
        await expect(() => 
            deleteUrlService.execute({
                shortCode: 'non-existent',
                userId: 'user-01'
            })
        ).rejects.toBeInstanceOf(AppError)   
    })

    it('should not allow unauthenticated users to gain authorization.', async () => {
        const result = await shortenUrlService.execute({
            longUrl: 'github.com',
            userId: 'user-01'
        })

        await expect(() => 
            deleteUrlService.execute({
                shortCode: result.shortCode,
                userId: ''
            })
        ).rejects.toBeInstanceOf(AppError)   
    })
})
