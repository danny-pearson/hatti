import type { PRNG } from './types';

/**
 * Quadratic CG (Congruential Generator) pseudo-random number generator.
 *
 * Generates pseudo-random numbers using the quadratic congruential method:
 * X(n+1) = (a * X(n)^2 + b * X(n) + c) mod m
 */
class QuadraticCG implements PRNG {
    private seed:              number;

    private multiplier:        number;

    private linearCoefficient: number;

    private increment:         number;

    private modulus:           number;

    /**
     * Creates a new quadratic congruential generator.
     *
     * @param   seed              - Initial seed value
     * @param   multiplier        - Quadratic coefficient (a)
     * @param   linearCoefficient - Linear coefficient (b)
     * @param   increment         - Constant increment (c)
     * @param   modulus           - Modulus value (m)
     */
    public constructor(
        seed: number,
        multiplier = 14348907,
        linearCoefficient = 14348908,
        increment = 65536,
        modulus = 1162261467,
    ) {
        this.seed              = seed;
        this.multiplier        = multiplier;
        this.linearCoefficient = linearCoefficient;
        this.increment         = increment;
        this.modulus           = modulus;
    }

    /**
     * Generates the next random integer in the sequence.
     *
     * @returns Random integer in the range [0, modulus)
     */
    public rand(): number {
        this.seed = (
            this.multiplier * this.seed ** 2 + this.linearCoefficient * this.seed + this.increment
        ) % this.modulus;

        return this.seed;
    }

    /**
     * Generates a random floating-point number in the range [0, 1).
     *
     * @returns Random float between 0 (inclusive) and 1 (exclusive)
     */
    public randFloat(): number {
        return this.rand() / this.modulus;
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
        this.seed = newSeed;
    }

    /**
     * Gets the current seed value.
     *
     * @returns The current seed value
     */
    public getSeed(): number {
        return this.seed;
    }
}

export default QuadraticCG;