import { describe, expect, it } from 'vitest';
import PermutedCG from '../dist/PermutedCG.js';

describe('PermutedCG', () => {
    it('should generate deterministic sequences with same seed', () => {
        const rng1 = new PermutedCG(12345);
        const rng2 = new PermutedCG(12345);

        const values1 = Array.from({ length: 10 }, () => rng1.rand());
        const values2 = Array.from({ length: 10 }, () => rng2.rand());

        expect(values1).toEqual(values2);
    });

    it('should generate different sequences with different seeds', () => {
        const rng1 = new PermutedCG(12345);
        const rng2 = new PermutedCG(54321);

        const values1 = Array.from({ length: 10 }, () => rng1.rand());
        const values2 = Array.from({ length: 10 }, () => rng2.rand());

        expect(values1).not.toEqual(values2);
    });

    it('should return unsigned 32-bit integers', () => {
        const rng = new PermutedCG(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.rand();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(0xFFFFFFFF);
            expect(Number.isInteger(value)).toBe(true);
        }
    });

    it('should return floats in range [0, 1)', () => {
        const rng = new PermutedCG(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.randFloat();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    it('should return integers in specified range with randRange', () => {
        const rng = new PermutedCG(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.randRange(5, 15);
            expect(value).toBeGreaterThanOrEqual(5);
            expect(value).toBeLessThan(15);
            expect(Number.isInteger(value)).toBe(true);
        }
    });

    it('should support custom increment', () => {
        const rng = new PermutedCG(12345, 7777);
        const value = rng.rand();

        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(0xFFFFFFFF);
    });

    it('should allow setting seed', () => {
        const rng = new PermutedCG(12345);
        const values1 = Array.from({ length: 5 }, () => rng.rand());

        rng.setSeed(12345);
        const values2 = Array.from({ length: 5 }, () => rng.rand());

        expect(values1).toEqual(values2);
    });
});
