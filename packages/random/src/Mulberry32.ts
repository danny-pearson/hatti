import type { PRNG } from './types';

/**
 * Mulberry32 pseudo-random number generator.
 *
 * Fast and simple 32-bit PRNG with excellent statistical quality. Created by
 * Tommy Ettinger, based on the SplitMix algorithm.
 */
class Mulberry32 implements PRNG {
    private state: number;

    /**
     * Creates a new Mulberry32 generator.
     *
     * @param seed - Initial seed value
     */
    public constructor(seed: number) {
        this.state = seed;
    }

    /**
     * Generates the next random 32-bit unsigned integer.
     *
     * @returns Random unsigned integer in the range [0, 2^32)
     */
    public rand(): number {
        let t = (this.state += 0x6D2B79F5);

        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0);
    }

    /**
     * Generates a random floating-point number in the range [0, 1).
     *
     * @returns Random float between 0 (inclusive) and 1 (exclusive)
     */
    public randFloat(): number {
        return this.rand() / 0x100000000;
    }

    /**
     * Returns a random integer in the specified range.
     *
     * @param   min - Minimum value (inclusive)
     * @param   max - Maximum value (exclusive)
     * @returns       Random integer in the range [min, max)
     */
    public randRange(min: number, max: number): number {
        return Math.floor(min + this.randFloat() * (max - min));
    }

    /**
     * Sets the generator's state to a new seed value.
     *
     * @param newSeed - The new seed value
     */
    public setSeed(newSeed: number): void {
        this.state = newSeed;
    }

    /**
     * Gets the current state value.
     *
     * @returns The current state value
     */
    public getSeed(): number {
        return this.state;
    }
}

export default Mulberry32;
