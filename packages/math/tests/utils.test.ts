import { describe, it, expect } from 'vitest';
import {
    sum,
    clamp,
    lerp,
    midpointScalar,
    remap,
    avg,
    gaussian,
    pxToMm,
    mmToPx,
} from '../dist/utils.js';

describe('utils', () => {
    describe('sum', () => {
        it('returns 0 for no arguments', () => {
            expect(sum()).toBe(0);
        });

        it('returns the value for a single argument', () => {
            expect(sum(5)).toBe(5);
            expect(sum(-3)).toBe(-3);
            expect(sum(0)).toBe(0);
        });

        it('sums positive numbers', () => {
            expect(sum(1, 2, 3)).toBe(6);
            expect(sum(10, 20, 30, 40)).toBe(100);
        });

        it('sums negative numbers', () => {
            expect(sum(-1, -2, -3)).toBe(-6);
            expect(sum(-10, -20, -30)).toBe(-60);
        });

        it('sums mixed positive and negative numbers', () => {
            expect(sum(10, -5, 3, -2)).toBe(6);
            expect(sum(100, -50, -25, 25)).toBe(50);
        });

        it('handles decimal numbers', () => {
            expect(sum(1.5, 2.5, 3.5)).toBeCloseTo(7.5, 10);
            expect(sum(0.1, 0.2, 0.3)).toBeCloseTo(0.6, 10);
        });

        it('handles large arrays', () => {
            const values = Array.from({ length: 1000 }, (_, i) => i);
            expect(sum(...values)).toBe(499500);
        });
    });

    describe('clamp', () => {
        it('returns value when within range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(0, -10, 10)).toBe(0);
            expect(clamp(-5, -10, 0)).toBe(-5);
        });

        it('returns min when value is below range', () => {
            expect(clamp(-5, 0, 10)).toBe(0);
            expect(clamp(-100, -10, 10)).toBe(-10);
            expect(clamp(0, 1, 10)).toBe(1);
        });

        it('returns max when value is above range', () => {
            expect(clamp(15, 0, 10)).toBe(10);
            expect(clamp(100, -10, 10)).toBe(10);
            expect(clamp(50, 0, 25)).toBe(25);
        });

        it('handles equal min and max', () => {
            expect(clamp(5, 10, 10)).toBe(10);
            expect(clamp(15, 10, 10)).toBe(10);
        });

        it('handles negative ranges', () => {
            expect(clamp(-5, -10, -1)).toBe(-5);
            expect(clamp(-15, -10, -1)).toBe(-10);
            expect(clamp(0, -10, -1)).toBe(-1);
        });

        it('handles decimal values', () => {
            expect(clamp(0.5, 0, 1)).toBe(0.5);
            expect(clamp(1.5, 0, 1)).toBe(1);
            expect(clamp(-0.5, 0, 1)).toBe(0);
        });
    });

    describe('lerp', () => {
        it('returns start value when t = 0', () => {
            expect(lerp(0, 10, 0)).toBe(0);
            expect(lerp(-5, 5, 0)).toBe(-5);
            expect(lerp(100, 200, 0)).toBe(100);
        });

        it('returns end value when t = 1', () => {
            expect(lerp(0, 10, 1)).toBe(10);
            expect(lerp(-5, 5, 1)).toBe(5);
            expect(lerp(100, 200, 1)).toBe(200);
        });

        it('returns midpoint when t = 0.5', () => {
            expect(lerp(0, 10, 0.5)).toBe(5);
            expect(lerp(-10, 10, 0.5)).toBe(0);
            expect(lerp(100, 200, 0.5)).toBe(150);
        });

        it('interpolates with various t values', () => {
            expect(lerp(0, 10, 0.25)).toBe(2.5);
            expect(lerp(0, 10, 0.75)).toBe(7.5);
            expect(lerp(0, 100, 0.1)).toBe(10);
        });

        it('extrapolates when t < 0', () => {
            expect(lerp(0, 10, -0.5)).toBe(-5);
            expect(lerp(10, 20, -1)).toBe(0);
        });

        it('extrapolates when t > 1', () => {
            expect(lerp(0, 10, 1.5)).toBe(15);
            expect(lerp(10, 20, 2)).toBe(30);
        });

        it('handles negative ranges', () => {
            expect(lerp(-10, -5, 0.5)).toBe(-7.5);
            expect(lerp(10, -10, 0.5)).toBe(0);
        });

        it('handles decimal values', () => {
            expect(lerp(1.5, 2.5, 0.5)).toBeCloseTo(2, 10);
            expect(lerp(0.1, 0.9, 0.25)).toBeCloseTo(0.3, 10);
        });
    });

    describe('midpointScalar', () => {
        it('calculates midpoint of positive integers', () => {
            expect(midpointScalar(0, 10)).toBe(5);
            expect(midpointScalar(10, 20)).toBe(15);
            expect(midpointScalar(100, 200)).toBe(150);
        });

        it('rounds down for odd sums', () => {
            expect(midpointScalar(0, 11)).toBe(5);
            expect(midpointScalar(1, 10)).toBe(5);
            expect(midpointScalar(5, 6)).toBe(5);
        });

        it('handles same values', () => {
            expect(midpointScalar(10, 10)).toBe(10);
            expect(midpointScalar(0, 0)).toBe(0);
        });

        it('works regardless of argument order', () => {
            expect(midpointScalar(10, 0)).toBe(5);
            expect(midpointScalar(20, 10)).toBe(15);
        });

        it('handles large values', () => {
            expect(midpointScalar(1000, 2000)).toBe(1500);
            expect(midpointScalar(1000000, 2000000)).toBe(1500000);
        });

        it('truncates decimal inputs to integers', () => {
            expect(midpointScalar(1.9, 10.1)).toBe(6);
            expect(midpointScalar(5.5, 10.5)).toBe(8);
        });
    });

    describe('remap', () => {
        it('remaps from [0, 1] to [0, 10]', () => {
            expect(remap(0, 0, 1, 0, 10)).toBe(0);
            expect(remap(0.5, 0, 1, 0, 10)).toBe(5);
            expect(remap(1, 0, 1, 0, 10)).toBe(10);
        });

        it('remaps from [0, 10] to [0, 1]', () => {
            expect(remap(0, 0, 10, 0, 1)).toBe(0);
            expect(remap(5, 0, 10, 0, 1)).toBe(0.5);
            expect(remap(10, 0, 10, 0, 1)).toBe(1);
        });

        it('remaps from [0, 100] to [0, 255]', () => {
            expect(remap(0, 0, 100, 0, 255)).toBe(0);
            expect(remap(50, 0, 100, 0, 255)).toBe(127.5);
            expect(remap(100, 0, 100, 0, 255)).toBe(255);
        });

        it('remaps with negative ranges', () => {
            expect(remap(-1, -1, 1, 0, 10)).toBe(0);
            expect(remap(0, -1, 1, 0, 10)).toBe(5);
            expect(remap(1, -1, 1, 0, 10)).toBe(10);
        });

        it('remaps to negative output ranges', () => {
            expect(remap(0, 0, 1, -10, 10)).toBe(-10);
            expect(remap(0.5, 0, 1, -10, 10)).toBe(0);
            expect(remap(1, 0, 1, -10, 10)).toBe(10);
        });

        it('handles inverted ranges', () => {
            expect(remap(0, 0, 1, 10, 0)).toBe(10);
            expect(remap(0.5, 0, 1, 10, 0)).toBe(5);
            expect(remap(1, 0, 1, 10, 0)).toBe(0);
        });

        it('extrapolates beyond input range', () => {
            expect(remap(-0.5, 0, 1, 0, 10)).toBe(-5);
            expect(remap(1.5, 0, 1, 0, 10)).toBe(15);
        });

        it('handles decimal precision', () => {
            expect(remap(0.333, 0, 1, 0, 100)).toBeCloseTo(33.3, 10);
        });
    });

    describe('avg', () => {
        it('returns the value for a single argument', () => {
            expect(avg(5)).toBe(5);
            expect(avg(-3)).toBe(-3);
            expect(avg(0)).toBe(0);
        });

        it('calculates average of positive numbers', () => {
            expect(avg(1, 2, 3)).toBe(2);
            expect(avg(10, 20, 30)).toBe(20);
            expect(avg(5, 10, 15, 20)).toBe(12.5);
        });

        it('calculates average of negative numbers', () => {
            expect(avg(-1, -2, -3)).toBe(-2);
            expect(avg(-10, -20, -30)).toBe(-20);
        });

        it('calculates average of mixed numbers', () => {
            expect(avg(-10, 10)).toBe(0);
            expect(avg(-5, 0, 5)).toBe(0);
            expect(avg(1, 2, 3, 4, 5)).toBe(3);
        });

        it('handles decimal numbers', () => {
            expect(avg(1.5, 2.5, 3.5)).toBeCloseTo(2.5, 10);
            expect(avg(0.1, 0.2, 0.3)).toBeCloseTo(0.2, 10);
        });

        it('handles large arrays', () => {
            const values = Array.from({ length: 100 }, (_, i) => i);
            expect(avg(...values)).toBe(49.5);
        });
    });

    describe('gaussian', () => {
        it('returns maximum at mean', () => {
            const result = gaussian(0, 0, 1);
            const expectedMax = 1 / Math.sqrt(2 * Math.PI);
            expect(result).toBeCloseTo(expectedMax, 10);
        });

        it('is symmetric around mean', () => {
            const mean = 5;
            const stddev = 2;
            const offset = 3;

            const left = gaussian(mean - offset, mean, stddev);
            const right = gaussian(mean + offset, mean, stddev);

            expect(left).toBeCloseTo(right, 10);
        });

        it('decreases as distance from mean increases', () => {
            const mean = 0;
            const stddev = 1;

            const atMean = gaussian(mean, mean, stddev);
            const at1Sigma = gaussian(mean + stddev, mean, stddev);
            const at2Sigma = gaussian(mean + 2 * stddev, mean, stddev);
            const at3Sigma = gaussian(mean + 3 * stddev, mean, stddev);

            expect(atMean).toBeGreaterThan(at1Sigma);
            expect(at1Sigma).toBeGreaterThan(at2Sigma);
            expect(at2Sigma).toBeGreaterThan(at3Sigma);
        });

        it('handles different standard deviations', () => {
            const mean = 0;

            // At the mean, smaller stddev gives higher peak (narrower, taller curve)
            const narrowAtMean = gaussian(mean, mean, 0.5);
            const mediumAtMean = gaussian(mean, mean, 1);
            const wideAtMean = gaussian(mean, mean, 2);

            expect(narrowAtMean).toBeGreaterThan(mediumAtMean);
            expect(mediumAtMean).toBeGreaterThan(wideAtMean);

            // Verify the function accepts different standard deviations
            expect(narrowAtMean).toBeCloseTo(0.7979, 4);
            expect(mediumAtMean).toBeCloseTo(0.3989, 4);
            expect(wideAtMean).toBeCloseTo(0.1995, 4);
        });

        it('handles different means', () => {
            const stddev = 1;

            const result1 = gaussian(5, 5, stddev);
            const result2 = gaussian(10, 10, stddev);

            expect(result1).toBeCloseTo(result2, 10);
        });

        it('approximates zero far from mean', () => {
            const result = gaussian(0, 0, 1);
            const farAway = gaussian(10, 0, 1);

            expect(farAway).toBeLessThan(result * 0.0001);
        });

        it('handles negative values', () => {
            const result = gaussian(-5, -5, 2);
            const expectedMax = 1 / (2 * Math.sqrt(2 * Math.PI));
            expect(result).toBeCloseTo(expectedMax, 10);
        });

        it('integral properties (68-95-99.7 rule approximation)', () => {
            const mean = 0;
            const stddev = 1;

            const at1Sigma = gaussian(mean + stddev, mean, stddev);
            const at2Sigma = gaussian(mean + 2 * stddev, mean, stddev);

            expect(at1Sigma).toBeCloseTo(0.24197, 5);
            expect(at2Sigma).toBeCloseTo(0.05399, 5);
        });
    });

    describe('pxToMm', () => {
        it('converts pixels to millimeters at default 96 PPI', () => {
            expect(pxToMm(96)).toBeCloseTo(25.4, 10);
            expect(pxToMm(48)).toBeCloseTo(12.7, 10);
            expect(pxToMm(192)).toBeCloseTo(50.8, 10);
        });

        it('handles 0 pixels', () => {
            expect(pxToMm(0)).toBe(0);
            expect(pxToMm(0, 72)).toBe(0);
        });

        it('converts at 72 PPI (print resolution)', () => {
            expect(pxToMm(72, 72)).toBeCloseTo(25.4, 10);
            expect(pxToMm(36, 72)).toBeCloseTo(12.7, 10);
        });

        it('converts at 300 PPI (high print resolution)', () => {
            expect(pxToMm(300, 300)).toBeCloseTo(25.4, 10);
            expect(pxToMm(150, 300)).toBeCloseTo(12.7, 10);
        });

        it('handles decimal pixel values', () => {
            expect(pxToMm(96.5, 96)).toBeCloseTo(25.5323, 3);
        });

        it('handles large pixel values', () => {
            expect(pxToMm(1920, 96)).toBeCloseTo(508, 10);
        });
    });

    describe('mmToPx', () => {
        it('converts millimeters to pixels at default 96 PPI', () => {
            expect(mmToPx(25.4)).toBeCloseTo(96, 10);
            expect(mmToPx(12.7)).toBeCloseTo(48, 10);
            expect(mmToPx(50.8)).toBeCloseTo(192, 10);
        });

        it('handles 0 millimeters', () => {
            expect(mmToPx(0)).toBe(0);
            expect(mmToPx(0, 72)).toBe(0);
        });

        it('converts at 72 PPI (print resolution)', () => {
            expect(mmToPx(25.4, 72)).toBeCloseTo(72, 10);
            expect(mmToPx(12.7, 72)).toBeCloseTo(36, 10);
        });

        it('converts at 300 PPI (high print resolution)', () => {
            expect(mmToPx(25.4, 300)).toBeCloseTo(300, 10);
            expect(mmToPx(12.7, 300)).toBeCloseTo(150, 10);
        });

        it('handles decimal millimeter values', () => {
            expect(mmToPx(25.5, 96)).toBeCloseTo(96.378, 3);
        });

        it('handles large millimeter values', () => {
            expect(mmToPx(500, 96)).toBeCloseTo(1889.76, 2);
        });
    });

    describe('pxToMm and mmToPx inverse relationship', () => {
        it('are inverses at 96 PPI', () => {
            const px = 100;
            expect(mmToPx(pxToMm(px, 96), 96)).toBeCloseTo(px, 10);

            const mm = 50;
            expect(pxToMm(mmToPx(mm, 96), 96)).toBeCloseTo(mm, 10);
        });

        it('are inverses at 72 PPI', () => {
            const px = 100;
            expect(mmToPx(pxToMm(px, 72), 72)).toBeCloseTo(px, 10);

            const mm = 50;
            expect(pxToMm(mmToPx(mm, 72), 72)).toBeCloseTo(mm, 10);
        });

        it('are inverses at 300 PPI', () => {
            const px = 100;
            expect(mmToPx(pxToMm(px, 300), 300)).toBeCloseTo(px, 10);

            const mm = 50;
            expect(pxToMm(mmToPx(mm, 300), 300)).toBeCloseTo(mm, 10);
        });
    });
});
