import { CreateShortUrlRequest } from "./mongoose/short-url-mongoose.repository"

export interface ShortUrlRepository {
    create(data: CreateShortUrlRequest): Promise<any>
    findByLongUrl(longUrl: string): Promise<any>
    exists(shortCode: string): Promise<any>
    findByShortCode(shortCode: string): Promise<any>
    findByUserId(userId: string, page: number, limit: number): Promise<any>
    countByUserId(userId: string): Promise<any>
    deleteByShortCode(shortCode: string): Promise<any>
}