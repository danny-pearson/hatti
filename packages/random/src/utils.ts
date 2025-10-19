import type { PRNG } from './types';

let globalPrng: PRNG | null = null;

/**
 * Sets the global PRNG used by utility functions.
 *
 * @param prng - The PRNG instance to use globally
 */
export const setGlobalPrng = (prng: PRNG) => {
    globalPrng = prng;
};

/**
 * Generates a random floating-point number.
 *
 * @param   a - Maximum value (if b is not provided) or minimum value (if b is provided)
 * @param   b - Maximum value (optional)
 * @returns     Random float in the range [0, a) or [a, b)
 */
export const random = (a: number, b?: number): number => {
    if (globalPrng) {
        return typeof b === 'number'
            ? a + globalPrng.randFloat() * (b - a)
            : globalPrng.randFloat() * a;
    }

    return typeof b === 'number'
        ? a + Math.random() * (b - a)
        : Math.random() * a;
};

/**
 * Generates a random integer.
 *
 * @param   a - Maximum value exclusive (if b is not provided) or minimum value inclusive (if b is provided)
 * @param   b - Maximum value exclusive (optional)
 * @returns     Random integer in the range [0, a) or [a, b)
 */
export const randomInt = (a: number, b?: number): number => {
    if (typeof b === 'number') {
        if (globalPrng) {
            return globalPrng.randRange(a, b);
        }

        return Math.floor(a + Math.random() * (b - a));
    }

    if (globalPrng) {
        return Math.floor(globalPrng.randFloat() * a);
    }

    return Math.floor(Math.random() * a);
};

/**
 * Generates a random number from a Gaussian (normal) distribution.
 *
 * Uses the Box-Muller transform to convert uniform random numbers into
 * normally distributed values.
 *
 * @param   mean   - Mean of the distribution
 * @param   stddev - Standard deviation of the distribution
 * @returns          Random value from the Gaussian distribution
 */
export const randomGaussian = (mean: number, stddev: number): number => {
    let x1 = random(2) - 1;
    let x2 = random(2) - 1;

    let w = x1 * x1 + x2 * x2;

    while (w >= 1) {
        x1 = random(2) - 1;
        x2 = random(2) - 1;

        w = x1 * x1 + x2 * x2;
    }

    w = Math.sqrt(-2 * Math.log(w) / w);

    return (x1 * w) * stddev + mean;
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 *
 * @param   arr - The array to shuffle
 * @returns       The shuffled array (same reference as input)
 */
export const shuffle = <Type>(arr: Type[]): Type[] => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j    = randomInt(0, i);
        const temp = arr[i]!;

        arr[i] = arr[j]!;
        arr[j] = temp;
    }

    return arr;
};

/**
 * Randomly selects an element from an array.
 *
 * @param   arr - The array to choose from
 * @returns       A random element from the array, or undefined if array is empty
 */
export const choice = <Type>(arr: Type[]): Type | undefined => {
    return arr.length === 0
        ? undefined
        : arr[randomInt(arr.length)];
};

/**
 * Randomly selects multiple unique elements from an array.
 *
 * @param   arr   - The array to sample from
 * @param   count - Number of elements to select
 * @returns         Array of randomly selected unique elements
 */
export const sample = <Type>(arr: Type[], count: number): Type[] => {
    if (count <= 0) return [];

    if (count >= arr.length) return shuffle([...arr]);

    const result  = new Set<Type>();
    const indices = new Set<number>();

    while (result.size < count) {
        const index = randomInt(arr.length);

        if (!indices.has(index)) {
            indices.add(index);
            result.add(arr[index]!);
        }
    }

    return [...result];
};
