import { RADIANS_PER_DEGREE } from './constants.js';
import type { Matrix4Like } from './types.js';

/**
 * A 4x4 matrix class for 3D transformations.
 *
 * The matrix is stored in row-major order as a flat array of 16 elements:
 * [m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33]
 *
 * For 3D transformations:
 * - m00, m01, m02: x-axis basis vector
 * - m10, m11, m12: y-axis basis vector
 * - m20, m21, m22: z-axis basis vector
 * - m30, m31, m32: translation vector
 * - m03, m13, m23, m33: typically [0, 0, 0, 1] for affine transformations
 */
class Matrix4 {
    private elements: Matrix4Like;

    constructor(matrix?: Matrix4Like | number[]) {
        if (matrix && matrix.length === 16) {
            this.elements = [
                matrix[0]!,  matrix[1]!,  matrix[2]!,  matrix[3]!,
                matrix[4]!,  matrix[5]!,  matrix[6]!,  matrix[7]!,
                matrix[8]!,  matrix[9]!,  matrix[10]!, matrix[11]!,
                matrix[12]!, matrix[13]!, matrix[14]!, matrix[15]!,
            ];
        } else {
            this.elements = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];
        }
    }

    /**
     * Creates an identity matrix.
     *
     * @returns The identity matrix
     */
    public static identity(): Matrix4 {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }

    /**
     * Creates a translation matrix.
     *
     * @param   x - The x translation
     * @param   y - The y translation
     * @param   z - The z translation
     * @returns     The translation matrix
     */
    public static translation(x: number, y: number, z: number): Matrix4 {
        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ]);
    }

    /**
     * Creates a scaling matrix.
     *
     * @param   x - The x scale
     * @param   y - The y scale
     * @param   z - The z scale
     * @returns     The scaling matrix
     */
    public static scaling(x: number, y: number, z: number): Matrix4 {
        return new Matrix4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ]);
    }

    /**
     * Creates a rotation matrix around the X axis.
     *
     * @param   theta - The angle in radians
     * @returns         The rotation matrix
     */
    public static rotationX(theta: number): Matrix4 {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return new Matrix4([
            1, 0,    0,   0,
            0, cos,  sin, 0,
            0, -sin, cos, 0,
            0, 0,    0,   1,
        ]);
    }

    /**
     * Creates a rotation matrix around the Y axis.
     *
     * @param   theta - The angle in radians
     * @returns         The rotation matrix
     */
    public static rotationY(theta: number): Matrix4 {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return new Matrix4([
            cos, 0, -sin, 0,
            0,   1, 0,    0,
            sin, 0, cos,  0,
            0,   0, 0,    1,
        ]);
    }

    /**
     * Creates a rotation matrix around the Z axis.
     *
     * @param   theta - The angle in radians
     * @returns         The rotation matrix
     */
    public static rotationZ(theta: number): Matrix4 {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return new Matrix4([
            cos,  sin, 0, 0,
            -sin, cos, 0, 0,
            0,    0,   1, 0,
            0,    0,   0, 1,
        ]);
    }

    /**
     * Creates a perspective projection matrix.
     *
     * @param   aspectRatio - The aspect ratio (width / height)
     * @param   fov         - The field of view in degrees
     * @param   near        - The near clipping plane
     * @param   far         - The far clipping plane
     * @returns               The projection matrix
     */
    public static projection(aspectRatio: number, fov: number, near: number, far: number): Matrix4 {
        const fovRad = 1 / Math.tan(fov * 0.5 * RADIANS_PER_DEGREE);
        const rangeInv = 1 / (far - near);

        return new Matrix4([
            aspectRatio * fovRad, 0,      0,                        0,
            0,                    fovRad, 0,                        0,
            0,                    0,      far * rangeInv,           1,
            0,                    0,      (-far * near) * rangeInv, 0,
        ]);
    }

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
    public static ortho(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number,
    ): Matrix4 {
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const fn = 1 / (far - near);

        return new Matrix4([
            2 * rl,               0,                    0,                   0,
            0,                    2 * tb,               0,                   0,
            0,                    0,                    -2 * fn,             0,
            -(right + left) * rl, -(top + bottom) * tb, -(far + near) * fn, 1,
        ]);
    }

    /**
     * Multiplies two matrices (m1 * m2).
     *
     * @param   m1 - The first matrix
     * @param   m2 - The second matrix
     * @returns      The result matrix
     */
    public static multiply(m1: Matrix4, m2: Matrix4): Matrix4 {
        const a = m1.elements;
        const b = m2.elements;

        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
        const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
        const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

        return new Matrix4([
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
        ]);
    }

    /**
     * Sets this matrix to the identity matrix.
     *
     * @returns This matrix for chaining
     */
    public toIdentity(): this {
        this.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a translation matrix.
     *
     * @param   x - The x translation
     * @param   y - The y translation
     * @param   z - The z translation
     * @returns     This matrix for chaining
     */
    public toTranslation(x: number, y: number, z: number): this {
        this.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a scaling matrix.
     *
     * @param   x - The x scale
     * @param   y - The y scale
     * @param   z - The z scale
     * @returns     This matrix for chaining
     */
    public toScaling(x: number, y: number, z: number): this {
        this.elements = [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a rotation matrix around the X axis.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public toRotationX(theta: number): this {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        this.elements = [
            1, 0,    0,   0,
            0, cos,  sin, 0,
            0, -sin, cos, 0,
            0, 0,    0,   1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a rotation matrix around the Y axis.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public toRotationY(theta: number): this {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        this.elements = [
            cos, 0, -sin, 0,
            0,   1, 0,    0,
            sin, 0, cos,  0,
            0,   0, 0,    1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a rotation matrix around the Z axis.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public toRotationZ(theta: number): this {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        this.elements = [
            cos,  sin, 0, 0,
            -sin, cos, 0, 0,
            0,    0,   1, 0,
            0,    0,   0, 1,
        ];

        return this;
    }

    /**
     * Multiplies this matrix by another matrix (this = this * mat).
     *
     * @param   mat - The matrix to multiply by
     * @returns       This matrix for chaining
     */
    public multiply(mat: Matrix4): this {
        const a = this.elements;
        const b = mat.elements;

        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        this.elements = [
            a00 * b[0] + a01 * b[4] + a02 * b[8] + a03 * b[12],
            a00 * b[1] + a01 * b[5] + a02 * b[9] + a03 * b[13],
            a00 * b[2] + a01 * b[6] + a02 * b[10] + a03 * b[14],
            a00 * b[3] + a01 * b[7] + a02 * b[11] + a03 * b[15],

            a10 * b[0] + a11 * b[4] + a12 * b[8] + a13 * b[12],
            a10 * b[1] + a11 * b[5] + a12 * b[9] + a13 * b[13],
            a10 * b[2] + a11 * b[6] + a12 * b[10] + a13 * b[14],
            a10 * b[3] + a11 * b[7] + a12 * b[11] + a13 * b[15],

            a20 * b[0] + a21 * b[4] + a22 * b[8] + a23 * b[12],
            a20 * b[1] + a21 * b[5] + a22 * b[9] + a23 * b[13],
            a20 * b[2] + a21 * b[6] + a22 * b[10] + a23 * b[14],
            a20 * b[3] + a21 * b[7] + a22 * b[11] + a23 * b[15],

            a30 * b[0] + a31 * b[4] + a32 * b[8] + a33 * b[12],
            a30 * b[1] + a31 * b[5] + a32 * b[9] + a33 * b[13],
            a30 * b[2] + a31 * b[6] + a32 * b[10] + a33 * b[14],
            a30 * b[3] + a31 * b[7] + a32 * b[11] + a33 * b[15],
        ];

        return this;
    }

    /**
     * Applies a translation to this matrix.
     *
     * @param   x - The x translation
     * @param   y - The y translation
     * @param   z - The z translation
     * @returns     This matrix for chaining
     */
    public translate(x: number, y: number, z: number): this {
        return this.multiply(Matrix4.translation(x, y, z));
    }

    /**
     * Applies a scale to this matrix.
     *
     * @param   x - The x scale
     * @param   y - The y scale
     * @param   z - The z scale
     * @returns     This matrix for chaining
     */
    public scale(x: number, y: number, z: number): this {
        return this.multiply(Matrix4.scaling(x, y, z));
    }

    /**
     * Applies a rotation around the X axis to this matrix.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public rotateX(theta: number): this {
        return this.multiply(Matrix4.rotationX(theta));
    }

    /**
     * Applies a rotation around the Y axis to this matrix.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public rotateY(theta: number): this {
        return this.multiply(Matrix4.rotationY(theta));
    }

    /**
     * Applies a rotation around the Z axis to this matrix.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public rotateZ(theta: number): this {
        return this.multiply(Matrix4.rotationZ(theta));
    }

    /**
     * Transposes this matrix.
     *
     * @returns This matrix for chaining
     */
    public transpose(): this {
        const m = this.elements;
        const m01 = m[1], m02 = m[2], m03 = m[3];
        const m12 = m[6], m13 = m[7];
        const m23 = m[11];

        this.elements[1]  = m[4];
        this.elements[2]  = m[8];
        this.elements[3]  = m[12];
        this.elements[4]  = m01;
        this.elements[6]  = m[9];
        this.elements[7]  = m[13];
        this.elements[8]  = m02;
        this.elements[9]  = m12;
        this.elements[11] = m[14];
        this.elements[12] = m03;
        this.elements[13] = m13;
        this.elements[14] = m23;

        return this;
    }

    /**
     * Inverts this matrix.
     *
     * @returns This matrix for chaining, or null if the matrix is not invertible
     */
    public invert(): this | null {
        const m = this.elements;
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

        this.elements = [
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

        return this;
    }

    /**
     * Calculates the determinant of this matrix.
     *
     * @returns The determinant
     */
    public determinant(): number {
        const m = this.elements;
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
    }

    /**
     * Converts this matrix to a Float32Array in column-major order.
     *
     * @returns The Float32Array representation in column-major order
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array([
            this.elements[0], this.elements[4], this.elements[8],  this.elements[12],
            this.elements[1], this.elements[5], this.elements[9],  this.elements[13],
            this.elements[2], this.elements[6], this.elements[10], this.elements[14],
            this.elements[3], this.elements[7], this.elements[11], this.elements[15],
        ]);
    }

    /**
     * Gets the element at row i, column j.
     *
     * @param   i - The row index (0-3)
     * @param   j - The column index (0-3)
     * @returns     The element value
     */
    public get(i: number, j: number): number {
        if (i < 0 || i > 3 || j < 0 || j > 3) {
            throw new RangeError(`[Matrix4::get]: Index out of bounds: (${i}, ${j})`);
        }

        return this.elements[i * 4 + j]!;
    }

    /**
     * Sets the element at row i, column j.
     *
     * @param   i     - The row index (0-3)
     * @param   j     - The column index (0-3)
     * @param   value - The value to set
     * @returns         This matrix for chaining
     */
    public set(i: number, j: number, value: number): this {
        if (i < 0 || i > 3 || j < 0 || j > 3) {
            throw new RangeError(`[Matrix4::set]: Index out of bounds: (${i}, ${j})`);
        }

        this.elements[i * 4 + j] = value;

        return this;
    }

    /**
     * Copies the values from another matrix to this matrix.
     *
     * @param   matrix - The matrix to copy from
     * @returns          This matrix for chaining
     */
    public copy(matrix: Matrix4): this {
        this.elements = [...matrix.elements];

        return this;
    }

    /**
     * Creates a clone of this matrix.
     *
     * @returns A new matrix with the same values
     */
    public clone(): Matrix4 {
        return new Matrix4([...this.elements]);
    }

    /**
     * Gets the internal elements array.
     *
     * @returns The internal elements array
     */
    public getElements(): Matrix4Like {
        return this.elements;
    }
}

export default Matrix4;
