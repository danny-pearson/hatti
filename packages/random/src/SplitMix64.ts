import type { PRNG } from './types';

/**
 * SplitMix64 pseudo-random number generator.
 *
 * High-quality 64-bit PRNG commonly used to seed other PRNGs. In JavaScript,
 * this implementation uses 32-bit operations to approximate 64-bit behavior.
 */
class SplitMix64 implements PRNG {
    private state: number;

    /**
     * Creates a new SplitMix64 generator.
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
        this.state = (this.state + 0x9E3779B97F4A7C15) | 0;

        let z = this.state;

        z = Math.imul(z ^ (z >>> 30), 0xBF58476D);
        z = Math.imul(z ^ (z >>> 27), 0x94D049BB);

        return (z ^ (z >>> 31)) >>> 0;
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

export default SplitMix64;
