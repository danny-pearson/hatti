import type { PRNG } from './types';

/**
 * XorShift pseudo-random number generator.
 *
 * Fast PRNG using bitwise XOR and shift operations. Provides good statistical
 * properties with minimal computational overhead.
 */
class XorShift implements PRNG {
    private state: number;

    /**
     * Creates a new XorShift generator.
     *
     * @param seed - Initial seed value (should be non-zero)
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
        let x = this.state;

        x ^= x << 21;
        x ^= x >>> 35;
        x ^= x << 4;

        this.state = x;

        return x >>> 0;
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

export default XorShift;
