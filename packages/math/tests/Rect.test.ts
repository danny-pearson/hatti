import { describe, expect, it } from 'vitest';
import { Rect } from '../dist/index.js';

describe('Rect', () => {
    describe('constructor', () => {
        it('should create a rect with default values', () => {
            const rect = new Rect();
            expect(rect.x).toBe(0);
            expect(rect.y).toBe(0);
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
        });

        it('should create a rect with provided values', () => {
            const rect = new Rect(10, 20, 100, 200);
            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(200);
        });

        it('should create a rect with partial values', () => {
            const rect = new Rect(5, 10);
            expect(rect.x).toBe(5);
            expect(rect.y).toBe(10);
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
        });
    });

    describe('computed properties', () => {
        it('should compute left edge correctly', () => {
            const rect = new Rect(10, 20, 100, 200);
            expect(rect.left).toBe(10);
        });

        it('should compute top edge correctly', () => {
            const rect = new Rect(10, 20, 100, 200);
            expect(rect.top).toBe(20);
        });

        it('should compute right edge correctly', () => {
            const rect = new Rect(10, 20, 100, 200);
            expect(rect.right).toBe(110);
        });

        it('should compute bottom edge correctly', () => {
            const rect = new Rect(10, 20, 100, 200);
            expect(rect.bottom).toBe(220);
        });

        it('should update computed properties when dimensions change', () => {
            const rect = new Rect(10, 20, 100, 200);
            rect.width = 50;
            rect.height = 80;
            expect(rect.right).toBe(60);
            expect(rect.bottom).toBe(100);
        });

        it('should update computed properties when position changes', () => {
            const rect = new Rect(10, 20, 100, 200);
            rect.x = 30;
            rect.y = 40;
            expect(rect.left).toBe(30);
            expect(rect.top).toBe(40);
            expect(rect.right).toBe(130);
            expect(rect.bottom).toBe(240);
        });
    });

    describe('toArray', () => {
        it('should convert rect to array', () => {
            const rect = new Rect(10, 20, 100, 200);
            const array = rect.toArray();
            expect(array).toEqual([10, 20, 100, 200]);
        });

        it('should return array with default values', () => {
            const rect = new Rect();
            const array = rect.toArray();
            expect(array).toEqual([0, 0, 0, 0]);
        });
    });

    describe('toJSON', () => {
        it('should convert rect to JSON object', () => {
            const rect = new Rect(10, 20, 100, 200);
            const json = rect.toJSON();
            expect(json).toEqual({
                x: 10,
                y: 20,
                width: 100,
                height: 200,
            });
        });

        it('should return JSON with default values', () => {
            const rect = new Rect();
            const json = rect.toJSON();
            expect(json).toEqual({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            });
        });
    });

    describe('fromCenter', () => {
        it('should create a rect from center point', () => {
            const rect = Rect.fromCenter(50, 50, 100, 200);
            expect(rect.x).toBe(0);
            expect(rect.y).toBe(-50);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(200);
        });

        it('should create a rect centered at origin', () => {
            const rect = Rect.fromCenter(0, 0, 10, 10);
            expect(rect.x).toBe(-5);
            expect(rect.y).toBe(-5);
            expect(rect.width).toBe(10);
            expect(rect.height).toBe(10);
        });
    });

    describe('getCenter', () => {
        it('should return the center point of the rectangle', () => {
            const rect = new Rect(0, 0, 100, 200);
            const center = rect.getCenter();
            expect(center).toEqual([50, 100]);
        });

        it('should return center for negative coordinates', () => {
            const rect = new Rect(-50, -100, 100, 200);
            const center = rect.getCenter();
            expect(center).toEqual([0, 0]);
        });
    });

    describe('intersects', () => {
        it('should return true for overlapping rectangles', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(50, 50, 100, 100);
            expect(rect1.intersects(rect2)).toBe(true);
            expect(rect2.intersects(rect1)).toBe(true);
        });

        it('should return true for completely contained rectangles', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(25, 25, 50, 50);
            expect(rect1.intersects(rect2)).toBe(true);
            expect(rect2.intersects(rect1)).toBe(true);
        });

        it('should return false for non-overlapping rectangles', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(200, 200, 100, 100);
            expect(rect1.intersects(rect2)).toBe(false);
            expect(rect2.intersects(rect1)).toBe(false);
        });

        it('should return false for touching rectangles (edge case)', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(100, 0, 100, 100);
            expect(rect1.intersects(rect2)).toBe(false);
        });

        it('should work with RectLike arrays', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2: [number, number, number, number] = [50, 50, 100, 100];
            expect(rect1.intersects(rect2)).toBe(true);
        });
    });

    describe('containsPoint', () => {
        it('should return true for point inside rectangle', () => {
            const rect = new Rect(0, 0, 100, 100);
            expect(rect.containsPoint(50, 50)).toBe(true);
        });

        it('should return true for point on the edge', () => {
            const rect = new Rect(0, 0, 100, 100);
            expect(rect.containsPoint(0, 0)).toBe(true);
            expect(rect.containsPoint(100, 100)).toBe(true);
            expect(rect.containsPoint(0, 100)).toBe(true);
            expect(rect.containsPoint(100, 0)).toBe(true);
        });

        it('should return false for point outside rectangle', () => {
            const rect = new Rect(0, 0, 100, 100);
            expect(rect.containsPoint(101, 50)).toBe(false);
            expect(rect.containsPoint(50, 101)).toBe(false);
            expect(rect.containsPoint(-1, 50)).toBe(false);
            expect(rect.containsPoint(50, -1)).toBe(false);
        });
    });

    describe('contains', () => {
        it('should return true when this rectangle completely contains another', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(25, 25, 50, 50);
            expect(rect1.contains(rect2)).toBe(true);
        });

        it('should return false when rectangles are equal', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(0, 0, 100, 100);
            expect(rect1.contains(rect2)).toBe(false);
        });

        it('should return false when other rectangle extends beyond this one', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(50, 50, 100, 100);
            expect(rect1.contains(rect2)).toBe(false);
        });

        it('should work with RectLike arrays', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2: [number, number, number, number] = [25, 25, 50, 50];
            expect(rect1.contains(rect2)).toBe(true);
        });
    });

    describe('intersection', () => {
        it('should return intersection rectangle for overlapping rects', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(50, 50, 100, 100);
            const result = rect1.intersection(rect2);
            expect(result).toBeInstanceOf(Rect);
            expect(result?.x).toBe(50);
            expect(result?.y).toBe(50);
            expect(result?.width).toBe(50);
            expect(result?.height).toBe(50);
        });

        it('should return null for non-overlapping rectangles', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(200, 200, 100, 100);
            expect(rect1.intersection(rect2)).toBeNull();
        });

        it('should return smaller rect when one contains the other', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(25, 25, 50, 50);
            const result = rect1.intersection(rect2);
            expect(result?.x).toBe(25);
            expect(result?.y).toBe(25);
            expect(result?.width).toBe(50);
            expect(result?.height).toBe(50);
        });
    });

    describe('union', () => {
        it('should return bounding box of two rectangles', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(50, 50, 100, 100);
            const result = rect1.union(rect2);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
            expect(result.width).toBe(150);
            expect(result.height).toBe(150);
        });

        it('should return the larger rect when one contains the other', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(25, 25, 50, 50);
            const result = rect1.union(rect2);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
            expect(result.width).toBe(100);
            expect(result.height).toBe(100);
        });

        it('should work with non-overlapping rectangles', () => {
            const rect1 = new Rect(0, 0, 100, 100);
            const rect2 = new Rect(200, 200, 100, 100);
            const result = rect1.union(rect2);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
            expect(result.width).toBe(300);
            expect(result.height).toBe(300);
        });
    });
});
