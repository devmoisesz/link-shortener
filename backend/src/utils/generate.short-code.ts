import { nanoid } from 'nanoid';

export function generateShortCode(): string {
    return nanoid(6);
}