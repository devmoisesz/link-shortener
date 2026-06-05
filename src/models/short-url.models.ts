import { Schema, model } from 'mongoose';

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

async function create(shortCode: string, userId: string | undefined, longUrl: string) {
    return await ShortUrlSchema.create({
        shortCode,
        userId,
        longUrl
    });
}

async function findByLongUrl(longUrl: string) {
    return await ShortUrlSchema.findOne({
        longUrl
    })
}

async function exists(shortCode: string) {
    return await ShortUrlSchema.exists({
        shortCode
    });
}

async function findByShortCode(shortCode: string) {
    return await ShortUrlSchema.findOne({
        shortCode
    });
}

export default {
    findByLongUrl,
    create,
    exists,
    findByShortCode
};