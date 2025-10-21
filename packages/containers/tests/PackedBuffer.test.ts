import { describe, expect, it } from 'vitest';
import {
    Vector2Float32Array,
    Vector2Uint32Array,
    Vector3Float32Array,
    Vector3Uint32Array,
    Matrix3Float32Array,
    Matrix4Float32Array,
} from '../dist/index.js';

describe('PackedBuffer', () => {
    describe('Vector2Float32Array', () => {
        it('should create array with correct size', () => {
            const arr = new Vector2Float32Array(10);

            expect(arr.count).toBe(10);
            expect(arr.stride).toBe(2);
            expect(arr.data.length).toBe(20);
            expect(arr.data).toBeInstanceOf(Float32Array);
        });

        it('should set and get vectors', () => {
            const arr = new Vector2Float32Array(5);

            arr.set([1.5, 2.5], 0);
            arr.set([3.5, 4.5], 1);

            expect(arr.at(0)).toEqual([1.5, 2.5]);
            expect(arr.at(1)).toEqual([3.5, 4.5]);
        });

        it('should use target array when provided', () => {
            const arr = new Vector2Float32Array(5);
            const target = [0, 0];

            arr.set([10, 20], 2);
            const result = arr.at(2, target);

            expect(result).toBe(target);
            expect(target).toEqual([10, 20]);
        });

        it('should be iterable with for...of', () => {
            const arr = new Vector2Float32Array(3);

            arr.set([1, 2], 0);
            arr.set([3, 4], 1);
            arr.set([5, 6], 2);

            const vectors = [];

            for (const vec of arr) {
                vectors.push(vec);
            }

            expect(vectors).toHaveLength(3);
            expect(vectors[0]).toEqual([1, 2]);
            expect(vectors[1]).toEqual([3, 4]);
            expect(vectors[2]).toEqual([5, 6]);
        });

        it('should work with Array.from', () => {
            const arr = new Vector2Float32Array(2);

            arr.set([1, 2], 0);
            arr.set([3, 4], 1);

            const vectors = Array.from(arr);

            expect(vectors).toEqual([[1, 2], [3, 4]]);
        });

        it('should work with spread operator', () => {
            const arr = new Vector2Float32Array(2);

            arr.set([1, 2], 0);
            arr.set([3, 4], 1);

            const vectors = [...arr];

            expect(vectors).toEqual([[1, 2], [3, 4]]);
        });
    });

    describe('Vector2Uint32Array', () => {
        it('should create array with correct type', () => {
            const arr = new Vector2Uint32Array(10);

            expect(arr.data).toBeInstanceOf(Uint32Array);
            expect(arr.stride).toBe(2);
        });

        it('should handle integer values', () => {
            const arr = new Vector2Uint32Array(5);

            arr.set([100, 200], 0);
            expect(arr.at(0)).toEqual([100, 200]);
        });
    });

    describe('Vector3Float32Array', () => {
        it('should create array with correct stride', () => {
            const arr = new Vector3Float32Array(10);

            expect(arr.stride).toBe(3);
            expect(arr.data.length).toBe(30);
        });

        it('should set and get 3D vectors', () => {
            const arr = new Vector3Float32Array(5);

            arr.set([1.5, 2.5, 3.5], 0);
            expect(arr.at(0)).toEqual([1.5, 2.5, 3.5]);
        });
    });

    describe('Vector3Uint32Array', () => {
        it('should create array with correct type and stride', () => {
            const arr = new Vector3Uint32Array(10);

            expect(arr.data).toBeInstanceOf(Uint32Array);
            expect(arr.stride).toBe(3);
        });
    });

    describe('Matrix3Float32Array', () => {
        it('should create array with correct stride for 3x3 matrices', () => {
            const arr = new Matrix3Float32Array(5);

            expect(arr.stride).toBe(9);
            expect(arr.data.length).toBe(45);
            expect(arr.data).toBeInstanceOf(Float32Array);
        });

        it('should set and get 3x3 matrices', () => {
            const arr = new Matrix3Float32Array(2);
            const matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

            arr.set(matrix, 0);
            expect(arr.at(0)).toEqual(matrix);
        });
    });

    describe('Matrix4Float32Array', () => {
        it('should create array with correct stride for 4x4 matrices', () => {
            const arr = new Matrix4Float32Array(5);

            expect(arr.stride).toBe(16);
            expect(arr.data.length).toBe(80);
            expect(arr.data).toBeInstanceOf(Float32Array);
        });

        it('should set and get 4x4 matrices', () => {
            const arr = new Matrix4Float32Array(2);
            const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

            arr.set(matrix, 0);
            expect(arr.at(0)).toEqual(matrix);
        });
    });

    describe('Edge cases', () => {
        it('should handle zero-length arrays', () => {
            const arr = new Vector2Float32Array(0);

            expect(arr.count).toBe(0);
            expect(arr.data.length).toBe(0);
            expect([...arr]).toEqual([]);
        });

        it('should handle single element arrays', () => {
            const arr = new Vector2Float32Array(1);

            arr.set([42, 43], 0);
            expect(arr.at(0)).toEqual([42, 43]);
        });

        it('should handle accessing different indices', () => {
            const arr = new Vector3Float32Array(10);

            arr.set([1, 2, 3], 0);
            arr.set([4, 5, 6], 5);
            arr.set([7, 8, 9], 9);

            expect(arr.at(0)).toEqual([1, 2, 3]);
            expect(arr.at(5)).toEqual([4, 5, 6]);
            expect(arr.at(9)).toEqual([7, 8, 9]);
        });
    });

    describe('Data access and isolation', () => {
        it('should provide direct access to underlying data buffer', () => {
            const arr = new Vector2Float32Array(5);

            expect(arr.data).toBeInstanceOf(Float32Array);
            expect(arr.data.length).toBe(10);
        });

        it('should not interfere with other elements when setting', () => {
            const arr = new Vector3Float32Array(5);

            arr.set([1, 2, 3], 0);
            arr.set([4, 5, 6], 1);
            arr.set([7, 8, 9], 2);
            arr.set([10, 11, 12], 3);
            arr.set([13, 14, 15], 4);

            // Verify all elements remain unchanged
            expect(arr.at(0)).toEqual([1, 2, 3]);
            expect(arr.at(1)).toEqual([4, 5, 6]);
            expect(arr.at(2)).toEqual([7, 8, 9]);
            expect(arr.at(3)).toEqual([10, 11, 12]);
            expect(arr.at(4)).toEqual([13, 14, 15]);

            // Modify middle element
            arr.set([100, 200, 300], 2);

            // Verify surrounding elements unchanged
            expect(arr.at(1)).toEqual([4, 5, 6]);
            expect(arr.at(2)).toEqual([100, 200, 300]);
            expect(arr.at(3)).toEqual([10, 11, 12]);
        });

        it('should handle partial updates correctly', () => {
            const arr = new Vector2Float32Array(3);

            arr.set([10, 20], 0);
            arr.set([30, 40], 1);
            arr.set([50, 60], 2);

            // Update only middle element
            arr.set([99, 88], 1);

            expect(arr.at(0)).toEqual([10, 20]);
            expect(arr.at(1)).toEqual([99, 88]);
            expect(arr.at(2)).toEqual([50, 60]);
        });
    });

    describe('Iterator behavior', () => {
        it('should create new arrays for each iteration when no target provided', () => {
            const arr = new Vector2Float32Array(2);

            arr.set([1, 2], 0);
            arr.set([3, 4], 1);

            const results = [...arr];

            // Each result should be a different array instance
            expect(results[0]).not.toBe(results[1]);
        });

        it('should handle iteration over empty array', () => {
            const arr = new Vector2Float32Array(0);
            const results = [...arr];

            expect(results).toEqual([]);
        });

        it('should work with for...of multiple times', () => {
            const arr = new Vector2Float32Array(2);

            arr.set([1, 2], 0);
            arr.set([3, 4], 1);

            // First iteration
            const first = [...arr];

            // Second iteration should produce same values
            const second = [...arr];

            expect(first).toEqual(second);
        });
    });

    describe('Target array reuse', () => {
        it('should reuse target array for multiple get calls', () => {
            const arr = new Vector3Float32Array(5);
            const target = [0, 0, 0];

            arr.set([1, 2, 3], 0);
            arr.set([4, 5, 6], 1);
            arr.set([7, 8, 9], 2);

            arr.at(0, target);
            expect(target).toEqual([1, 2, 3]);

            arr.at(1, target);
            expect(target).toEqual([4, 5, 6]);

            arr.at(2, target);
            expect(target).toEqual([7, 8, 9]);
        });

        it('should handle target arrays of different sizes gracefully', () => {
            const arr = new Vector2Float32Array(2);
            const oversizedTarget = [0, 0, 0, 0, 0];

            arr.set([10, 20], 0);
            const result = arr.at(0, oversizedTarget);

            expect(result).toBe(oversizedTarget);
            expect(oversizedTarget[0]).toBe(10);
            expect(oversizedTarget[1]).toBe(20);
            // Extra elements remain unchanged
            expect(oversizedTarget[2]).toBe(0);
        });
    });

    describe('Mixed type arrays', () => {
        it('should maintain type integrity for Uint32 arrays', () => {
            const arr = new Vector2Uint32Array(3);

            // Set with floats - should truncate to integers
            arr.set([1.7, 2.9], 0);
            arr.set([4294967295, 0], 1); // Max uint32

            expect(arr.at(0)).toEqual([1, 2]);
            expect(arr.at(1)).toEqual([4294967295, 0]);
        });

        it('should handle different typed arrays independently', () => {
            const floatArr = new Vector2Float32Array(2);
            const uintArr = new Vector2Uint32Array(2);

            floatArr.set([1.5, 2.5], 0);
            uintArr.set([1.5, 2.5], 0);

            expect(floatArr.at(0)).toEqual([1.5, 2.5]);
            expect(uintArr.at(0)).toEqual([1, 2]);
        });
    });

    describe('Large arrays', () => {
        it('should handle large capacity arrays', () => {
            const arr = new Vector2Float32Array(10000);

            expect(arr.count).toBe(10000);
            expect(arr.data.length).toBe(20000);

            arr.set([1, 2], 0);
            arr.set([3, 4], 9999);

            expect(arr.at(0)).toEqual([1, 2]);
            expect(arr.at(9999)).toEqual([3, 4]);
        });

        it('should iterate over large arrays efficiently', () => {
            const arr = new Vector2Float32Array(1000);

            for (let i = 0; i < 1000; i++) {
                arr.set([i, i * 2], i);
            }

            let count = 0;

            for (const vec of arr) {
                expect(vec).toEqual([count, count * 2]);
                count++;
            }

            expect(count).toBe(1000);
        });
    });

    describe('Matrix arrays', () => {
        it('should handle identity matrix for Matrix3', () => {
            const arr = new Matrix3Float32Array(1);
            const identity = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ];

            arr.set(identity, 0);
            expect(arr.at(0)).toEqual(identity);
        });

        it('should handle identity matrix for Matrix4', () => {
            const arr = new Matrix4Float32Array(1);
            const identity = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];

            arr.set(identity, 0);
            expect(arr.at(0)).toEqual(identity);
        });

        it('should store multiple matrices independently', () => {
            const arr = new Matrix3Float32Array(3);

            const mat1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const mat2 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
            const mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

            arr.set(mat1, 0);
            arr.set(mat2, 1);
            arr.set(mat3, 2);

            expect(arr.at(0)).toEqual(mat1);
            expect(arr.at(1)).toEqual(mat2);
            expect(arr.at(2)).toEqual(mat3);
        });
    });
});
