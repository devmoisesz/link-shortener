import { Schema, model } from 'mongoose';

const shortUrlSchema = new Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true
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

async function create(shortCode: string, longUrl: string) {
    return await ShortUrlSchema.create({
        shortCode,
        longUrl
    });
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
    create,
    exists,
    findByShortCode
};