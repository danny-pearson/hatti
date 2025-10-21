import { describe, expect, it } from 'vitest';
import ArrayPool from '../dist/ArrayPool.js';

describe('ArrayPool', () => {
    it('should create pool with default size', () => {
        const pool = new ArrayPool();
        const arr = pool.get(2);

        expect(arr).toHaveLength(2);
        expect(arr).toEqual([0, 0]);
    });

    it('should create pool with custom size', () => {
        const pool = new ArrayPool({ defaultPoolSize: 64 });
        const arr = pool.get(3);

        expect(arr).toHaveLength(3);
        expect(arr).toEqual([0, 0, 0]);
    });

    it('should maintain separate pools for different sizes', () => {
        const pool = new ArrayPool();

        const vec2 = pool.get(2);
        const vec3 = pool.get(3);
        const vec4 = pool.get(4);

        expect(vec2).toHaveLength(2);
        expect(vec3).toHaveLength(3);
        expect(vec4).toHaveLength(4);
    });

    it('should zero out arrays on get', () => {
        const pool = new ArrayPool();

        const arr1 = pool.get(3);

        arr1[0] = 42;
        arr1[1] = 43;
        arr1[2] = 44;

        pool.reset();

        const arr2 = pool.get(3);

        expect(arr2).toEqual([0, 0, 0]);
    });

    it('should wrap around when pool is exhausted', () => {
        const pool = new ArrayPool({ defaultPoolSize: 2 });

        const arr1 = pool.get(2);
        const arr2 = pool.get(2);
        const arr3 = pool.get(2); // Should wrap to first array

        arr1[0] = 1;
        arr2[0] = 2;

        // arr3 is actually arr1, so modifying arr3 affects arr1
        expect(arr3).toBe(arr1);
    });

    it('should reset all pools', () => {
        const pool = new ArrayPool({ defaultPoolSize: 4 });

        pool.get(2);
        pool.get(2);
        pool.get(3);

        expect(pool.getUtilization(2)).toBe(0.5); // 2/4
        expect(pool.getUtilization(3)).toBe(0.25); // 1/4

        pool.reset();

        expect(pool.getUtilization(2)).toBe(0);
        expect(pool.getUtilization(3)).toBe(0);
    });

    it('should reset specific pool size', () => {
        const pool = new ArrayPool({ defaultPoolSize: 4 });

        pool.get(2);
        pool.get(2);
        pool.get(3);

        pool.resetSize(2);

        expect(pool.getUtilization(2)).toBe(0);
        expect(pool.getUtilization(3)).toBe(0.25);
    });

    it('should report utilization correctly', () => {
        const pool = new ArrayPool({ defaultPoolSize: 10 });

        expect(pool.getUtilization(2)).toBe(0);

        pool.get(2);
        pool.get(2);
        pool.get(2);

        expect(pool.getUtilization(2)).toBe(0.3); // 3/10
    });

    it('should provide stats for all pools', () => {
        const pool = new ArrayPool({ defaultPoolSize: 10 });

        pool.get(2);
        pool.get(2);
        pool.get(3);
        pool.get(4);
        pool.get(4);
        pool.get(4);

        const stats = pool.getStats();

        expect(stats.get(2)).toBe(0.2); // 2/10
        expect(stats.get(3)).toBe(0.1); // 1/10
        expect(stats.get(4)).toBe(0.3); // 3/10
    });

    it('should clear all pools', () => {
        const pool = new ArrayPool();

        pool.get(2);
        pool.get(3);

        pool.clear();

        expect(pool.getStats().size).toBe(0);
        expect(pool.getUtilization(2)).toBe(0);
        expect(pool.getUtilization(3)).toBe(0);
    });

    it('should handle many concurrent array requests', () => {
        const pool = new ArrayPool({ defaultPoolSize: 100 });
        const arrays = [];

        for (let i = 0; i < 50; i++) {
            arrays.push(pool.get(2));
            arrays.push(pool.get(3));
        }

        expect(arrays).toHaveLength(100);
        expect(pool.getUtilization(2)).toBe(0.5);
        expect(pool.getUtilization(3)).toBe(0.5);
    });

    it('should maintain array length exactly', () => {
        const pool = new ArrayPool();

        const vec2 = pool.get(2);
        const vec3 = pool.get(3);

        vec2[0] = 1;
        vec2[1] = 2;

        expect(vec2).toHaveLength(2);
        expect(vec3).toHaveLength(3);

        pool.reset();

        const vec2Again = pool.get(2);

        expect(vec2Again).toHaveLength(2);
        expect(vec2Again).toEqual([0, 0]);
    });
});
