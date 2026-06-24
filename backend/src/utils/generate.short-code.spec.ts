import { generateShortCode } from "../utils/generate.short-code";
import { describe, it, expect } from "vitest";

describe('generateShortCode', () => {
    it('deve gerar short code corretamente', () => {

        const shortCode = generateShortCode()

        expect(shortCode.length).toBe(6)
        expect(typeof shortCode).toBe('string')
    })
})