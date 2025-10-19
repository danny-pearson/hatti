import { TAU } from './constants.js';
import type { Vector2Like } from '.';
import { prng } from '@hatti/random';

/**
 * Adds two vectors.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      The result vector
 */
export const add = (v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    return [v1[0] + v2[0], v1[1] + v2[1]];
};

/**
 * Adds two vectors and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v1  - The first vector
 * @param   v2  - The second vector
 * @returns       The output vector
 */
export const addMut = (out: Vector2Like, v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];

    return out;
};

/**
 * Adds a scalar to both components of a vector.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const addScalar = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] + value, v[1] + value];
};

/**
 * Adds a scalar to both components of a vector and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const addScalarMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] + value;
    out[1] = v[1] + value;

    return out;
};

/**
 * Adds a scalar to the X component of a vector.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const addScalarX = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] + value, v[1]];
};

/**
 * Adds a scalar to the X component of a vector and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const addScalarXMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] + value;

    return out;
};

/**
 * Adds a scalar to the Y component of a vector.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const addScalarY = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0], v[1] + value];
};

/**
 * Adds a scalar to the Y component of a vector and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const addScalarYMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[1] = v[1] + value;

    return out;
};

/**
 * Subtracts one vector from another.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      The result vector
 */
export const sub = (v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    return [v1[0] - v2[0], v1[1] - v2[1]];
};

/**
 * Subtracts one vector from another and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v1  - The first vector
 * @param   v2  - The second vector
 * @returns       The output vector
 */
export const subMut = (out: Vector2Like, v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];

    return out;
};

/**
 * Subtracts a scalar from both components of a vector.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const subScalar = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] - value, v[1] - value];
};

/**
 * Subtracts a scalar from both components of a vector and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const subScalarMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] - value;
    out[1] = v[1] - value;

    return out;
};

/**
 * Subtracts a scalar from the X component of a vector.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const subScalarX = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] - value, v[1]];
};

/**
 * Subtracts a scalar from the X component of a vector and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const subScalarXMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] - value;

    return out;
};

/**
 * Subtracts a scalar from the Y component of a vector.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const subScalarY = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0], v[1] - value];
};

/**
 * Subtracts a scalar from the Y component of a vector and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const subScalarYMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[1] = v[1] - value;

    return out;
};

/**
 * Multiplies two vectors component-wise.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      The result vector
 */
export const mul = (v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    return [v1[0] * v2[0], v1[1] * v2[1]];
};

/**
 * Multiplies two vectors component-wise and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v1  - The first vector
 * @param   v2  - The second vector
 * @returns       The output vector
 */
export const mulMut = (out: Vector2Like, v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    out[0] = v1[0] * v2[0];
    out[1] = v1[1] * v2[1];

    return out;
};

/**
 * Multiplies both components of a vector by a scalar.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const mulScalar = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] * value, v[1] * value];
};

/**
 * Multiplies both components of a vector by a scalar and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const mulScalarMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] * value;
    out[1] = v[1] * value;

    return out;
};

/**
 * Multiplies the X component of a vector by a scalar.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const mulScalarX = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] * value, v[1]];
};

/**
 * Multiplies the X component of a vector by a scalar and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const mulScalarXMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] * value;

    return out;
};

/**
 * Multiplies the Y component of a vector by a scalar.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const mulScalarY = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0], v[1] * value];
};

/**
 * Multiplies the Y component of a vector by a scalar and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const mulScalarYMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[1] = v[1] * value;

    return out;
};

/**
 * Divides two vectors component-wise.
 *
 * @param   v1 - The numerator vector
 * @param   v2 - The denominator vector
 * @returns      The result vector
 */
export const div = (v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    return [v1[0] / v2[0], v1[1] / v2[1]];
};

/**
 * Divides two vectors component-wise and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v1  - The numerator vector
 * @param   v2  - The denominator vector
 * @returns       The output vector
 */
export const divMut = (out: Vector2Like, v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    out[0] = v1[0] / v2[0];
    out[1] = v1[1] / v2[1];

    return out;
};

/**
 * Divides both components of a vector by a scalar.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const divScalar = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] / value, v[1] / value];
};

/**
 * Divides both components of a vector by a scalar and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const divScalarMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] / value;
    out[1] = v[1] / value;

    return out;
};

/**
 * Divides the X component of a vector by a scalar.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const divScalarX = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0] / value, v[1]];
};

/**
 * Divides the X component of a vector by a scalar and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const divScalarXMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[0] = v[0] / value;

    return out;
};

/**
 * Divides the Y component of a vector by a scalar.
 *
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The result vector
 */
export const divScalarY = (v: Vector2Like, value: number): Vector2Like => {
    return [v[0], v[1] / value];
};

/**
 * Divides the Y component of a vector by a scalar and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The scalar value
 * @returns         The output vector
 */
export const divScalarYMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    out[1] = v[1] / value;

    return out;
};

/**
 * Translates a vector by x and y offsets.
 *
 * @param   v - The input vector
 * @param   x - The x offset
 * @param   y - The y offset
 * @returns     The translated vector
 */
export const translate = (v: Vector2Like, x: number, y: number): Vector2Like => {
    return [v[0] + x, v[1] + y];
};

/**
 * Translates a vector by x and y offsets and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   x   - The x offset
 * @param   y   - The y offset
 * @returns       The output vector
 */
export const translateMut = (out: Vector2Like, v: Vector2Like, x: number, y: number): Vector2Like => {
    out[0] = v[0] + x;
    out[1] = v[1] + y;

    return out;
};

/**
 * Scales a vector by x and y factors.
 *
 * @param   v - The input vector
 * @param   x - The x scale factor
 * @param   y - The y scale factor
 * @returns     The scaled vector
 */
export const scale = (v: Vector2Like, x: number, y: number): Vector2Like => {
    return [v[0] * x, v[1] * y];
};

/**
 * Scales a vector by x and y factors and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   x   - The x scale factor
 * @param   y   - The y scale factor
 * @returns       The output vector
 */
export const scaleMut = (out: Vector2Like, v: Vector2Like, x: number, y: number): Vector2Like => {
    out[0] = v[0] * x;
    out[1] = v[1] * y;

    return out;
};

/**
 * Negates both components of a vector.
 *
 * @param   v - The input vector
 * @returns     The negated vector
 */
export const negate = (v: Vector2Like): Vector2Like => {
    return [v[0] * -1, v[1] * -1];
};

/**
 * Negates both components of a vector and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const negateMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    out[0] = v[0] * -1;
    out[1] = v[1] * -1;

    return out;
};

/**
 * Linearly interpolates between two vectors.
 *
 * @param   v1 - The start vector
 * @param   v2 - The end vector
 * @param   t  - The interpolation factor (0-1)
 * @returns      The interpolated vector
 */
export const lerp = (v1: Vector2Like, v2: Vector2Like, t: number): Vector2Like => {
    return [
        v1[0] + (v2[0] - v1[0]) * t,
        v1[1] + (v2[1] - v1[1]) * t,
    ];
};

/**
 * Linearly interpolates between two vectors and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v1  - The start vector
 * @param   v2  - The end vector
 * @param   t   - The interpolation factor (0-1)
 * @returns       The output vector
 */
export const lerpMut = (out: Vector2Like, v1: Vector2Like, v2: Vector2Like, t: number): Vector2Like => {
    out[0] = v1[0] + (v2[0] - v1[0]) * t;
    out[1] = v1[1] + (v2[1] - v1[1]) * t;

    return out;
};

/**
 * Returns a vector perpendicular to the input vector.
 *
 * @param   v - The input vector
 * @returns     The perpendicular vector
 */
export const perpendicular = (v: Vector2Like): Vector2Like => {
    return [-v[1], v[0]];
};

/**
 * Returns a vector perpendicular to the input vector and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const perpendicularMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    out[0] = -v[1];
    out[1] = v[0];

    return out;
};

/**
 * Applies Math.ceil to both components of a vector.
 *
 * @param   v - The input vector
 * @returns     The ceiled vector
 */
export const ceil = (v: Vector2Like): Vector2Like => {
    return [Math.ceil(v[0]), Math.ceil(v[1])];
};

/**
 * Applies Math.ceil to both components of a vector and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const ceilMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    out[0] = Math.ceil(v[0]);
    out[1] = Math.ceil(v[1]);

    return out;
};

/**
 * Applies Math.floor to both components of a vector.
 *
 * @param   v - The input vector
 * @returns     The floored vector
 */
export const floor = (v: Vector2Like): Vector2Like => {
    return [Math.floor(v[0]), Math.floor(v[1])];
};

/**
 * Applies Math.floor to both components of a vector and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const floorMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    out[0] = Math.floor(v[0]);
    out[1] = Math.floor(v[1]);

    return out;
};

/**
 * Applies Math.round to both components of a vector.
 *
 * @param   v - The input vector
 * @returns     The rounded vector
 */
export const round = (v: Vector2Like): Vector2Like => {
    return [Math.round(v[0]), Math.round(v[1])];
};

/**
 * Applies Math.round to both components of a vector and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const roundMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    out[0] = Math.round(v[0]);
    out[1] = Math.round(v[1]);

    return out;
};

/**
 * Applies Math.abs to both components of a vector.
 *
 * @param   v - The input vector
 * @returns     The absolute value vector
 */
export const abs = (v: Vector2Like): Vector2Like => {
    return [Math.abs(v[0]), Math.abs(v[1])];
};

/**
 * Applies Math.abs to both components of a vector and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const absMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    out[0] = Math.abs(v[0]);
    out[1] = Math.abs(v[1]);

    return out;
};

/**
 * Applies Math.sign to both components of a vector.
 *
 * @param   v - The input vector
 * @returns     The sign vector
 */
export const sign = (v: Vector2Like): Vector2Like => {
    return [Math.sign(v[0]), Math.sign(v[1])];
};

/**
 * Applies Math.sign to both components of a vector and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const signMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    out[0] = Math.sign(v[0]);
    out[1] = Math.sign(v[1]);

    return out;
};

/**
 * Normalizes a vector to unit length.
 *
 * @param   v - The input vector
 * @returns     The normalized vector
 */
export const normalize = (v: Vector2Like): Vector2Like => {
    const mag = magnitude(v);

    return mag === 0
        ? [0, 0]
        : [v[0] / mag, v[1] / mag];
};

/**
 * Normalizes a vector to unit length and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @returns       The output vector
 */
export const normalizeMut = (out: Vector2Like, v: Vector2Like): Vector2Like => {
    const mag = magnitude(v);

    out[0] = mag === 0 ? 0 : v[0] / mag;
    out[1] = mag === 0 ? 0 : v[1] / mag;

    return out;
};

/**
 * Rotates a vector by a given angle (radians).
 *
 * @param   v     - The input vector
 * @param   angle - The angle in radians
 * @returns         The rotated vector
 */
export const rotate = (v: Vector2Like, angle: number): Vector2Like => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return [
        (v[0] * cos) - (v[1] * sin),
        (v[0] * sin) + (v[1] * cos),
    ];
};

/**
 * Rotates a vector by a given angle (radians) and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   angle - The angle in radians
 * @returns         The output vector
 */
export const rotateMut = (out: Vector2Like, v: Vector2Like, angle: number): Vector2Like => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    out[0] = (v[0] * cos) - (v[1] * sin);
    out[1] = (v[0] * sin) + (v[1] * cos);

    return out;
};

/**
 * Rotates a vector around a pivot point by a given angle (radians).
 *
 * @param   v     - The input vector
 * @param   pivot - The pivot point
 * @param   angle - The angle in radians
 * @returns         The rotated vector
 */
export const rotateAround = (v: Vector2Like, pivot: Vector2Like, angle: number): Vector2Like => {
    const x   = v[0] - pivot[0];
    const y   = v[1] - pivot[1];
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return [
        ((x * cos) - (y * sin)) + pivot[0],
        ((x * sin) + (y * cos)) + pivot[1],
    ];
};

/**
 * Rotates a vector around a pivot point by a given angle (radians) and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   pivot - The pivot point
 * @param   angle - The angle in radians
 * @returns         The output vector
 */
export const rotateAroundMut = (
    out:   Vector2Like,
    v:     Vector2Like,
    pivot: Vector2Like,
    angle: number,
): Vector2Like => {
    const x   = v[0] - pivot[0];
    const y   = v[1] - pivot[1];
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    out[0] = ((x * cos) - (y * sin)) + pivot[0];
    out[1] = ((x * sin) + (y * cos)) + pivot[1];

    return out;
};

/**
 * Clamps each component of a vector between the corresponding min and max values.
 *
 * @param   v   - The input vector
 * @param   min - The minimum vector
 * @param   max - The maximum vector
 * @returns       The clamped vector
 */
export const clamp = (v: Vector2Like, min: Vector2Like, max: Vector2Like): Vector2Like => {
    return [
        Math.min(Math.max(v[0], min[0]), max[0]),
        Math.min(Math.max(v[1], min[1]), max[1]),
    ];
};

/**
 * Clamps each component of a vector between the corresponding min and max values and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   min - The minimum vector
 * @param   max - The maximum vector
 * @returns       The output vector
 */
export const clampMut = (out: Vector2Like, v: Vector2Like, min: Vector2Like, max: Vector2Like): Vector2Like => {
    out[0] = Math.min(Math.max(v[0], min[0]), max[0]);
    out[1] = Math.min(Math.max(v[1], min[1]), max[1]);

    return out;
};

/**
 * Clamps each component of a vector between min and max scalars.
 *
 * @param   v   - The input vector
 * @param   min - The minimum value
 * @param   max - The maximum value
 * @returns       The clamped vector
 */
export const clampScalar = (v: Vector2Like, min: number, max: number): Vector2Like => {
    return [
        Math.min(Math.max(v[0], min), max),
        Math.min(Math.max(v[1], min), max),
    ];
};

/**
 * Clamps each component of a vector between min and max scalars and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   min - The minimum value
 * @param   max - The maximum value
 * @returns       The output vector
 */
export const clampScalarMut = (out: Vector2Like, v: Vector2Like, min: number, max: number): Vector2Like => {
    out[0] = Math.min(Math.max(v[0], min), max);
    out[1] = Math.min(Math.max(v[1], min), max);

    return out;
};

/**
 * Returns the component-wise minimum of two vectors.
 *
 * @param   v   - The input vector
 * @param   min - The minimum vector
 * @returns       The minimum vector
 */
export const min = (v: Vector2Like, min: Vector2Like): Vector2Like => {
    return [
        Math.min(v[0], min[0]),
        Math.min(v[1], min[1]),
    ];
};

/**
 * Returns the component-wise minimum of two vectors and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   min - The minimum vector
 * @returns       The output vector
 */
export const minMut = (out: Vector2Like, v: Vector2Like, min: Vector2Like): Vector2Like => {
    out[0] = Math.min(v[0], min[0]);
    out[1] = Math.min(v[1], min[1]);

    return out;
};

/**
 * Returns the component-wise minimum of a vector and a scalar.
 *
 * @param   v   - The input vector
 * @param   min - The minimum value
 * @returns       The minimum vector
 */
export const minScalar = (v: Vector2Like, min: number): Vector2Like => {
    return [
        Math.min(v[0], min),
        Math.min(v[1], min),
    ];
};

/**
 * Returns the component-wise minimum of a vector and a scalar and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   min - The minimum value
 * @returns       The output vector
 */
export const minScalarMut = (out: Vector2Like, v: Vector2Like, min: number): Vector2Like => {
    out[0] = Math.min(v[0], min);
    out[1] = Math.min(v[1], min);

    return out;
};

/**
 * Returns the component-wise maximum of two vectors.
 *
 * @param   v   - The input vector
 * @param   max - The maximum vector
 * @returns       The maximum vector
 */
export const max = (v: Vector2Like, max: Vector2Like): Vector2Like => {
    return [
        Math.max(v[0], max[0]),
        Math.max(v[1], max[1]),
    ];
};

/**
 * Returns the component-wise maximum of two vectors and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   max - The maximum vector
 * @returns       The output vector
 */
export const maxMut = (out: Vector2Like, v: Vector2Like, max: Vector2Like): Vector2Like => {
    out[0] = Math.max(v[0], max[0]);
    out[1] = Math.max(v[1], max[1]);

    return out;
};

/**
 * Returns the component-wise maximum of a vector and a scalar.
 *
 * @param   v   - The input vector
 * @param   max - The maximum value
 * @returns       The maximum vector
 */
export const maxScalar = (v: Vector2Like, max: number): Vector2Like => {
    return [
        Math.max(v[0], max),
        Math.max(v[1], max),
    ];
};

/**
 * Returns the component-wise maximum of a vector and a scalar and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   max - The maximum value
 * @returns       The output vector
 */
export const maxScalarMut = (out: Vector2Like, v: Vector2Like, max: number): Vector2Like => {
    out[0] = Math.max(v[0], max);
    out[1] = Math.max(v[1], max);

    return out;
};

/**
 * Returns the magnitude (length) of a vector.
 *
 * @param   v - The input vector
 * @returns     The magnitude
 */
export const magnitude = (v: Vector2Like): number => {
    return Math.sqrt((v[0] ** 2) + (v[1] ** 2));
};

/**
 * Returns the magnitude (length) of a vector using Math.hypot.
 *
 * @param   v - The input vector
 * @returns     The magnitude
 */
export const magnitudeSafe = (v: Vector2Like): number => {
    return Math.hypot(v[0], v[1]);
};

/**
 * Sets the magnitude (length) of a vector.
 *
 * @param   v     - The input vector
 * @param   value - The new magnitude
 * @returns         The scaled vector
 */
export const setMagnitude = (v: Vector2Like, value: number): Vector2Like => {
    return mulScalar(normalize(v), value);
};

/**
 * Sets the magnitude (length) of a vector and writes the result to out.
 *
 * @param   out   - The output vector
 * @param   v     - The input vector
 * @param   value - The new magnitude
 * @returns         The output vector
 */
export const setMagnitudeMut = (out: Vector2Like, v: Vector2Like, value: number): Vector2Like => {
    return mulScalarMut(out, normalizeMut(out, v), value);
};

/**
 * Clamps the magnitude (length) of a vector between min and max.
 *
 * @param   v   - The input vector
 * @param   min - The minimum magnitude
 * @param   max - The maximum magnitude
 * @returns       The clamped vector
 */
export const clampMagnitude = (v: Vector2Like, min: number, max: number): Vector2Like => {
    const mag = magnitude(v);

    return setMagnitude(v, Math.min(Math.max(mag, min), max));
};

/**
 * Clamps the magnitude (length) of a vector between min and max and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   min - The minimum magnitude
 * @param   max - The maximum magnitude
 * @returns       The output vector
 */
export const clampMagnitudeMut = (out: Vector2Like, v: Vector2Like, min: number, max: number): Vector2Like => {
    const mag = magnitude(v);

    return setMagnitudeMut(out, v, Math.min(Math.max(mag, min), max));
};

/**
 * Ensures the magnitude (length) of a vector is at least min.
 *
 * @param   v   - The input vector
 * @param   min - The minimum magnitude
 * @returns       The scaled vector
 */
export const minMagnitude = (v: Vector2Like, min: number): Vector2Like => {
    if (magnitude(v) >= min) return v;

    return setMagnitude(v, min);
};

/**
 * Ensures the magnitude (length) of a vector is at least min and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   min - The minimum magnitude
 * @returns       The output vector
 */
export const minMagnitudeMut = (out: Vector2Like, v: Vector2Like, min: number): Vector2Like => {
    if (magnitude(v) >= min) {
        out[0] = v[0];
        out[1] = v[1];

        return out;
    };

    return setMagnitudeMut(out, v, min);
};

/**
 * Ensures the magnitude (length) of a vector is at most max.
 *
 * @param   v   - The input vector
 * @param   max - The maximum magnitude
 * @returns       The scaled vector
 */
export const maxMagnitude = (v: Vector2Like, max: number): Vector2Like => {
    if (magnitude(v) <= max) return v;

    return setMagnitude(v, max);
};

/**
 * Ensures the magnitude (length) of a vector is at most max and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   max - The maximum magnitude
 * @returns       The output vector
 */
export const maxMagnitudeMut = (out: Vector2Like, v: Vector2Like, max: number): Vector2Like => {
    if (magnitude(v) <= max) {
        out[0] = v[0];
        out[1] = v[1];

        return out;
    }

    return setMagnitudeMut(out, v, max);
};

/**
 * Returns the Euclidean distance between two vectors.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      The distance
 */
export const dist = (v1: Vector2Like, v2: Vector2Like): number => {
    return Math.hypot(v1[0] - v2[0], v1[1] - v2[1]);
};

/**
 * Returns the normalized direction vector from v1 to v2.
 *
 * @param   v1 - The start vector
 * @param   v2 - The end vector
 * @returns      The direction vector
 */
export const directionTo = (v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    return normalize(sub(v2, v1));
};

/**
 * Returns the normalized direction vector from v1 to v2 and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v1  - The start vector
 * @param   v2  - The end vector
 * @returns       The output vector
 */
export const directionToMut = (out: Vector2Like, v1: Vector2Like, v2: Vector2Like): Vector2Like => {
    return normalizeMut(out, subMut(out, v2, v1));
};

/**
 * Returns the signed angle between two vectors in radians.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      The angle in radians
 */
export const angleBetween = (v1: Vector2Like, v2: Vector2Like): number => {
    const _dot = dot(v1, v2);
    const _det = cross(v1, v2);

    return Math.atan2(_det, _dot);
};

/**
 * Returns the angle from v1 to v2 in radians.
 *
 * @param   v1 - The start vector
 * @param   v2 - The end vector
 * @returns      The angle in radians
 */
export const angleTo = (v1: Vector2Like, v2: Vector2Like): number => {
    return Math.atan2(v2[1] - v1[1], v2[0] - v1[0]);
};

/**
 * Returns the angle of a vector in radians from the positive x-axis.
 *
 * @param   v - The input vector
 * @returns     The angle in radians
 */
export const toAngle = (v: Vector2Like): number => {
    return Math.atan2(v[1], v[0]);
};

/**
 * Creates a vector from an angle and length.
 *
 * @param   angle  - The angle in radians
 * @param   length - The length (default 1)
 * @returns          The resulting vector
 */
export const fromAngle = (angle: number, length = 1): Vector2Like => {
    return [length * Math.cos(angle), length * Math.sin(angle)];
};

/**
 * Creates a vector from an angle and length and writes the result to out.
 *
 * @param   out    - The output vector
 * @param   angle  - The angle in radians
 * @param   length - The length (default 1)
 * @returns          The output vector
 */
export const fromAngleMut = (out: Vector2Like, angle: number, length = 1): Vector2Like => {
    out[0] = length * Math.cos(angle);
    out[1] = length * Math.sin(angle);

    return out;
};

/**
 * Returns a random unit vector.
 *
 * @returns The random vector
 */
export const random = (): Vector2Like => {
    return fromAngle(prng.random(1) * TAU);
};

/**
 * Returns a random unit vector and writes the result to out.
 *
 * @param   out - The output vector
 * @returns       The output vector
 */
export const randomMut = (out: Vector2Like): Vector2Like => {
    return fromAngleMut(out, prng.random(1) * TAU);
};

/**
 * Reflects a vector across a normal.
 *
 * @param   v - The input vector
 * @param   n - The normal vector (should be normalized)
 * @returns     The reflected vector
 */
export const reflect = (v: Vector2Like, n: Vector2Like): Vector2Like => {
    if (!isNormalized(n)) {
        console.warn(`[Vec2Ops.reflect]: 'n' is not normalized.`);
    }

    const dot2 = 2 * dot(v, n);

    return [
        v[0] - dot2 * n[0],
        v[1] - dot2 * n[1],
    ];
};

/**
 * Reflects a vector across a normal and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   n   - The normal vector (should be normalized)
 * @returns       The output vector
 */
export const reflectMut = (out: Vector2Like, v: Vector2Like, n: Vector2Like): Vector2Like => {
    if (!isNormalized(n)) {
        console.warn(`[Vec2Ops.reflectMut]: 'n' is not normalized.`);
    }

    const dot2 = 2 * dot(v, n);

    out[0] = v[0] - dot2 * n[0];
    out[1] = v[1] - dot2 * n[1];

    return out;
};

/**
 * Projects a vector onto a normal.
 *
 * @param   v - The input vector
 * @param   n - The normal vector (should be normalized)
 * @returns     The projected vector
 */
export const project = (v: Vector2Like, n: Vector2Like): Vector2Like => {
    if (!isNormalized(n)) {
        console.warn(`[Vec2Ops.project]: 'n' is not normalized.`);
    }

    const _dot = dot(v, n);

    return [_dot * n[0], _dot * n[1]];
};

/**
 * Projects a vector onto a normal and writes the result to out.
 *
 * @param   out - The output vector
 * @param   v   - The input vector
 * @param   n   - The normal vector (should be normalized)
 * @returns       The output vector
 */
export const projectMut = (out: Vector2Like, v: Vector2Like, n: Vector2Like): Vector2Like => {
    if (!isNormalized(n)) {
        console.warn(`[Vec2Ops.projectMut]: 'n' is not normalized.`);
    }

    const _dot = dot(v, n);

    out[0] = _dot * n[0];
    out[1] = _dot * n[1];

    return out;
};

/**
 * Returns the dot product of two vectors.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      The dot product
 */
export const dot = (v1: Vector2Like, v2: Vector2Like): number => {
    return (v1[0] * v2[0]) + (v1[1] * v2[1]);
};

/**
 * Returns the 2D cross product (scalar) of two vectors.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      The cross product
 */
export const cross = (v1: Vector2Like, v2: Vector2Like): number => {
    return (v1[0] * v2[1]) - (v1[1] * v2[0]);
};

/**
 * Checks if two vectors are exactly equal.
 *
 * @param   v1 - The first vector
 * @param   v2 - The second vector
 * @returns      True if equal, false otherwise
 */
export const equal = (v1: Vector2Like, v2: Vector2Like): boolean => {
    return v1[0] === v2[0] && v1[1] === v2[1];
};

/**
 * Checks if two vectors are approximately equal within a given epsilon.
 *
 * @param   v1      - The first vector
 * @param   v2      - The second vector
 * @param   epsilon - The tolerance (default 1e-6)
 * @returns           True if approximately equal, false otherwise
 */
export const equalApprox = (v1: Vector2Like, v2: Vector2Like, epsilon = 1e-6): boolean => {
    const dx = Math.abs(v1[0] - v2[0]);
    const dy = Math.abs(v1[1] - v2[1]);

    const maxX = Math.max(1, Math.abs(v1[0]), Math.abs(v2[0]));
    const maxY = Math.max(1, Math.abs(v1[1]), Math.abs(v2[1]));

    return dx <= epsilon * maxX
        && dy <= epsilon * maxY;
};

/**
 * Checks if a vector is normalized (unit length) within a given epsilon.
 *
 * @param   v       - The input vector
 * @param   epsilon - The tolerance (default 1e-6)
 * @returns           True if normalized, false otherwise
 */
export const isNormalized = (v: Vector2Like, epsilon = 1e-6): boolean => {
    const mag = magnitudeSafe(v);

    return Math.abs(mag - 1) <= epsilon + Number.EPSILON * Math.abs(mag);
};
