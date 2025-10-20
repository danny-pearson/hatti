import { RADIANS_PER_DEGREE } from './constants.js';
import type { Matrix4Like } from './types.js';

/**
 * Creates an identity matrix.
 *
 * @returns The identity matrix
 */
export const identity = (): Matrix4Like => {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
};

/**
 * Creates an identity matrix and writes it to out.
 *
 * @param   out - The output matrix
 * @returns       The output matrix
 */
export const identityMut = (out: Matrix4Like): Matrix4Like => {
    out[0]  = 1; out[1]  = 0; out[2]  = 0; out[3]  = 0;
    out[4]  = 0; out[5]  = 1; out[6]  = 0; out[7]  = 0;
    out[8]  = 0; out[9]  = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;

    return out;
};

/**
 * Creates a translation matrix.
 *
 * @param   x - The x translation
 * @param   y - The y translation
 * @param   z - The z translation
 * @returns     The translation matrix
 */
export const translation = (x: number, y: number, z: number): Matrix4Like => {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1,
    ];
};

/**
 * Creates a translation matrix and writes it to out.
 *
 * @param   out - The output matrix
 * @param   x   - The x translation
 * @param   y   - The y translation
 * @param   z   - The z translation
 * @returns       The output matrix
 */
export const translationMut = (out: Matrix4Like, x: number, y: number, z: number): Matrix4Like => {
    out[0]  = 1; out[1]  = 0; out[2]  = 0; out[3]  = 0;
    out[4]  = 0; out[5]  = 1; out[6]  = 0; out[7]  = 0;
    out[8]  = 0; out[9]  = 0; out[10] = 1; out[11] = 0;
    out[12] = x; out[13] = y; out[14] = z; out[15] = 1;

    return out;
};

/**
 * Creates a scaling matrix.
 *
 * @param   x - The x scale
 * @param   y - The y scale
 * @param   z - The z scale
 * @returns     The scaling matrix
 */
export const scaling = (x: number, y: number, z: number): Matrix4Like => {
    return [
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1,
    ];
};

/**
 * Creates a scaling matrix and writes it to out.
 *
 * @param   out - The output matrix
 * @param   x   - The x scale
 * @param   y   - The y scale
 * @param   z   - The z scale
 * @returns       The output matrix
 */
export const scalingMut = (out: Matrix4Like, x: number, y: number, z: number): Matrix4Like => {
    out[0]  = x; out[1]  = 0; out[2]  = 0; out[3]  = 0;
    out[4]  = 0; out[5]  = y; out[6]  = 0; out[7]  = 0;
    out[8]  = 0; out[9]  = 0; out[10] = z; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;

    return out;
};

/**
 * Creates a rotation matrix around the X axis.
 *
 * @param   theta - The angle in radians
 * @returns         The rotation matrix
 */
export const rotationX = (theta: number): Matrix4Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    return [
        1, 0,    0,   0,
        0, cos,  sin, 0,
        0, -sin, cos, 0,
        0, 0,    0,   1,
    ];
};

/**
 * Creates a rotation matrix around the X axis and writes it to out.
 *
 * @param   out   - The output matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotationXMut = (out: Matrix4Like, theta: number): Matrix4Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0]  = 1; out[1]  = 0; out[2]  = 0; out[3]  = 0;
    out[4]  = 0; out[5]  = cos; out[6]  = sin; out[7]  = 0;
    out[8]  = 0; out[9]  = -sin; out[10] = cos; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;

    return out;
};

/**
 * Creates a rotation matrix around the Y axis.
 *
 * @param   theta - The angle in radians
 * @returns         The rotation matrix
 */
export const rotationY = (theta: number): Matrix4Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    return [
        cos, 0, -sin, 0,
        0,   1, 0,    0,
        sin, 0, cos,  0,
        0,   0, 0,    1,
    ];
};

/**
 * Creates a rotation matrix around the Y axis and writes it to out.
 *
 * @param   out   - The output matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotationYMut = (out: Matrix4Like, theta: number): Matrix4Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0]  = cos; out[1]  = 0; out[2]  = -sin; out[3]  = 0;
    out[4]  = 0; out[5]  = 1; out[6]  = 0; out[7]  = 0;
    out[8]  = sin; out[9]  = 0; out[10] = cos; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;

    return out;
};

/**
 * Creates a rotation matrix around the Z axis.
 *
 * @param   theta - The angle in radians
 * @returns         The rotation matrix
 */
export const rotationZ = (theta: number): Matrix4Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    return [
        cos,  sin, 0, 0,
        -sin, cos, 0, 0,
        0,    0,   1, 0,
        0,    0,   0, 1,
    ];
};

/**
 * Creates a rotation matrix around the Z axis and writes it to out.
 *
 * @param   out   - The output matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotationZMut = (out: Matrix4Like, theta: number): Matrix4Like => {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0]  = cos; out[1]  = sin; out[2]  = 0; out[3]  = 0;
    out[4]  = -sin; out[5]  = cos; out[6]  = 0; out[7]  = 0;
    out[8]  = 0; out[9]  = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;

    return out;
};

/**
 * Creates a perspective projection matrix.
 *
 * @param   aspectRatio - The aspect ratio (width / height)
 * @param   fov         - The field of view in degrees
 * @param   near        - The near clipping plane
 * @param   far         - The far clipping plane
 * @returns               The projection matrix
 */
export const projection = (aspectRatio: number, fov: number, near: number, far: number): Matrix4Like => {
    const fovRad = 1 / Math.tan(fov * 0.5 * RADIANS_PER_DEGREE);
    const rangeInv = 1 / (far - near);

    return [
        aspectRatio * fovRad, 0,      0,                        0,
        0,                    fovRad, 0,                        0,
        0,                    0,      far * rangeInv,           1,
        0,                    0,      (-far * near) * rangeInv, 0,
    ];
};

/**
 * Creates a perspective projection matrix and writes it to out.
 *
 * @param   out         - The output matrix
 * @param   aspectRatio - The aspect ratio (width / height)
 * @param   fov         - The field of view in degrees
 * @param   near        - The near clipping plane
 * @param   far         - The far clipping plane
 * @returns               The output matrix
 */
export const projectionMut = (
    out: Matrix4Like,
    aspectRatio: number,
    fov: number,
    near: number,
    far: number,
): Matrix4Like => {
    const fovRad = 1 / Math.tan(fov * 0.5 * RADIANS_PER_DEGREE);
    const rangeInv = 1 / (far - near);

    out[0]  = aspectRatio * fovRad; out[1]  = 0; out[2]  = 0; out[3]  = 0;
    out[4]  = 0; out[5]  = fovRad; out[6]  = 0; out[7]  = 0;
    out[8]  = 0; out[9]  = 0; out[10] = far * rangeInv; out[11] = 1;
    out[12] = 0; out[13] = 0; out[14] = (-far * near) * rangeInv; out[15] = 0;

    return out;
};

/**
 * Creates an orthographic projection matrix.
 *
 * @param   left   - The left clipping plane
 * @param   right  - The right clipping plane
 * @param   bottom - The bottom clipping plane
 * @param   top    - The top clipping plane
 * @param   near   - The near clipping plane
 * @param   far    - The far clipping plane
 * @returns          The orthographic projection matrix
 */
export const ortho = (
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
): Matrix4Like => {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const fn = 1 / (far - near);

    return [
        2 * rl,              0,                   0,                  0,
        0,                   2 * tb,              0,                  0,
        0,                   0,                   -2 * fn,            0,
        -(right + left) * rl, -(top + bottom) * tb, -(far + near) * fn, 1,
    ];
};

/**
 * Creates an orthographic projection matrix and writes it to out.
 *
 * @param   out    - The output matrix
 * @param   left   - The left clipping plane
 * @param   right  - The right clipping plane
 * @param   bottom - The bottom clipping plane
 * @param   top    - The top clipping plane
 * @param   near   - The near clipping plane
 * @param   far    - The far clipping plane
 * @returns          The output matrix
 */
export const orthoMut = (
    out: Matrix4Like,
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
): Matrix4Like => {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const fn = 1 / (far - near);

    out[0]  = 2 * rl; out[1]  = 0; out[2]  = 0; out[3]  = 0;
    out[4]  = 0; out[5]  = 2 * tb; out[6]  = 0; out[7]  = 0;
    out[8]  = 0; out[9]  = 0; out[10] = -2 * fn; out[11] = 0;
    out[12] = -(right + left) * rl; out[13] = -(top + bottom) * tb; out[14] = -(far + near) * fn; out[15] = 1;

    return out;
};

/**
 * Multiplies two matrices (m1 * m2).
 *
 * @param   m1 - The first matrix
 * @param   m2 - The second matrix
 * @returns      The result matrix
 */
export const multiply = (m1: Matrix4Like, m2: Matrix4Like): Matrix4Like => {
    const a00 = m1[0], a01 = m1[1], a02 = m1[2], a03 = m1[3];
    const a10 = m1[4], a11 = m1[5], a12 = m1[6], a13 = m1[7];
    const a20 = m1[8], a21 = m1[9], a22 = m1[10], a23 = m1[11];
    const a30 = m1[12], a31 = m1[13], a32 = m1[14], a33 = m1[15];

    const b00 = m2[0], b01 = m2[1], b02 = m2[2], b03 = m2[3];
    const b10 = m2[4], b11 = m2[5], b12 = m2[6], b13 = m2[7];
    const b20 = m2[8], b21 = m2[9], b22 = m2[10], b23 = m2[11];
    const b30 = m2[12], b31 = m2[13], b32 = m2[14], b33 = m2[15];

    return [
        a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
        a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
        a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
        a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,

        a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
        a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
        a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
        a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,

        a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
        a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
        a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
        a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,

        a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
        a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
        a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
        a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33,
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
export const multiplyMut = (out: Matrix4Like, m1: Matrix4Like, m2: Matrix4Like): Matrix4Like => {
    const a00 = m1[0], a01 = m1[1], a02 = m1[2], a03 = m1[3];
    const a10 = m1[4], a11 = m1[5], a12 = m1[6], a13 = m1[7];
    const a20 = m1[8], a21 = m1[9], a22 = m1[10], a23 = m1[11];
    const a30 = m1[12], a31 = m1[13], a32 = m1[14], a33 = m1[15];

    const b00 = m2[0], b01 = m2[1], b02 = m2[2], b03 = m2[3];
    const b10 = m2[4], b11 = m2[5], b12 = m2[6], b13 = m2[7];
    const b20 = m2[8], b21 = m2[9], b22 = m2[10], b23 = m2[11];
    const b30 = m2[12], b31 = m2[13], b32 = m2[14], b33 = m2[15];

    out[0]  = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    out[1]  = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    out[2]  = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    out[3]  = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

    out[4]  = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    out[5]  = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    out[6]  = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    out[7]  = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

    out[8]  = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    out[9]  = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    out[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

    out[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    out[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    out[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

    return out;
};

/**
 * Transposes a matrix.
 *
 * @param   m - The input matrix
 * @returns     The transposed matrix
 */
export const transpose = (m: Matrix4Like): Matrix4Like => {
    return [
        m[0], m[4], m[8],  m[12],
        m[1], m[5], m[9],  m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15],
    ];
};

/**
 * Transposes a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @returns       The output matrix
 */
export const transposeMut = (out: Matrix4Like, m: Matrix4Like): Matrix4Like => {
    const m01 = m[1], m02 = m[2], m03 = m[3];
    const m12 = m[6], m13 = m[7];
    const m23 = m[11];

    out[0]  = m[0];
    out[1]  = m[4];
    out[2]  = m[8];
    out[3]  = m[12];
    out[4]  = m01;
    out[5]  = m[5];
    out[6]  = m[9];
    out[7]  = m[13];
    out[8]  = m02;
    out[9]  = m12;
    out[10] = m[10];
    out[11] = m[14];
    out[12] = m03;
    out[13] = m13;
    out[14] = m23;
    out[15] = m[15];

    return out;
};

/**
 * Calculates the determinant of a matrix.
 *
 * @param   m - The input matrix
 * @returns     The determinant
 */
export const determinant = (m: Matrix4Like): number => {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Inverts a matrix.
 *
 * @param   m - The input matrix
 * @returns     The inverted matrix, or null if the matrix is not invertible
 */
export const invert = (m: Matrix4Like): Matrix4Like | null => {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det === 0) {
        return null;
    }

    const invDet = 1 / det;

    return [
        (a11 * b11 - a12 * b10 + a13 * b09) * invDet,
        (a02 * b10 - a01 * b11 - a03 * b09) * invDet,
        (a31 * b05 - a32 * b04 + a33 * b03) * invDet,
        (a22 * b04 - a21 * b05 - a23 * b03) * invDet,

        (a12 * b08 - a10 * b11 - a13 * b07) * invDet,
        (a00 * b11 - a02 * b08 + a03 * b07) * invDet,
        (a32 * b02 - a30 * b05 - a33 * b01) * invDet,
        (a20 * b05 - a22 * b02 + a23 * b01) * invDet,

        (a10 * b10 - a11 * b08 + a13 * b06) * invDet,
        (a01 * b08 - a00 * b10 - a03 * b06) * invDet,
        (a30 * b04 - a31 * b02 + a33 * b00) * invDet,
        (a21 * b02 - a20 * b04 - a23 * b00) * invDet,

        (a11 * b07 - a10 * b09 - a12 * b06) * invDet,
        (a00 * b09 - a01 * b07 + a02 * b06) * invDet,
        (a31 * b01 - a30 * b03 - a32 * b00) * invDet,
        (a20 * b03 - a21 * b01 + a22 * b00) * invDet,
    ];
};

/**
 * Inverts a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @returns       The output matrix, or null if the matrix is not invertible
 */
export const invertMut = (out: Matrix4Like, m: Matrix4Like): Matrix4Like | null => {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det === 0) {
        return null;
    }

    const invDet = 1 / det;

    out[0]  = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    out[1]  = (a02 * b10 - a01 * b11 - a03 * b09) * invDet;
    out[2]  = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    out[3]  = (a22 * b04 - a21 * b05 - a23 * b03) * invDet;

    out[4]  = (a12 * b08 - a10 * b11 - a13 * b07) * invDet;
    out[5]  = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    out[6]  = (a32 * b02 - a30 * b05 - a33 * b01) * invDet;
    out[7]  = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;

    out[8]  = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    out[9]  = (a01 * b08 - a00 * b10 - a03 * b06) * invDet;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * invDet;

    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * invDet;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * invDet;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return out;
};

/**
 * Applies a translation to a matrix.
 *
 * @param   m - The input matrix
 * @param   x - The x translation
 * @param   y - The y translation
 * @param   z - The z translation
 * @returns     The translated matrix
 */
export const translate = (m: Matrix4Like, x: number, y: number, z: number): Matrix4Like => {
    return multiply(m, translation(x, y, z));
};

/**
 * Applies a translation to a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @param   x   - The x translation
 * @param   y   - The y translation
 * @param   z   - The z translation
 * @returns       The output matrix
 */
export const translateMut = (out: Matrix4Like, m: Matrix4Like, x: number, y: number, z: number): Matrix4Like => {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];

    out[0]  = a00;
    out[1]  = a01;
    out[2]  = a02;
    out[3]  = a03;
    out[4]  = a10;
    out[5]  = a11;
    out[6]  = a12;
    out[7]  = a13;
    out[8]  = a20;
    out[9]  = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + m[12];
    out[13] = a01 * x + a11 * y + a21 * z + m[13];
    out[14] = a02 * x + a12 * y + a22 * z + m[14];
    out[15] = a03 * x + a13 * y + a23 * z + m[15];

    return out;
};

/**
 * Applies a scale to a matrix.
 *
 * @param   m - The input matrix
 * @param   x - The x scale
 * @param   y - The y scale
 * @param   z - The z scale
 * @returns     The scaled matrix
 */
export const scale = (m: Matrix4Like, x: number, y: number, z: number): Matrix4Like => {
    return [
        m[0] * x,  m[1] * x,  m[2] * x,  m[3] * x,
        m[4] * y,  m[5] * y,  m[6] * y,  m[7] * y,
        m[8] * z,  m[9] * z,  m[10] * z, m[11] * z,
        m[12],     m[13],     m[14],     m[15],
    ];
};

/**
 * Applies a scale to a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @param   x   - The x scale
 * @param   y   - The y scale
 * @param   z   - The z scale
 * @returns       The output matrix
 */
export const scaleMut = (out: Matrix4Like, m: Matrix4Like, x: number, y: number, z: number): Matrix4Like => {
    out[0]  = m[0] * x;
    out[1]  = m[1] * x;
    out[2]  = m[2] * x;
    out[3]  = m[3] * x;
    out[4]  = m[4] * y;
    out[5]  = m[5] * y;
    out[6]  = m[6] * y;
    out[7]  = m[7] * y;
    out[8]  = m[8] * z;
    out[9]  = m[9] * z;
    out[10] = m[10] * z;
    out[11] = m[11] * z;
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];

    return out;
};

/**
 * Applies a rotation around the X axis to a matrix.
 *
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The rotated matrix
 */
export const rotateX = (m: Matrix4Like, theta: number): Matrix4Like => {
    return multiply(m, rotationX(theta));
};

/**
 * Applies a rotation around the X axis to a matrix and writes the result to out.
 *
 * @param   out   - The output matrix
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotateXMut = (out: Matrix4Like, m: Matrix4Like, theta: number): Matrix4Like => {
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0]  = m[0];
    out[1]  = m[1];
    out[2]  = m[2];
    out[3]  = m[3];
    out[4]  = a10 * cos + a20 * sin;
    out[5]  = a11 * cos + a21 * sin;
    out[6]  = a12 * cos + a22 * sin;
    out[7]  = a13 * cos + a23 * sin;
    out[8]  = a20 * cos - a10 * sin;
    out[9]  = a21 * cos - a11 * sin;
    out[10] = a22 * cos - a12 * sin;
    out[11] = a23 * cos - a13 * sin;
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];

    return out;
};

/**
 * Applies a rotation around the Y axis to a matrix.
 *
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The rotated matrix
 */
export const rotateY = (m: Matrix4Like, theta: number): Matrix4Like => {
    return multiply(m, rotationY(theta));
};

/**
 * Applies a rotation around the Y axis to a matrix and writes the result to out.
 *
 * @param   out   - The output matrix
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotateYMut = (out: Matrix4Like, m: Matrix4Like, theta: number): Matrix4Like => {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0]  = a00 * cos - a20 * sin;
    out[1]  = a01 * cos - a21 * sin;
    out[2]  = a02 * cos - a22 * sin;
    out[3]  = a03 * cos - a23 * sin;
    out[4]  = m[4];
    out[5]  = m[5];
    out[6]  = m[6];
    out[7]  = m[7];
    out[8]  = a00 * sin + a20 * cos;
    out[9]  = a01 * sin + a21 * cos;
    out[10] = a02 * sin + a22 * cos;
    out[11] = a03 * sin + a23 * cos;
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];

    return out;
};

/**
 * Applies a rotation around the Z axis to a matrix.
 *
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The rotated matrix
 */
export const rotateZ = (m: Matrix4Like, theta: number): Matrix4Like => {
    return multiply(m, rotationZ(theta));
};

/**
 * Applies a rotation around the Z axis to a matrix and writes the result to out.
 *
 * @param   out   - The output matrix
 * @param   m     - The input matrix
 * @param   theta - The angle in radians
 * @returns         The output matrix
 */
export const rotateZMut = (out: Matrix4Like, m: Matrix4Like, theta: number): Matrix4Like => {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    out[0]  = a00 * cos + a10 * sin;
    out[1]  = a01 * cos + a11 * sin;
    out[2]  = a02 * cos + a12 * sin;
    out[3]  = a03 * cos + a13 * sin;
    out[4]  = a10 * cos - a00 * sin;
    out[5]  = a11 * cos - a01 * sin;
    out[6]  = a12 * cos - a02 * sin;
    out[7]  = a13 * cos - a03 * sin;
    out[8]  = m[8];
    out[9]  = m[9];
    out[10] = m[10];
    out[11] = m[11];
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];

    return out;
};

/**
 * Copies a matrix.
 *
 * @param   m - The input matrix
 * @returns     A copy of the matrix
 */
export const copy = (m: Matrix4Like): Matrix4Like => {
    return [
        m[0],  m[1],  m[2],  m[3],
        m[4],  m[5],  m[6],  m[7],
        m[8],  m[9],  m[10], m[11],
        m[12], m[13], m[14], m[15],
    ];
};

/**
 * Copies a matrix and writes the result to out.
 *
 * @param   out - The output matrix
 * @param   m   - The input matrix
 * @returns       The output matrix
 */
export const copyMut = (out: Matrix4Like, m: Matrix4Like): Matrix4Like => {
    out[0]  = m[0]; out[1]  = m[1]; out[2]  = m[2]; out[3]  = m[3];
    out[4]  = m[4]; out[5]  = m[5]; out[6]  = m[6]; out[7]  = m[7];
    out[8]  = m[8]; out[9]  = m[9]; out[10] = m[10]; out[11] = m[11];
    out[12] = m[12]; out[13] = m[13]; out[14] = m[14]; out[15] = m[15];

    return out;
};

/**
 * Checks if two matrices are exactly equal.
 *
 * @param   m1 - The first matrix
 * @param   m2 - The second matrix
 * @returns      True if equal, false otherwise
 */
export const equal = (m1: Matrix4Like, m2: Matrix4Like): boolean => {
    return m1[0] === m2[0] && m1[1] === m2[1] && m1[2] === m2[2] && m1[3] === m2[3]
        && m1[4] === m2[4] && m1[5] === m2[5] && m1[6] === m2[6] && m1[7] === m2[7]
        && m1[8] === m2[8] && m1[9] === m2[9] && m1[10] === m2[10] && m1[11] === m2[11]
        && m1[12] === m2[12] && m1[13] === m2[13] && m1[14] === m2[14] && m1[15] === m2[15];
};

/**
 * Checks if two matrices are approximately equal within a given epsilon.
 *
 * @param   m1      - The first matrix
 * @param   m2      - The second matrix
 * @param   epsilon - The tolerance (default 1e-6)
 * @returns           True if approximately equal, false otherwise
 */
export const equalApprox = (m1: Matrix4Like, m2: Matrix4Like, epsilon = 1e-6): boolean => {
    for (let i = 0; i < 16; i++) {
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
export const toFloat32Array = (m: Matrix4Like): Float32Array => {
    return new Float32Array([
        m[0], m[4], m[8],  m[12],
        m[1], m[5], m[9],  m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15],
    ]);
};
