/**
 * Pseudo-random number generator interface.
 */
export interface PRNG {
    /**
     * Generates the next random integer.
     *
     * @returns Random integer value
     */
    rand(): number;

    /**
     * Returns a random floating-point number in the range [0, 1).
     *
     * @returns Random float between 0 (inclusive) and 1 (exclusive)
     */
    randFloat(): number;

    /**
     * Returns a random integer in the specified range.
     *
     * @param   min - Minimum value (inclusive)
     * @param   max - Maximum value (exclusive)
     * @returns       Random integer in the range [min, max)
     */
    randRange(min: number, max: number): number;

    /**
     * Sets the generator's seed to a new value.
     *
     * @param seed - The new seed value
     */
    setSeed(seed: number): void;

    /**
     * Gets the current seed/state value.
     *
     * @returns The current seed/state value
     */
    getSeed(): number;
}
