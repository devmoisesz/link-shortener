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

export const ShortUrlModel = model('ShortUrl', shortUrlSchema);

export interface CreateShortUrlRequest {
    shortCode: string, 
    userId: string | undefined, 
    longUrl: string
}

export class MongooseShortUrlRepository implements ShortUrlRepository {

    async create({shortCode, userId, longUrl}: CreateShortUrlRequest){
        return await ShortUrlModel.create({
            shortCode,
            userId,
            longUrl
        });
    }

    async findByLongUrl(longUrl: string){
        return await ShortUrlModel.findOne({
            longUrl
        })
    }

    async exists(shortCode: string) {
        return await ShortUrlModel.exists({
            shortCode
        });
    }

    async findByShortCode(shortCode: string) {
        return await ShortUrlModel.findOne({
            shortCode
        });
    }

    async findByUserId(
        userId: string,
        page: number,
        limit: number
    ) {
        const skip = (page - 1) * limit;

        return await ShortUrlModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async countByUserId(userId: string) {
        return await ShortUrlModel.countDocuments({ userId });
    }

    async deleteByShortCode(shortCode: string) {
        const result = await ShortUrlModel.deleteOne({ shortCode });

        return result.deletedCount > 0;
    }

}