import { Schema, model } from 'mongoose';

const shortUrlSchema = new Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ShortUrlModel = model(
  'ShortUrl',
  shortUrlSchema
);