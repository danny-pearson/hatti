import { TAU } from './constants.js';

/**
 * Returns the sum of all provided numbers.
 *
 * @param   values - Numbers to sum
 * @returns          The sum
 */
export const sum = (...values: number[]): number => {
    let total = 0;

    for (const value of values) {
        total += value;
    }
    return total;
};

/**
 * Restricts a number to be within a given range.
 *
 * @param   value - The value to clamp
 * @param   min   - Minimum allowed value
 * @param   max   - Maximum allowed value
 * @returns         The clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Linearly interpolates between a and b by t.
 *
 * @param   a - Start value
 * @param   b - End value
 * @param   t - Interpolation factor (0-1)
 * @returns     The interpolated value
 */
export const lerp = (a: number, b: number, t: number) => {
    return a + (b - a) * t;
};

/**
 * Returns the integer midpoint between two numbers (bitwise, fast).
 *
 * @param   a - First value
 * @param   b - Second value
 * @returns     The midpoint (rounded down)
 */
export const midpointScalar = (a: number, b: number): number => {
    return (a + b) >>> 1;
};

/**
 * Remaps a value from one range to another.
 *
 * @param   value   - The input value
 * @param   inMin   - Input range minimum
 * @param   inMax   - Input range maximum
 * @param   outMin  - Output range minimum
 * @param   outMax  - Output range maximum
 * @returns           The remapped value
 */
export const remap = (
    value:  number,
    inMin:  number,
    inMax:  number,
    outMin: number,
    outMax: number,
): number => {
    return outMin
        + (value - inMin)
        * (outMax - outMin)
        / (inMax - inMin);
};

/**
 * Returns the average of all provided numbers.
 *
 * @param   values - Numbers to average
 * @returns          The mean value
 */
export const avg = (...values: number[]): number => {
    return sum(...values) / values.length;
};

/**
 * Computes the value of a Gaussian (normal) distribution at x.
 *
 * @param   x      - The input value
 * @param   mean   - The mean of the distribution
 * @param   stddev - The standard deviation
 * @returns          The probability density at x
 */
export const gaussian = (x: number, mean: number, stddev: number): number => {
    const sqrtTau  = Math.sqrt(TAU);
    const coeff    = 1.0 / (stddev * sqrtTau);
    const exponent = -((x - mean) ** 2) / (2.0 * (stddev ** 2));

    return coeff * Math.exp(exponent);
};

/**
 * Converts pixels to millimeters.
 *
 * @param   px  - The pixel value
 * @param   ppi - Pixels per inch (default 96)
 * @returns       The value in millimeters
 */
export const pxToMm = (px: number, ppi = 96) => {
    return (px / ppi) * 25.4;
};

/**
 * Converts millimeters to pixels.
 *
 * @param   mm  - The millimeter value
 * @param   ppi - Pixels per inch (default 96)
 * @returns       The value in pixels
 */
export const mmToPx = (mm: number, ppi = 96) => {
    return (mm / 25.4) * ppi;
};
