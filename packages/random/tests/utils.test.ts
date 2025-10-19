import { describe, expect, it, beforeEach } from 'vitest';
import { random, randomInt, randomGaussian, setGlobalPrng, shuffle, choice, sample } from '../dist/utils.js';
import XorShift from '../dist/XorShift.js';

describe('utils', () => {
    beforeEach(() => {
        setGlobalPrng(null as any);
    });

    describe('random', () => {
        it('should generate values in range [0, a) with one argument', () => {
            for (let i = 0; i < 100; i++) {
                const value = random(10);
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThan(10);
            }
        });

        it('should generate values in range [a, b) with two arguments', () => {
            for (let i = 0; i < 100; i++) {
                const value = random(5, 15);
                expect(value).toBeGreaterThanOrEqual(5);
                expect(value).toBeLessThan(15);
            }
        });

        it('should use global PRNG when set', () => {
            const prng = new XorShift(12345);
            setGlobalPrng(prng);

            const value1 = random(10);

            prng.setSeed(12345);
            const value2 = random(10);

            expect(value1).toBe(value2);
        });

        it('should fall back to Math.random when no PRNG set', () => {
            const value = random(10);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(10);
        });
    });

    describe('randomInt', () => {
        it('should generate integers in range [0, a) with one argument', () => {
            for (let i = 0; i < 100; i++) {
                const value = randomInt(10);
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThan(10);
                expect(Number.isInteger(value)).toBe(true);
            }
        });

        it('should generate integers in range [a, b) with two arguments', () => {
            for (let i = 0; i < 100; i++) {
                const value = randomInt(5, 10);
                expect(value).toBeGreaterThanOrEqual(5);
                expect(value).toBeLessThan(10);
                expect(Number.isInteger(value)).toBe(true);
            }
        });

        it('should be able to generate boundary values', () => {
            const values = new Set<number>();

            for (let i = 0; i < 1000; i++) {
                values.add(randomInt(0, 3));
            }

            expect(values.has(0)).toBe(true);
            expect(values.has(1)).toBe(true);
            expect(values.has(2)).toBe(true);
            expect(values.has(3)).toBe(false);
        });

        it('should use global PRNG when set', () => {
            const prng = new XorShift(12345);
            setGlobalPrng(prng);

            const value1 = randomInt(10);

            prng.setSeed(12345);
            const value2 = randomInt(10);

            expect(value1).toBe(value2);
        });
    });

    describe('randomGaussian', () => {
        it('should generate values around the mean', () => {
            const mean = 50;
            const stddev = 10;
            const samples = Array.from({ length: 1000 }, () => randomGaussian(mean, stddev));

            const actualMean = samples.reduce((a, b) => a + b, 0) / samples.length;

            expect(Math.abs(actualMean - mean)).toBeLessThan(2);
        });

        it('should respect standard deviation', () => {
            const mean = 0;
            const stddev = 5;
            const samples = Array.from({ length: 1000 }, () => randomGaussian(mean, stddev));

            const variance = samples.reduce((sum, x) => sum + x ** 2, 0) / samples.length;
            const actualStddev = Math.sqrt(variance);

            expect(Math.abs(actualStddev - stddev)).toBeLessThan(1);
        });

        it('should generate different sequences', () => {
            const values1 = Array.from({ length: 10 }, () => randomGaussian(0, 1));
            const values2 = Array.from({ length: 10 }, () => randomGaussian(0, 1));

            expect(values1).not.toEqual(values2);
        });

        it('should use global PRNG when set', () => {
            const prng = new XorShift(12345);
            setGlobalPrng(prng);

            const value1 = randomGaussian(0, 1);

            prng.setSeed(12345);
            const value2 = randomGaussian(0, 1);

            expect(value1).toBe(value2);
        });

        it('should handle negative mean', () => {
            const mean = -10;
            const stddev = 2;
            const samples = Array.from({ length: 1000 }, () => randomGaussian(mean, stddev));

            const actualMean = samples.reduce((a, b) => a + b, 0) / samples.length;

            expect(Math.abs(actualMean - mean)).toBeLessThan(1);
        });
    });

    describe('setGlobalPrng', () => {
        it('should allow setting a custom PRNG', () => {
            const prng = new XorShift(12345);
            setGlobalPrng(prng);

            const values1 = Array.from({ length: 5 }, () => random(1));

            prng.setSeed(12345);
            const values2 = Array.from({ length: 5 }, () => random(1));

            expect(values1).toEqual(values2);
        });
    });

    describe('shuffle', () => {
        it('should shuffle array in place', () => {
            const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const array = [...original];
            const result = shuffle(array);

            expect(result).toBe(array);
            expect(result).toHaveLength(original.length);
            expect(result.slice().sort((a: number, b: number) => a - b)).toEqual(original);
        });

        it('should handle empty array', () => {
            const array: number[] = [];
            const result = shuffle(array);

            expect(result).toEqual([]);
        });

        it('should handle single element array', () => {
            const array = [42];
            const result = shuffle(array);

            expect(result).toEqual([42]);
        });

        it('should use global PRNG when set', () => {
            const prng = new XorShift(12345);
            setGlobalPrng(prng);

            const array1 = [1, 2, 3, 4, 5];
            shuffle(array1);

            prng.setSeed(12345);
            const array2 = [1, 2, 3, 4, 5];
            shuffle(array2);

            expect(array1).toEqual(array2);
        });
    });

    describe('choice', () => {
        it('should return element from array', () => {
            const array = [1, 2, 3, 4, 5];
            const result = choice(array);

            expect(array).toContain(result);
        });

        it('should return undefined for empty array', () => {
            const array: number[] = [];
            const result = choice(array);

            expect(result).toBeUndefined();
        });

        it('should return only element for single element array', () => {
            const array = [42];
            const result = choice(array);

            expect(result).toBe(42);
        });

        it('should use global PRNG when set', () => {
            const prng = new XorShift(12345);
            setGlobalPrng(prng);

            const array = [1, 2, 3, 4, 5];
            const value1 = choice(array);

            prng.setSeed(12345);
            const value2 = choice(array);

            expect(value1).toBe(value2);
        });
    });

    describe('sample', () => {
        it('should return requested number of unique elements', () => {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const result = sample(array, 5);

            expect(result).toHaveLength(5);
            expect(new Set(result).size).toBe(5);
            result.forEach((item: number) => expect(array).toContain(item));
        });

        it('should return empty array for count <= 0', () => {
            const array = [1, 2, 3, 4, 5];
            expect(sample(array, 0)).toEqual([]);
            expect(sample(array, -1)).toEqual([]);
        });

        it('should return shuffled copy when count >= array length', () => {
            const array = [1, 2, 3, 4, 5];
            const result = sample(array, 10);

            expect(result).toHaveLength(5);
            expect(result.slice().sort((a: number, b: number) => a - b)).toEqual(array);
        });

        it('should handle single element selection', () => {
            const array = [1, 2, 3, 4, 5];
            const result = sample(array, 1);

            expect(result).toHaveLength(1);
            expect(array).toContain(result[0]);
        });

        it('should use global PRNG when set', () => {
            const prng = new XorShift(12345);
            setGlobalPrng(prng);

            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const result1 = sample(array, 5);

            prng.setSeed(12345);
            const result2 = sample(array, 5);

            expect(result1).toEqual(result2);
        });
    });
});
