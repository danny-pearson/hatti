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
});
