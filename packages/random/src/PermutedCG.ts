import type { PRNG } from './types';

/**
 * Permuted CG (Congruential Generator) pseudo-random number generator.
 *
 * Modern PRNG with excellent statistical properties and speed. This is a
 * simplified 32-bit implementation of the PermutedCG family of generators.
 */
class PermutedCG implements PRNG {
    private state:     number;

    private increment: number;

    /**
     * Creates a new PermutedCG generator.
     *
     * @param seed      - Initial seed value
     * @param increment - Stream selection value (must be odd, default is 1442695040888963407)
     */
    public constructor(seed: number, increment = 1442695040888963407) {
        this.state     = 0;
        this.increment = (increment << 1) | 1;
        this.rand();
        this.state += seed;
        this.rand();
    }

    /**
     * Generates the next random 32-bit unsigned integer.
     *
     * @returns Random unsigned integer in the range [0, 2^32)
     */
    public rand(): number {
        const oldState = this.state;

        this.state = Math.imul(oldState, 1664525) + this.increment;

        const xorShifted = (((oldState >>> 18) ^ oldState) >>> 27) >>> 0;
        const rot        = oldState >>> 59;

        return ((xorShifted >>> rot) | (xorShifted << ((-rot) & 31))) >>> 0;
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
     * Sets the generator's seed to a new value.
     *
     * @param newSeed - The new seed value
     */
    public setSeed(newSeed: number): void {
        this.state = 0;
        this.rand();
        this.state += newSeed;
        this.rand();
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

export default PermutedCG;
