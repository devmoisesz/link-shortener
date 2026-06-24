import { randomUUID } from "node:crypto";
import { ShortUrlRepository } from "../short-url.repository";
import { generateShortCode } from "../../utils/generate.short-code";

interface Url {
    shortCode: string,
    userId: string,
    longUrl: string
}

export class InMemoryShortUrlRepository implements ShortUrlRepository{
    public items: Url[] = []

    async create({shortCode, userId, longUrl}: Url){
        const shortUrl = {
            id: randomUUID(),
            shortCode,
            userId,
            longUrl,
            created_at: new Date()
        }

        this.items.push(shortUrl)

        return shortUrl
    }

    async findByLongUrl(longUrl: string) {
        return this.items.find((item) => item.longUrl === longUrl)
    }

    async exists(shortCode: string) {
        return this.items.find((item) => item.shortCode === shortCode)
    }

    async findByShortCode(shortCode: string) {
        return this.items.find((item) => item.shortCode === shortCode)
    }

    async findByUserId(userId: string, page: number, limit: number) {
        return this.items
            .filter((item) => item.userId === userId)
            .slice((page - 1) * limit)
    }

    async countByUserId(userId: string) {
        return this.items.filter((item) => item.userId === userId).length
    }

    async deleteByShortCode(shortCode: string) {
        const index = this.items.findIndex(url => url.shortCode === shortCode)

        if (index === -1) {
            return false
        }

        this.items.splice(index, 1)

        return true
    }    
}