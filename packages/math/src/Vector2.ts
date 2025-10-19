import { prng } from '@hatti/random';
import { TAU } from './constants.js';

/**
 * 2D vector class with common vector operations.
 */
class Vector2 {
    public x: number;

    public y: number;

    /**
     * Creates a new Vector2 instance.
     *
     * @param   x - The x component (default 0)
     * @param   y - The y component (default 0)
     * @returns     The new Vector2 instance
     */
    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds two vectors.
     *
     * @param   v1 - The first vector
     * @param   v2 - The second vector
     * @returns      The result vector
     */
    public static add(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Subtracts one vector from another.
     *
     * @param   v1 - The first vector
     * @param   v2 - The second vector
     * @returns      The result vector
     */
    public static sub(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    /**
     * Multiplies two vectors component-wise.
     *
     * @param   v1 - The first vector
     * @param   v2 - The second vector
     * @returns      The result vector
     */
    public static multiply(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x * v2.x, v1.y * v2.y);
    }

    /**
     * Divides two vectors component-wise.
     *
     * @param   v1 - The numerator vector
     * @param   v2 - The denominator vector
     * @returns      The result vector
     */
    public static divide(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x / v2.x, v1.y / v2.y);
    }

    /**
     * Linearly interpolates between two vectors.
     *
     * @param   v1 - The start vector
     * @param   v2 - The end vector
     * @param   t  - The interpolation factor (0-1)
     * @returns      The interpolated vector
     */
    public static lerp(v1: Vector2, v2: Vector2, t: number): Vector2 {
        return new Vector2(
            v1.x + (v2.x - v1.x) * t,
            v1.y + (v2.y - v1.y) * t,
        );
    };

    /**
     * Creates a vector from an angle and length.
     *
     * @param   angle  - The angle in radians
     * @param   length - The length (default 1)
     * @returns          The resulting vector
     */
    public static fromAngle(angle: number, length = 1): Vector2 {
        return new Vector2(length * Math.cos(angle), length * Math.sin(angle));
    }

    /**
     * Returns a vector perpendicular to the input vector.
     *
     * @param   v - The input vector
     * @returns     The perpendicular vector
     */
    public static perpendicular(v: Vector2): Vector2 {
        return new Vector2(-v.y, v.x);
    }

    /**
     * Returns a random unit vector.
     *
     * @returns The random vector
     */
    public static random(): Vector2 {
        return this.fromAngle(prng.random(1) * TAU);
    }

    /**
     * Checks if a vector is normalized (unit length) within a given epsilon.
     *
     * @param   v       - The input vector
     * @param   epsilon - The tolerance (default 1e-6)
     * @returns           True if normalized, false otherwise
     */
    public static isNormalized(v: Vector2, epsilon = 1e-6): boolean {
        const mag = v.magnitude();

        return Math.abs(mag - 1) <= epsilon;
    }

    /**
     * Sets the x and y components of the vector.
     *
     * @param   x - The x component
     * @param   y - The y component (optional, defaults to x)
     * @returns     This vector
     */
    public set(x: number, y?: number): Vector2 {
        this.x = x;
        this.y = y ?? x;

        return this;
    }

    /**
     * Sets the x component of the vector.
     *
     * @param   n - The new x value
     * @returns     This vector
     */
    public setX(n: number): Vector2 {
        this.x = n;

        return this;
    }

    /**
     * Sets the y component of the vector.
     *
     * @param   n - The new y value
     * @returns     This vector
     */
    public setY(n: number): Vector2 {
        this.y = n;

        return this;
    }

    /**
     * Adds another vector to this vector.
     *
     * @param   v - The vector to add
     * @returns     This vector
     */
    public add(v: Vector2): Vector2 {
        this.x += v.x;
        this.y += v.y;

        return this;
    }

    /**
     * Adds a scalar to both components of this vector.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public addScalar(n: number) {
        this.x += n;
        this.y += n;

        return this;
    }

    /**
     * Adds a scalar to the x component of this vector.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public addScalarX(n: number): Vector2 {
        this.x += n;

        return this;
    }

    /**
     * Adds a scalar to the y component of this vector.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public addScalarY(n: number): Vector2 {
        this.y += n;

        return this;
    }

    /**
     * Subtracts another vector from this vector.
     *
     * @param   v - The vector to subtract
     * @returns     This vector
     */
    public sub(v: Vector2): Vector2 {
        this.x -= v.x;
        this.y -= v.y;

        return this;
    }

    /**
     * Subtracts a scalar from both components of this vector.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public subScalar(n: number) {
        this.x -= n;
        this.y -= n;

        return this;
    }

    /**
     * Subtracts a scalar from the x component of this vector.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public subScalarX(n: number): Vector2 {
        this.x -= n;

        return this;
    }

    /**
     * Subtracts a scalar from the y component of this vector.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public subScalarY(n: number): Vector2 {
        this.y -= n;

        return this;
    }

    /**
     * Multiplies this vector by another vector component-wise.
     *
     * @param   v - The vector to multiply by
     * @returns     This vector
     */
    public multiply(v: Vector2): Vector2 {
        this.x *= v.x;
        this.y *= v.y;

        return this;
    }

    /**
     * Multiplies both components of this vector by a scalar.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public multiplyScalar(n: number) {
        this.x *= n;
        this.y *= n;

        return this;
    }

    /**
     * Multiplies the x component of this vector by a scalar.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public multiplyScalarX(n: number): Vector2 {
        this.x *= n;

        return this;
    }

    /**
     * Multiplies the y component of this vector by a scalar.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public multiplyScalarY(n: number): Vector2 {
        this.y *= n;

        return this;
    }

    /**
     * Divides this vector by another vector component-wise.
     *
     * @param   v - The vector to divide by
     * @returns     This vector
     */
    public divide(v: Vector2): Vector2 {
        this.x /= v.x;
        this.y /= v.y;

        return this;
    }

    /**
     * Divides both components of this vector by a scalar.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public divideScalar(n: number) {
        this.x /= n;
        this.y /= n;

        return this;
    }

    /**
     * Divides the x component of this vector by a scalar.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public divideScalarX(n: number): Vector2 {
        this.x /= n;

        return this;
    }

    /**
     * Divides the y component of this vector by a scalar.
     *
     * @param   n - The scalar value
     * @returns     This vector
     */
    public divideScalarY(n: number): Vector2 {
        this.y /= n;

        return this;
    }

    /**
     * Translates this vector by x and y offsets.
     *
     * @param   x - The x offset
     * @param   y - The y offset
     * @returns     This vector
     */
    public translate(x: number, y: number): Vector2 {
        this.x += x;
        this.y += y;

        return this;
    }

    /**
     * Scales this vector by x and y factors.
     *
     * @param   x - The x scale factor
     * @param   y - The y scale factor
     * @returns     This vector
     */
    public scale(x: number, y: number): Vector2 {
        this.x *= x;
        this.y *= y;

        return this;
    }

    /**
     * Negates both components of this vector.
     *
     * @returns This vector
     */
    public negate(): Vector2 {
        this.x *= -1;
        this.y *= -1;

        return this;
    }

    /**
     * Applies Math.ceil to both components of this vector.
     *
     * @returns This vector
     */
    public ceil(): Vector2 {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);

        return this;
    }

    /**
     * Applies Math.floor to both components of this vector.
     *
     * @returns This vector
     */
    public floor(): Vector2 {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        return this;
    }

    /**
     * Applies Math.round to both components of this vector.
     *
     * @returns This vector
     */
    public round(): Vector2 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    /**
     * Rotates this vector by a given angle (radians).
     *
     * @param   angle - The angle in radians
     * @returns         This vector
     */
    public rotate(angle: number): Vector2 {
        const { x, y } = this;

        this.x = (x * Math.cos(angle)) - (y * Math.sin(angle));
        this.y = (x * Math.sin(angle)) + (y * Math.cos(angle));

        return this;
    }

    /**
     * Rotates this vector around a pivot point by a given angle (radians).
     *
     * @param   pivot - The pivot point
     * @param   angle - The angle in radians
     * @returns         This vector
     */
    public rotateAround(pivot: Vector2, angle: number): Vector2 {
        const x = this.x - pivot.x;
        const y = this.y - pivot.y;

        this.x = ((x * Math.cos(angle)) - (y * Math.sin(angle))) + pivot.x;
        this.y = ((x * Math.sin(angle)) + (y * Math.cos(angle))) + pivot.y;

        return this;
    }

    /**
     * Linearly interpolates this vector toward another vector.
     *
     * @param   v - The target vector
     * @param   t - The interpolation factor (0-1)
     * @returns     This vector
     */
    public lerp(v: Vector2, t: number): Vector2 {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;

        return this;
    };

    /**
     * Applies Math.abs to both components of this vector.
     *
     * @returns This vector
     */
    public abs(): Vector2 {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);

        return this;
    };

    /**
     * Clamps this vector's components between the corresponding min and max values.
     *
     * @param   minV - The minimum vector
     * @param   maxV - The maximum vector
     * @returns        This vector
     */
    public clamp(minV: Vector2, maxV: Vector2): Vector2 {
        this.x = Math.min(Math.max(this.x, minV.x), maxV.x);
        this.y = Math.min(Math.max(this.y, minV.y), maxV.y);

        return this;
    }

    /**
     * Clamps both components of this vector between min and max scalars.
     *
     * @param   min - The minimum value
     * @param   max - The maximum value
     * @returns       This vector
     */
    public clampScalar(min: number, max: number): Vector2 {
        this.x = Math.min(Math.max(this.x, min), max);
        this.y = Math.min(Math.max(this.y, min), max);

        return this;
    }

    /**
     * Clamps the x component of this vector between min and max.
     *
     * @param   min - The minimum x value
     * @param   max - The maximum x value
     * @returns       This vector
     */
    public clampX(min: number, max: number): Vector2 {
        this.x = Math.min(Math.max(this.x, min), max);

        return this;
    }

    /**
     * Clamps the y component of this vector between min and max.
     *
     * @param   min - The minimum y value
     * @param   max - The maximum y value
     * @returns       This vector
     */
    public clampY(min: number, max: number): Vector2 {
        this.y = Math.min(Math.max(this.y, min), max);

        return this;
    }

    /**
     * Sets each component of this vector to the minimum of itself and the given vector.
     *
     * @param   v - The minimum vector
     * @returns     This vector
     */
    public min(v: Vector2): Vector2 {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);

        return this;
    }

    /**
     * Sets both components of this vector to the minimum of itself and the given scalar.
     *
     * @param   min - The minimum value
     * @returns       This vector
     */
    public minScalar(min: number): Vector2 {
        this.x = Math.min(this.x, min);
        this.y = Math.min(this.y, min);

        return this;
    }

    /**
     * Sets the x component of this vector to the minimum of itself and the given value.
     *
     * @param   min - The minimum x value
     * @returns       This vector
     */
    public minX(min: number): Vector2 {
        this.x = Math.min(this.x, min);

        return this;
    }

    /**
     * Sets the y component of this vector to the minimum of itself and the given value.
     *
     * @param   min - The minimum y value
     * @returns       This vector
     */
    public minY(min: number): Vector2 {
        this.y = Math.min(this.y, min);

        return this;
    }

    /**
     * Sets each component of this vector to the maximum of itself and the given vector.
     *
     * @param   v - The maximum vector
     * @returns     This vector
     */
    public max(v: Vector2): Vector2 {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);

        return this;
    }

    /**
     * Sets both components of this vector to the maximum of itself and the given scalar.
     *
     * @param   max - The maximum value
     * @returns       This vector
     */
    public maxScalar(max: number): Vector2 {
        this.x = Math.max(this.x, max);
        this.y = Math.max(this.y, max);

        return this;
    }

    /**
     * Sets the x component of this vector to the maximum of itself and the given value.
     *
     * @param   max - The maximum x value
     * @returns       This vector
     */
    public maxX(max: number): Vector2 {
        this.x = Math.max(this.x, max);

        return this;
    }

    /**
     * Sets the y component of this vector to the maximum of itself and the given value.
     *
     * @param   max - The maximum y value
     * @returns       This vector
     */
    public maxY(max: number): Vector2 {
        this.y = Math.max(this.y, max);

        return this;
    }

    /**
     * Clamps the magnitude (length) of this vector between min and max.
     *
     * @param   min - The minimum magnitude
     * @param   max - The maximum magnitude
     * @returns       This vector
     */
    public clampMagnitude(min: number, max: number): Vector2 {
        const mag = this.magnitude();

        this.setMagnitude(Math.min(Math.max(mag, min), max));

        return this;
    }

    /**
     * Ensures the magnitude (length) of this vector is at least min.
     *
     * @param   min - The minimum magnitude
     * @returns       This vector
     */
    public minMagnitude(min: number): Vector2 {
        if (this.magnitude() < min) {
            this.setMagnitude(min);
        }

        return this;
    }

    /**
     * Ensures the magnitude (length) of this vector is at most max.
     *
     * @param   max - The maximum magnitude
     * @returns       This vector
     */
    public maxMagnitude(max: number): Vector2 {
        if (this.magnitude() > max) {
            this.setMagnitude(max);
        }

        return this;
    }

    /**
     * Returns the magnitude (length) of this vector.
     *
     * @returns The magnitude
     */
    public magnitude(): number {
        return Math.sqrt((this.x ** 2) + (this.y ** 2));
    }

    /**
     * Sets the magnitude (length) of this vector.
     *
     * @param   value - The new magnitude
     * @returns         This vector
     */
    public setMagnitude(value: number): Vector2 {
        return this.normalize().multiplyScalar(value);
    }

    /**
     * Normalizes this vector to unit length.
     *
     * @returns This vector
     */
    public normalize(): Vector2 {
        return this.divideScalar(this.magnitude());
    }

    /**
     * Returns the Euclidean distance from this vector to another vector or point.
     *
     * @param   v - The other vector
     * @returns     The distance
     *
     * @param   x - The x coordinate
     * @param   y - The y coordinate
     * @returns     The distance
     */
    public dist(v: Vector2): number;
    public dist(x: number, y: number): number;
    public dist(vOrX: Vector2 | number, y?: number): number {
        const vX = (vOrX as Vector2)?.x ?? vOrX;
        const vY = (vOrX as Vector2)?.y ?? y;

        return Math.hypot(this.x - vX, this.y - vY);
    }

    /**
     * Returns the normalized direction vector from the given vector to this vector.
     *
     * @param   v - The other vector
     * @returns     The direction vector
     */
    public directionFrom(v: Vector2): Vector2 {
        return Vector2
            .sub(this, v)
            .normalize();
    }

    /**
     * Returns the normalized direction vector from this vector to the given vector.
     *
     * @param   v - The other vector
     * @returns     The direction vector
     */
    public directionTo(v: Vector2): Vector2 {
        return Vector2
            .sub(v, this)
            .normalize();
    }

    /**
     * Sets this vector to a random unit vector.
     *
     * @returns This vector
     */
    public toRandom(): Vector2 {
        const angle = prng.random(1) * TAU;

        this.x = Math.cos(angle);
        this.y = Math.sin(angle);

        return this;
    }

    /**
     * Returns the signed angle between this vector and another in radians.
     *
     * @param   v - The other vector
     * @returns     The angle in radians
     */
    public angleBetween(v: Vector2): number {
        const dot = this.dot(v);
        const det = this.cross(v);

        return Math.atan2(det, dot);
    }

    /**
     * Returns the angle from this vector to another in radians.
     *
     * @param   v - The other vector
     * @returns     The angle in radians
     */
    public angleTo(v: Vector2): number {
        return Math.atan2(v.y - this.y, v.x - this.x);
    }

    /**
     * Returns the angle of this vector in radians from the positive x-axis.
     *
     * @returns The angle in radians
     */
    public toAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the dot product of this vector and another.
     *
     * @param   v - The other vector
     * @returns     The dot product
     */
    public dot(v: Vector2): number {
        return (this.x * v.x) + (this.y * v.y);
    }

    /**
     * Returns the 2D cross product (scalar) of this vector and another.
     *
     * @param   v - The other vector
     * @returns     The cross product
     */
    public cross(v: Vector2): number {
        return (this.x * v.y) - (this.y * v.x);
    }

    /**
     * Returns a clone of this vector.
     *
     * @returns The cloned vector
     */
    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    /**
     * Checks if this vector is exactly equal to another.
     *
     * @param   v - The other vector
     * @returns     True if equal, false otherwise
     */
    public equalTo(v: Vector2): boolean {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * Reflects this vector across a normal.
     *
     * @param   n - The normal vector (should be normalized)
     * @returns     The reflected vector
     */
    public reflect(n: Vector2): Vector2 {
        if (!n.isNormalized()) {
            console.warn(`[Vector2.reflect]: 'n' is not normalized.`);
        }

        const dot2 = 2 * this.dot(n);

        return new Vector2(
            this.x - dot2 * n.x,
            this.y - dot2 * n.y,
        );
    }

    /**
     * Projects this vector onto a normal.
     *
     * @param   n - The normal vector (should be normalized)
     * @returns     The projected vector
     */
    public project(n: Vector2): Vector2 {
        if (!n.isNormalized()) {
            console.warn(`[Vector2.project]: 'n' is not normalized.`);
        }

        const dot = this.dot(n);

        return new Vector2(dot * n.x, dot * n.y);
    }

    /**
     * Checks if this vector is normalized (unit length) within a given epsilon.
     *
     * @param   epsilon - The tolerance (default 1e-6)
     * @returns           True if normalized, false otherwise
     */
    public isNormalized(epsilon = 1e-6): boolean {
        const mag = this.magnitude();

        return Math.abs(mag - 1) <= epsilon;
    }
}

export default Vector2;
