import { describe, expect, it } from 'vitest';
import { RectOps } from '../dist/index.js';
import type { RectLike } from '../dist/index.js';

describe('RectOps', () => {
    describe('intersects', () => {
        it('should return true for overlapping rectangles', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [50, 50, 100, 100];
            expect(RectOps.intersects(rect1, rect2)).toBe(true);
            expect(RectOps.intersects(rect2, rect1)).toBe(true);
        });

        it('should return true for completely contained rectangles', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [25, 25, 50, 50];
            expect(RectOps.intersects(rect1, rect2)).toBe(true);
            expect(RectOps.intersects(rect2, rect1)).toBe(true);
        });

        it('should return false for non-overlapping rectangles', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [200, 200, 100, 100];
            expect(RectOps.intersects(rect1, rect2)).toBe(false);
            expect(RectOps.intersects(rect2, rect1)).toBe(false);
        });

        it('should return false for touching rectangles (edge case)', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [100, 0, 100, 100];
            expect(RectOps.intersects(rect1, rect2)).toBe(false);
        });
    });

    describe('containsPoint', () => {
        it('should return true for point inside rectangle', () => {
            const rect: RectLike = [0, 0, 100, 100];
            expect(RectOps.containsPoint(rect, 50, 50)).toBe(true);
        });

        it('should return true for point on the edge', () => {
            const rect: RectLike = [0, 0, 100, 100];
            expect(RectOps.containsPoint(rect, 0, 0)).toBe(true);
            expect(RectOps.containsPoint(rect, 100, 100)).toBe(true);
            expect(RectOps.containsPoint(rect, 0, 100)).toBe(true);
            expect(RectOps.containsPoint(rect, 100, 0)).toBe(true);
        });

        it('should return false for point outside rectangle', () => {
            const rect: RectLike = [0, 0, 100, 100];
            expect(RectOps.containsPoint(rect, 101, 50)).toBe(false);
            expect(RectOps.containsPoint(rect, 50, 101)).toBe(false);
            expect(RectOps.containsPoint(rect, -1, 50)).toBe(false);
            expect(RectOps.containsPoint(rect, 50, -1)).toBe(false);
        });
    });

    describe('contains', () => {
        it('should return true when A completely contains B', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [25, 25, 50, 50];
            expect(RectOps.contains(rect1, rect2)).toBe(true);
        });

        it('should return false when rectangles are equal', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [0, 0, 100, 100];
            expect(RectOps.contains(rect1, rect2)).toBe(false);
        });

        it('should return false when B extends beyond A', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [50, 50, 100, 100];
            expect(RectOps.contains(rect1, rect2)).toBe(false);
        });
    });

    describe('intersection', () => {
        it('should return intersection rectangle for overlapping rects', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [50, 50, 100, 100];
            const result = RectOps.intersection(rect1, rect2);
            expect(result).toEqual([50, 50, 50, 50]);
        });

        it('should return null for non-overlapping rectangles', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [200, 200, 100, 100];
            expect(RectOps.intersection(rect1, rect2)).toBeNull();
        });

        it('should return smaller rect when one contains the other', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [25, 25, 50, 50];
            const result = RectOps.intersection(rect1, rect2);
            expect(result).toEqual([25, 25, 50, 50]);
        });
    });

    describe('intersectionMut', () => {
        it('should write intersection to out array', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [50, 50, 100, 100];
            const out: RectLike = [0, 0, 0, 0];
            const result = RectOps.intersectionMut(out, rect1, rect2);
            expect(result).toBe(out);
            expect(out).toEqual([50, 50, 50, 50]);
        });

        it('should return null for non-overlapping rectangles', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [200, 200, 100, 100];
            const out: RectLike = [0, 0, 0, 0];
            expect(RectOps.intersectionMut(out, rect1, rect2)).toBeNull();
        });
    });

    describe('union', () => {
        it('should return bounding box of two rectangles', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [50, 50, 100, 100];
            const result = RectOps.union(rect1, rect2);
            expect(result).toEqual([0, 0, 150, 150]);
        });

        it('should return the larger rect when one contains the other', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [25, 25, 50, 50];
            const result = RectOps.union(rect1, rect2);
            expect(result).toEqual([0, 0, 100, 100]);
        });

        it('should work with non-overlapping rectangles', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [200, 200, 100, 100];
            const result = RectOps.union(rect1, rect2);
            expect(result).toEqual([0, 0, 300, 300]);
        });
    });

    describe('unionMut', () => {
        it('should write union to out array', () => {
            const rect1: RectLike = [0, 0, 100, 100];
            const rect2: RectLike = [50, 50, 100, 100];
            const out: RectLike = [0, 0, 0, 0];
            const result = RectOps.unionMut(out, rect1, rect2);
            expect(result).toBe(out);
            expect(out).toEqual([0, 0, 150, 150]);
        });
    });

    describe('fromCenter', () => {
        it('should create a rect from center point', () => {
            const result = RectOps.fromCenter(50, 50, 100, 200);
            expect(result).toEqual([0, -50, 100, 200]);
        });

        it('should create a rect centered at origin', () => {
            const result = RectOps.fromCenter(0, 0, 10, 10);
            expect(result).toEqual([-5, -5, 10, 10]);
        });
    });

    describe('getCenter', () => {
        it('should return the center point of the rectangle', () => {
            const rect: RectLike = [0, 0, 100, 200];
            const center = RectOps.getCenter(rect);
            expect(center).toEqual([50, 100]);
        });

        it('should return center for negative coordinates', () => {
            const rect: RectLike = [-50, -100, 100, 200];
            const center = RectOps.getCenter(rect);
            expect(center).toEqual([0, 0]);
        });
    });

    describe('area', () => {
        it('should calculate area correctly', () => {
            const rect: RectLike = [0, 0, 100, 200];
            expect(RectOps.area(rect)).toBe(20000);
        });

        it('should work with zero-sized rectangles', () => {
            const rect: RectLike = [0, 0, 0, 0];
            expect(RectOps.area(rect)).toBe(0);
        });
    });

    describe('perimeter', () => {
        it('should calculate perimeter correctly', () => {
            const rect: RectLike = [0, 0, 100, 200];
            expect(RectOps.perimeter(rect)).toBe(600);
        });

        it('should work with zero-sized rectangles', () => {
            const rect: RectLike = [0, 0, 0, 0];
            expect(RectOps.perimeter(rect)).toBe(0);
        });
    });

    describe('expand', () => {
        it('should expand rectangle in all directions', () => {
            const rect: RectLike = [50, 50, 100, 100];
            const result = RectOps.expand(rect, 10);
            expect(result).toEqual([40, 40, 120, 120]);
        });

        it('should shrink rectangle with negative amount', () => {
            const rect: RectLike = [50, 50, 100, 100];
            const result = RectOps.expand(rect, -10);
            expect(result).toEqual([60, 60, 80, 80]);
        });
    });

    describe('expandMut', () => {
        it('should expand rectangle and write to out', () => {
            const rect: RectLike = [50, 50, 100, 100];
            const out: RectLike = [0, 0, 0, 0];
            const result = RectOps.expandMut(out, rect, 10);
            expect(result).toBe(out);
            expect(out).toEqual([40, 40, 120, 120]);
        });
    });

    describe('translate', () => {
        it('should translate rectangle by offset', () => {
            const rect: RectLike = [0, 0, 100, 100];
            const result = RectOps.translate(rect, 50, 25);
            expect(result).toEqual([50, 25, 100, 100]);
        });

        it('should translate by negative offset', () => {
            const rect: RectLike = [100, 100, 50, 50];
            const result = RectOps.translate(rect, -50, -25);
            expect(result).toEqual([50, 75, 50, 50]);
        });
    });

    describe('translateMut', () => {
        it('should translate rectangle and write to out', () => {
            const rect: RectLike = [0, 0, 100, 100];
            const out: RectLike = [0, 0, 0, 0];
            const result = RectOps.translateMut(out, rect, 50, 25);
            expect(result).toBe(out);
            expect(out).toEqual([50, 25, 100, 100]);
        });
    });
});
