/**
 * Configuration for a size-specific pool.
 */
interface PoolConfig {
    /**
     * Number of arrays to pool for this size
     */
    size: number;

    /**
     * Current index in the pool
     */
    index: number;

    /**
     * Pooled arrays
     */
    arrays: number[][];
}

/**
 * Multi-size array pool for efficient array reuse with zero garbage collection.
 *
 * Maintains separate pools for different array lengths to avoid resizing overhead
 * and ensure arrays always have the exact requested length.
 *
 * @example
 * ```typescript
 * const pool = new ArrayPool({ defaultPoolSize: 128 });
 *
 * // Get arrays of different sizes
 * const vec2 = pool.get(2); // [0, 0]
 * const vec3 = pool.get(3); // [0, 0, 0]
 *
 * // Use arrays...
 *
 * // Reset when done with batch
 * pool.reset();
 * ```
 */
class ArrayPool {
    private pools: Map<number, PoolConfig>;

    private readonly defaultPoolSize: number;

    /**
     * Creates a new multi-size array pool.
     *
     * @param options - Configuration options
     */
    public constructor(options?: { defaultPoolSize?: number; }) {
        this.defaultPoolSize = options?.defaultPoolSize ?? 128;
        this.pools = new Map();
    }

    /**
     * Gets an array of the specified length from the pool.
     *
     * Arrays are automatically recycled when the pool for that size wraps around.
     * Ensure you're done with an array before requesting more than poolSize arrays
     * of the same length.
     *
     * @param   length - Desired array length
     * @returns          Pooled array filled with zeros
     */
    public get(length: number): number[] {
        let pool = this.pools.get(length);

        if (!pool) {
            pool = {
                size:   this.defaultPoolSize,
                index:  0,
                arrays: Array.from({ length: this.defaultPoolSize }, () => new Array(length).fill(0)),
            };

            this.pools.set(length, pool);
        }

        if (pool.index >= pool.size) {
            pool.index = 0;
        }

        const arr = pool.arrays[pool.index++]!;

        for (let i = 0; i < length; i++) {
            arr[i] = 0;
        }

        return arr;
    }

    /**
     * Resets all pool indices to 0.
     *
     * Call this when you're done with a batch of operations and want to
     * reuse arrays from the beginning of each pool.
     */
    public reset(): void {
        for (const pool of this.pools.values()) {
            pool.index = 0;
        }
    }

    /**
     * Resets the pool for a specific array length.
     *
     * @param length - Array length whose pool should be reset
     */
    public resetSize(length: number): void {
        const pool = this.pools.get(length);

        if (pool) {
            pool.index = 0;
        }
    }

    /**
     * Gets the current utilization of a specific pool (0-1).
     *
     * @param   length - Array length to check
     * @returns          Percentage of pool currently in use, or 0 if pool doesn't exist
     */
    public getUtilization(length: number): number {
        const pool = this.pools.get(length);

        return pool ? pool.index / pool.size : 0;
    }

    /**
     * Gets statistics about all active pools.
     *
     * @returns Map of array length to utilization percentage
     */
    public getStats(): Map<number, number> {
        const stats = new Map<number, number>();

        for (const [length, pool] of this.pools.entries()) {
            stats.set(length, pool.index / pool.size);
        }

        return stats;
    }

    /**
     * Clears all pools and frees memory.
     *
     * Use this when you're completely done with the pool to allow garbage collection.
     */
    public clear(): void {
        this.pools.clear();
    }
}

export default ArrayPool;
