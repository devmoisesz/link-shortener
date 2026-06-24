import { Schema, model } from 'mongoose';
import { ShortUrlRepository } from '../short-url.repository';

const shortUrlSchema = new Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    longUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ShortUrlSchema = model('ShortUrl', shortUrlSchema);

export interface CreateShortUrlRequest {
    shortCode: string, 
    userId: string | undefined, 
    longUrl: string
}

export class MongooseShortUrlRepository implements ShortUrlRepository {

    async create({shortCode, userId, longUrl}: CreateShortUrlRequest){
        return await ShortUrlSchema.create({
            shortCode,
            userId,
            longUrl
        });
    }

    async findByLongUrl(longUrl: string){
        return await ShortUrlSchema.findOne({
            longUrl
        })
    }

    async exists(shortCode: string) {
        return await ShortUrlSchema.exists({
            shortCode
        });
    }

    async findByShortCode(shortCode: string) {
        return await ShortUrlSchema.findOne({
            shortCode
        });
    }

    async findByUserId(
        userId: string,
        page: number,
        limit: number
    ) {
        const skip = (page - 1) * limit;

        return await ShortUrlSchema.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async countByUserId(userId: string) {
        return await ShortUrlSchema.countDocuments({ userId });
    }

    async deleteByShortCode(shortCode: string) {
        const result = await ShortUrlSchema.deleteOne({ shortCode });

        return result.deletedCount > 0;
    }

}