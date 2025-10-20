import type { Matrix3Like } from './types.js';

/**
 * A 3x3 matrix class for 2D transformations.
 *
 * The matrix is stored in row-major order as a flat array of 9 elements:
 * [m00, m01, m02, m10, m11, m12, m20, m21, m22]
 *
 * For 2D transformations:
 * - m00, m01: x-axis basis vector
 * - m10, m11: y-axis basis vector
 * - m20, m21: translation vector
 * - m02, m12, m22: typically [0, 0, 1] for affine transformations
 */
class Matrix3 {
    private elements: Matrix3Like;

    constructor(matrix?: Matrix3Like | number[]) {
        if (matrix && matrix.length === 9) {
            this.elements = [
                matrix[0]!, matrix[1]!, matrix[2]!,
                matrix[3]!, matrix[4]!, matrix[5]!,
                matrix[6]!, matrix[7]!, matrix[8]!,
            ];
        } else {
            this.elements = [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ];
        }
    }

    /**
     * Creates an identity matrix.
     *
     * @returns The identity matrix
     */
    public static identity(): Matrix3 {
        return new Matrix3([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]);
    }

    /**
     * Creates a translation matrix.
     *
     * @param   x - The x translation
     * @param   y - The y translation
     * @returns     The translation matrix
     */
    public static translation(x: number, y: number): Matrix3 {
        return new Matrix3([
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        ]);
    }

    /**
     * Creates a scaling matrix.
     *
     * @param   x - The x scale
     * @param   y - The y scale
     * @returns     The scaling matrix
     */
    public static scaling(x: number, y: number): Matrix3 {
        return new Matrix3([
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        ]);
    }

    /**
     * Creates a rotation matrix from an angle in radians.
     *
     * @param   theta - The angle in radians
     * @returns         The rotation matrix
     */
    public static rotation(theta: number): Matrix3 {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        return new Matrix3([
            cos,  sin, 0,
            -sin, cos, 0,
            0,    0,   1,
        ]);
    }

    /**
     * Multiplies two matrices (m1 * m2).
     *
     * @param   m1 - The first matrix
     * @param   m2 - The second matrix
     * @returns      The result matrix
     */
    public static multiply(m1: Matrix3, m2: Matrix3): Matrix3 {
        const a = m1.elements;
        const b = m2.elements;

        return new Matrix3([
            a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
            a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
            a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

            a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
            a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
            a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

            a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
            a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
            a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
        ]);
    }

    /**
     * Sets this matrix to the identity matrix.
     *
     * @returns This matrix for chaining
     */
    public toIdentity(): this {
        this.elements = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a translation matrix.
     *
     * @param   x - The x translation
     * @param   y - The y translation
     * @returns     This matrix for chaining
     */
    public toTranslation(x: number, y: number): this {
        this.elements = [
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a scaling matrix.
     *
     * @param   x - The x scale
     * @param   y - The y scale
     * @returns     This matrix for chaining
     */
    public toScaling(x: number, y: number): this {
        this.elements = [
            x, 0, 0,
            0, y, 0,
            0, 0, 1,
        ];

        return this;
    }

    /**
     * Sets this matrix to a rotation matrix from an angle in radians.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public toRotation(theta: number): this {
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        this.elements = [
            cos,  sin, 0,
            -sin, cos, 0,
            0,    0,   1,
        ];

        return this;
    }

    /**
     * Multiplies this matrix by another matrix (this = this * mat).
     *
     * @param   mat - The matrix to multiply by
     * @returns       This matrix for chaining
     */
    public multiply(mat: Matrix3): this {
        const a = this.elements;
        const b = mat.elements;

        const a00 = a[0], a01 = a[1], a02 = a[2];
        const a10 = a[3], a11 = a[4], a12 = a[5];
        const a20 = a[6], a21 = a[7], a22 = a[8];

        this.elements = [
            a00 * b[0] + a01 * b[3] + a02 * b[6],
            a00 * b[1] + a01 * b[4] + a02 * b[7],
            a00 * b[2] + a01 * b[5] + a02 * b[8],

            a10 * b[0] + a11 * b[3] + a12 * b[6],
            a10 * b[1] + a11 * b[4] + a12 * b[7],
            a10 * b[2] + a11 * b[5] + a12 * b[8],

            a20 * b[0] + a21 * b[3] + a22 * b[6],
            a20 * b[1] + a21 * b[4] + a22 * b[7],
            a20 * b[2] + a21 * b[5] + a22 * b[8],
        ];

        return this;
    }

    /**
     * Applies a translation to this matrix.
     *
     * @param   x - The x translation
     * @param   y - The y translation
     * @returns     This matrix for chaining
     */
    public translate(x: number, y: number): this {
        return this.multiply(Matrix3.translation(x, y));
    }

    /**
     * Applies a scale to this matrix.
     *
     * @param   x - The x scale
     * @param   y - The y scale
     * @returns     This matrix for chaining
     */
    public scale(x: number, y: number): this {
        return this.multiply(Matrix3.scaling(x, y));
    }

    /**
     * Applies a rotation to this matrix.
     *
     * @param   theta - The angle in radians
     * @returns         This matrix for chaining
     */
    public rotate(theta: number): this {
        return this.multiply(Matrix3.rotation(theta));
    }

    /**
     * Transposes this matrix.
     *
     * @returns This matrix for chaining
     */
    public transpose(): this {
        const m = this.elements;
        const m01 = m[1], m02 = m[2];
        const m12 = m[5];

        this.elements[1] = m[3];
        this.elements[2] = m[6];
        this.elements[3] = m01;
        this.elements[5] = m[7];
        this.elements[6] = m02;
        this.elements[7] = m12;

        return this;
    }

    /**
     * Inverts this matrix.
     *
     * @returns This matrix for chaining, or null if the matrix is not invertible
     */
    public invert(): this | null {
        const m = this.elements;
        const a = m[0], b = m[1], c = m[2];
        const d = m[3], e = m[4], f = m[5];
        const g = m[6], h = m[7], i = m[8];

        const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);

        if (det === 0) {
            return null;
        }

        const invDet = 1 / det;

        this.elements = [
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

        return this;
    }

    /**
     * Calculates the determinant of this matrix.
     *
     * @returns The determinant
     */
    public determinant(): number {
        const m = this.elements;
        const a = m[0], b = m[1], c = m[2];
        const d = m[3], e = m[4], f = m[5];
        const g = m[6], h = m[7], i = m[8];

        return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

    /**
     * Clamps the scale components of this matrix between min and max.
     *
     * @param   min - The minimum scale value
     * @param   max - The maximum scale value
     * @returns       This matrix for chaining
     */
    public clampScale(min: number, max: number): this {
        this.elements[0] = Math.min(Math.max(this.elements[0], min), max);
        this.elements[4] = Math.min(Math.max(this.elements[4], min), max);

        return this;
    }

    /**
     * Converts this matrix to canvas transform format (a, b, c, d, e, f).
     *
     * @returns The canvas transform array [a, b, c, d, e, f]
     */
    public toCanvasTransform(): [number, number, number, number, number, number] {
        return [
            this.elements[0],
            this.elements[1],
            this.elements[3],
            this.elements[4],
            this.elements[6],
            this.elements[7],
        ];
    }

    /**
     * Converts this matrix to a regular array in column-major order.
     *
     * @returns The array representation in column-major order
     */
    public toArray(): number[] {
        return [
            this.elements[0], this.elements[3], this.elements[6],
            this.elements[1], this.elements[4], this.elements[7],
            this.elements[2], this.elements[5], this.elements[8],
        ];
    }

    /**
     * Converts this matrix to a Float32Array in column-major order.
     *
     * @returns The Float32Array representation in column-major order
     */
    public toFloat32Array(): Float32Array {
        return new Float32Array([
            this.elements[0], this.elements[3], this.elements[6],
            this.elements[1], this.elements[4], this.elements[7],
            this.elements[2], this.elements[5], this.elements[8],
        ]);
    }

    /**
     * Gets the element at row i, column j.
     *
     * @param   i - The row index (0-2)
     * @param   j - The column index (0-2)
     * @returns     The element value
     */
    public get(i: number, j: number): number {
        if (i < 0 || i > 2 || j < 0 || j > 2) {
            throw new RangeError(`[Matrix3::get]: Index out of bounds: (${i}, ${j})`);
        }

        return this.elements[i * 3 + j]!;
    }

    /**
     * Sets the element at row i, column j.
     *
     * @param   i     - The row index (0-2)
     * @param   j     - The column index (0-2)
     * @param   value - The value to set
     * @returns         This matrix for chaining
     */
    public set(i: number, j: number, value: number): this {
        if (i < 0 || i > 2 || j < 0 || j > 2) {
            throw new RangeError(`[Matrix3::set]: Index out of bounds: (${i}, ${j})`);
        }

        this.elements[i * 3 + j] = value;

        return this;
    }

    /**
     * Copies the values from another matrix to this matrix.
     *
     * @param   matrix - The matrix to copy from
     * @returns          This matrix for chaining
     */
    public copy(matrix: Matrix3): this {
        this.elements = [...matrix.elements];

        return this;
    }

    /**
     * Creates a clone of this matrix.
     *
     * @returns A new matrix with the same values
     */
    public clone(): Matrix3 {
        return new Matrix3([...this.elements]);
    }

    /**
     * Gets the internal elements array.
     *
     * @returns The internal elements array
     */
    public getElements(): Matrix3Like {
        return this.elements;
    }
}

export default Matrix3;
