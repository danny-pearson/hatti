import { describe, expect, it } from 'vitest';
import XorShift from '../dist/XorShift.js';

describe('XorShift', () => {
    it('should generate deterministic sequences with same seed', () => {
        const rng1 = new XorShift(12345);
        const rng2 = new XorShift(12345);

        const values1 = Array.from({ length: 10 }, () => rng1.rand());
        const values2 = Array.from({ length: 10 }, () => rng2.rand());

        expect(values1).toEqual(values2);
    });

    it('should generate different sequences with different seeds', () => {
        const rng1 = new XorShift(12345);
        const rng2 = new XorShift(54321);

        const values1 = Array.from({ length: 10 }, () => rng1.rand());
        const values2 = Array.from({ length: 10 }, () => rng2.rand());

        expect(values1).not.toEqual(values2);
    });

    it('should return unsigned 32-bit integers', () => {
        const rng = new XorShift(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.rand();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(0xFFFFFFFF);
            expect(Number.isInteger(value)).toBe(true);
        }
    });

    it('should return floats in range [0, 1)', () => {
        const rng = new XorShift(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.randFloat();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    it('should properly normalize to [0, 1) range', () => {
        const rng = new XorShift(12345);
        const values: number[] = [];

        for (let i = 0; i < 1000; i++) {
            values.push(rng.randFloat());
        }

        const max = Math.max(...values);
        expect(max).toBeLessThan(1);
    });

    it('should return integers in specified range with randRange', () => {
        const rng = new XorShift(12345);

        for (let i = 0; i < 100; i++) {
            const value = rng.randRange(5, 15);
            expect(value).toBeGreaterThanOrEqual(5);
            expect(value).toBeLessThan(15);
            expect(Number.isInteger(value)).toBe(true);
        }
    });

    it('should allow setting seed', () => {
        const rng = new XorShift(12345);
        const value1 = rng.rand();

        rng.setSeed(12345);
        const value2 = rng.rand();

        expect(value1).toBe(value2);
    });

    it('should allow getting seed/state', () => {
        const initialSeed = 12345;
        const rng = new XorShift(initialSeed);

        expect(rng.getSeed()).toBe(initialSeed);

        rng.rand();
        expect(rng.getSeed()).not.toBe(initialSeed);
    });

    it('should handle zero seed without hanging', () => {
        const rng = new XorShift(0);

        const value = rng.rand();
        expect(value).toBe(0);
    });
});
