import { describe, expect, it } from 'vitest';
import QuadraticCG from '../dist/QuadraticCG.js';

describe('QuadraticCG', () => {
    it('should generate deterministic sequences with same seed', () => {
        const rng1 = new QuadraticCG(12345);
        const rng2 = new QuadraticCG(12345);

        const values1 = Array.from({ length: 10 }, () => rng1.rand());
        const values2 = Array.from({ length: 10 }, () => rng2.rand());

        expect(values1).toEqual(values2);
    });

    it('should generate different sequences with different seeds', () => {
        const rng1 = new QuadraticCG(12345);
        const rng2 = new QuadraticCG(54321);

        const values1 = Array.from({ length: 10 }, () => rng1.rand());
        const values2 = Array.from({ length: 10 }, () => rng2.rand());

        expect(values1).not.toEqual(values2);
    });

    it('should return integers within modulus range', () => {
        const modulus = 1162261467;
        const rng = new QuadraticCG(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.rand();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(modulus);
            expect(Number.isInteger(value)).toBe(true);
        }
    });

    it('should return floats in range [0, 1)', () => {
        const rng = new QuadraticCG(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.randFloat();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    it('should return integers in specified range with randRange', () => {
        const rng = new QuadraticCG(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.randRange(5, 15);
            expect(value).toBeGreaterThanOrEqual(5);
            expect(value).toBeLessThan(15);
            expect(Number.isInteger(value)).toBe(true);
        }
    });

    it('should allow setting seed', () => {
        const rng = new QuadraticCG(12345);
        const value1 = rng.rand();

        rng.setSeed(12345);
        const value2 = rng.rand();

        expect(value1).toBe(value2);
    });

    it('should allow getting seed', () => {
        const initialSeed = 12345;
        const rng = new QuadraticCG(initialSeed);

        expect(rng.getSeed()).toBe(initialSeed);

        rng.rand();
        expect(rng.getSeed()).not.toBe(initialSeed);
    });

    it('should support custom parameters', () => {
        const rng = new QuadraticCG(
            12345,
            1103515245,
            12345,
            67890,
            2147483648,
        );

        const value = rng.rand();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(2147483648);
    });
});
