import type { Matrix3Like } from './types.js';

/**
 * Creates an identity matrix.
 *
 * @returns The identity matrix
 */
export const identity = (): Matrix3Like => {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];
};

/**
 * Creates an identity matrix and writes it to out.
 *
 * @param   out - The output matrix
 * @returns       The output matrix
 */
export const identityMut = (out: Matrix3Like): Matrix3Like => {
    out[0] = 1; out[1] = 0; out[2] = 0;
    out[3] = 0; out[4] = 1; out[5] = 0;
    out[6] = 0; out[7] = 0; out[8] = 1;

    return out;
};

/**
 * Creates a translation matrix.
 *
 * @param   x - The x translation
 * @param   y - The y translation
 * @returns     The translation matrix
 */
export const translation = (x: number, y: number): Matrix3Like => {
    return [
        1, 0, 0,
        0, 1, 0,
        x, y, 1,
    ];
};

/**
 * Creates a translation matrix and writes it to out.
 *
 * @param   out - The output matrix
 * @param   x   - The x translation
 * @param   y   - The y translation
 * @returns       The output matrix
 */
export const translationMut = (out: Matrix3Like, x: number, y: number): Matrix3Like => {
    out[0] = 1; out[1] = 0; out[2] = 0;
    out[3] = 0; out[4] = 1; out[5] = 0;
    out[6] = x; out[7] = y; out[8] = 1;

    return out;
};

/**
 * Creates a scaling matrix.
 *
 * @param   x - The x scale
 * @param   y - The y scale
 * @returns     The scaling matrix
 */
export const scaling = (x: number, y: number): Matrix3Like => {
    return [
        x, 0, 0,
        0, y, 0,
        0, 0, 1,
    ];
};

/**
 * Creates a scaling matrix and writes it to out.
 *
 * @param   out - The output matrix
 * @param   x   - The x scale
 * @param   y   - The y scale
 * @returns       The output matrix
 */
export const scalingMut = (out: Matrix3Like, x: number, y: number): Matrix3Like => {
    out[0] = x; out[1] = 0; out[2] = 0;
    out[3] = 0; out[4] = y; out[5] = 0;
    out[6] = 0; out[7] = 0; out[8] = 1;

    return out;
};

/**
 * Creates a rotation matrix from an angle in radians.
 *
 * @param   theta - The angle in radians
 * @returns         The rotation matrix
 */
export const rotation = (theta: number): Matrix3Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    return [
        cos,  sin, 0,
        -sin, cos, 0,
        0,    0,   1,
    ];
};

/**
 * Creates a rotation matrix from an angle in radians and writes it to out.
 *
 * @param   out   - The output matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotationMut = (out: Matrix3Like, theta: number): Matrix3Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0] = cos; out[1] = sin; out[2] = 0;
    out[3] = -sin; out[4] = cos; out[5] = 0;
    out[6] = 0; out[7] = 0; out[8] = 1;

    return out;
};

/**
 * Multiplies two matrices (m1 * m2).
 *
 * @param   m1 - The first matrix
 * @param   m2 - The second matrix
 * @returns      The result matrix
 */
export const multiply = (m1: Matrix3Like, m2: Matrix3Like): Matrix3Like => {
    return [
        m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6],
        m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7],
        m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],

        m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6],
        m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7],
        m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],

        m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6],
        m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7],
        m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8],
    ];
};

/**
 * Multiplies two matrices (m1 * m2) and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m1  - The first matrix
 * @param   m2  - The second matrix
 * @returns       The output matrix
 */
export const multiplyMut = (out: Matrix3Like, m1: Matrix3Like, m2: Matrix3Like): Matrix3Like => {
    const a00 = m1[0], a01 = m1[1], a02 = m1[2];
    const a10 = m1[3], a11 = m1[4], a12 = m1[5];
    const a20 = m1[6], a21 = m1[7], a22 = m1[8];

    const b00 = m2[0], b01 = m2[1], b02 = m2[2];
    const b10 = m2[3], b11 = m2[4], b12 = m2[5];
    const b20 = m2[6], b21 = m2[7], b22 = m2[8];

    out[0] = a00 * b00 + a01 * b10 + a02 * b20;
    out[1] = a00 * b01 + a01 * b11 + a02 * b21;
    out[2] = a00 * b02 + a01 * b12 + a02 * b22;

    out[3] = a10 * b00 + a11 * b10 + a12 * b20;
    out[4] = a10 * b01 + a11 * b11 + a12 * b21;
    out[5] = a10 * b02 + a11 * b12 + a12 * b22;

    out[6] = a20 * b00 + a21 * b10 + a22 * b20;
    out[7] = a20 * b01 + a21 * b11 + a22 * b21;
    out[8] = a20 * b02 + a21 * b12 + a22 * b22;

    return out;
};

/**
 * Transposes a matrix.
 *
 * @param   m - The input matrix
 * @returns     The transposed matrix
 */
export const transpose = (m: Matrix3Like): Matrix3Like => {
    return [
        m[0], m[3], m[6],
        m[1], m[4], m[7],
        m[2], m[5], m[8],
    ];
};

/**
 * Transposes a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @returns       The output matrix
 */
export const transposeMut = (out: Matrix3Like, m: Matrix3Like): Matrix3Like => {
    const m01 = m[1], m02 = m[2];
    const m12 = m[5];

    out[0] = m[0];
    out[1] = m[3];
    out[2] = m[6];
    out[3] = m01;
    out[4] = m[4];
    out[5] = m[7];
    out[6] = m02;
    out[7] = m12;
    out[8] = m[8];

    return out;
};

/**
 * Calculates the determinant of a matrix.
 *
 * @param   m - The input matrix
 * @returns     The determinant
 */
export const determinant = (m: Matrix3Like): number => {
    const a = m[0], b = m[1], c = m[2];
    const d = m[3], e = m[4], f = m[5];
    const g = m[6], h = m[7], i = m[8];

    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
};

/**
 * Inverts a matrix.
 *
 * @param   m - The input matrix
 * @returns     The inverted matrix, or null if the matrix is not invertible
 */
export const invert = (m: Matrix3Like): Matrix3Like | null => {
    const a = m[0], b = m[1], c = m[2];
    const d = m[3], e = m[4], f = m[5];
    const g = m[6], h = m[7], i = m[8];

    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

    if (det === 0) {
        return null;
    }

    const invDet = 1 / det;

    return [
        (e * i - f * h) * invDet,
        (c * h - b * i) * invDet,
        (b * f - c * e) * invDet,

        (f * g - d * i) * invDet,
        (a * i - c * g) * invDet,
        (c * d - a * f) * invDet,

        (d * h - e * g) * invDet,
        (b * g - a * h) * invDet,
        (a * e - b * d) * invDet,
    ];
};

/**
 * Inverts a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @returns       The output matrix, or null if the matrix is not invertible
 */
export const invertMut = (out: Matrix3Like, m: Matrix3Like): Matrix3Like | null => {
    const a = m[0], b = m[1], c = m[2];
    const d = m[3], e = m[4], f = m[5];
    const g = m[6], h = m[7], i = m[8];

    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

    if (det === 0) {
        return null;
    }

    const invDet = 1 / det;

    out[0] = (e * i - f * h) * invDet;
    out[1] = (c * h - b * i) * invDet;
    out[2] = (b * f - c * e) * invDet;

    out[3] = (f * g - d * i) * invDet;
    out[4] = (a * i - c * g) * invDet;
    out[5] = (c * d - a * f) * invDet;

    out[6] = (d * h - e * g) * invDet;
    out[7] = (b * g - a * h) * invDet;
    out[8] = (a * e - b * d) * invDet;

    return out;
};

/**
 * Applies a translation to a matrix.
 *
 * @param   m - The input matrix
 * @param   x - The x translation
 * @param   y - The y translation
 * @returns     The translated matrix
 */
export const translate = (m: Matrix3Like, x: number, y: number): Matrix3Like => {
    return multiply(m, translation(x, y));
};

/**
 * Applies a translation to a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @param   x   - The x translation
 * @param   y   - The y translation
 * @returns       The output matrix
 */
export const translateMut = (out: Matrix3Like, m: Matrix3Like, x: number, y: number): Matrix3Like => {
    const a = m[0], b = m[1], c = m[2];
    const d = m[3], e = m[4], f = m[5];
    const g = m[6], h = m[7], i = m[8];

    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = e;
    out[5] = f;
    out[6] = a * x + d * y + g;
    out[7] = b * x + e * y + h;
    out[8] = c * x + f * y + i;

    return out;
};

/**
 * Applies a scale to a matrix.
 *
 * @param   m - The input matrix
 * @param   x - The x scale
 * @param   y - The y scale
 * @returns     The scaled matrix
 */
export const scale = (m: Matrix3Like, x: number, y: number): Matrix3Like => {
    return [
        m[0] * x, m[1] * x, m[2] * x,
        m[3] * y, m[4] * y, m[5] * y,
        m[6],     m[7],     m[8],
    ];
};

/**
 * Applies a scale to a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @param   x   - The x scale
 * @param   y   - The y scale
 * @returns       The output matrix
 */
export const scaleMut = (out: Matrix3Like, m: Matrix3Like, x: number, y: number): Matrix3Like => {
    out[0] = m[0] * x;
    out[1] = m[1] * x;
    out[2] = m[2] * x;
    out[3] = m[3] * y;
    out[4] = m[4] * y;
    out[5] = m[5] * y;
    out[6] = m[6];
    out[7] = m[7];
    out[8] = m[8];

    return out;
};

/**
 * Applies a rotation to a matrix.
 *
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The rotated matrix
 */
export const rotate = (m: Matrix3Like, theta: number): Matrix3Like => {
    return multiply(m, rotation(theta));
};

/**
 * Applies a rotation to a matrix and writes the result to out.
 *
 * @param   out   - The output matrix
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotateMut = (out: Matrix3Like, m: Matrix3Like, theta: number): Matrix3Like => {
    const a = m[0], b = m[1], c = m[2];
    const d = m[3], e = m[4], f = m[5];

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0] = a * cos + d * sin;
    out[1] = b * cos + e * sin;
    out[2] = c * cos + f * sin;
    out[3] = a * -sin + d * cos;
    out[4] = b * -sin + e * cos;
    out[5] = c * -sin + f * cos;
    out[6] = m[6];
    out[7] = m[7];
    out[8] = m[8];

    return out;
};

/**
 * Copies a matrix.
 *
 * @param   m - The input matrix
 * @returns     A copy of the matrix
 */
export const copy = (m: Matrix3Like): Matrix3Like => {
    return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]];
};

/**
 * Copies a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @returns       The output matrix
 */
export const copyMut = (out: Matrix3Like, m: Matrix3Like): Matrix3Like => {
    out[0] = m[0]; out[1] = m[1]; out[2] = m[2];
    out[3] = m[3]; out[4] = m[4]; out[5] = m[5];
    out[6] = m[6]; out[7] = m[7]; out[8] = m[8];

    return out;
};

/**
 * Checks if two matrices are exactly equal.
 *
 * @param   m1 - The first matrix
 * @param   m2 - The second matrix
 * @returns      True if equal, false otherwise
 */
export const equal = (m1: Matrix3Like, m2: Matrix3Like): boolean => {
    return m1[0] === m2[0] && m1[1] === m2[1] && m1[2] === m2[2]
        && m1[3] === m2[3] && m1[4] === m2[4] && m1[5] === m2[5]
        && m1[6] === m2[6] && m1[7] === m2[7] && m1[8] === m2[8];
};

/**
 * Checks if two matrices are approximately equal within a given epsilon.
 *
 * @param   m1      - The first matrix
 * @param   m2      - The second matrix
 * @param   epsilon - The tolerance (default 1e-6)
 * @returns           True if approximately equal, false otherwise
 */
export const equalApprox = (m1: Matrix3Like, m2: Matrix3Like, epsilon = 1e-6): boolean => {
    for (let i = 0; i < 9; i++) {
        const diff = Math.abs(m1[i]! - m2[i]!);
        const max = Math.max(1, Math.abs(m1[i]!), Math.abs(m2[i]!));

        if (diff > epsilon * max) {
            return false;
        }
    }

    return true;
};

/**
 * Converts a matrix to a Float32Array (column-major order for WebGL).
 *
 * @param   m - The input matrix
 * @returns     The Float32Array representation
 */
export const toFloat32Array = (m: Matrix3Like): Float32Array => {
    return new Float32Array([
        m[0], m[3], m[6],
        m[1], m[4], m[7],
        m[2], m[5], m[8],
    ]);
};

/**
 * Converts a matrix to canvas transform format (a, b, c, d, e, f).
 *
 * @param   m - The input matrix
 * @returns     The canvas transform array [a, b, c, d, e, f]
 */
export const toCanvasTransform = (m: Matrix3Like): [number, number, number, number, number, number] => {
    return [m[0], m[1], m[3], m[4], m[6], m[7]];
};
