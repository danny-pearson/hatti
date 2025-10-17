import { DEGREES_PER_RADIAN, RADIANS_PER_DEGREE } from './constants.js';

/**
 * Calculates the cosine of an angle specified in degrees.
 *
 * @param   value - The angle in degrees
 * @returns         The cosine of the angle
 */
export const cosDeg = (value: number): number => {
    return Math.cos(value * RADIANS_PER_DEGREE);
};

/**
 * Calculates the arccosine (inverse cosine) of a value, returning the angle in degrees.
 *
 * @param   value - A number between -1 and 1
 * @returns         The angle in degrees (0 to 180)
 */
export const acosDeg = (value: number): number => {
    return Math.acos(value) * DEGREES_PER_RADIAN;
};

/**
 * Calculates the sine of an angle specified in degrees.
 *
 * @param   value - The angle in degrees
 * @returns         The sine of the angle
 */
export const sinDeg = (value: number): number => {
    return Math.sin(value * RADIANS_PER_DEGREE);
};

/**
 * Calculates the arcsine (inverse sine) of a value, returning the angle in degrees.
 *
 * @param   value - A number between -1 and 1
 * @returns         The angle in degrees (-90 to 90)
 */
export const asinDeg = (value: number): number => {
    return Math.asin(value) * DEGREES_PER_RADIAN;
};

/**
 * Calculates the tangent of an angle specified in degrees.
 *
 * @param   value - The angle in degrees
 * @returns         The tangent of the angle
 */
export const tanDeg = (value: number): number => {
    return Math.tan(value * RADIANS_PER_DEGREE);
};

/**
 * Calculates the arctangent (inverse tangent) of a value, returning the angle in degrees.
 *
 * @param   value - A number
 * @returns         The angle in degrees (-90 to 90)
 */
export const atanDeg = (value: number): number => {
    return Math.atan(value) * DEGREES_PER_RADIAN;
};

/**
 * Calculates the angle in degrees from the positive x-axis to the point (x, y).
 *
 * @param   y - The y-coordinate
 * @param   x - The x-coordinate
 * @returns     The angle in degrees (-180 to 180)
 */
export const atan2Deg = (y: number, x: number): number => {
    return Math.atan2(y, x) * DEGREES_PER_RADIAN;
};

/**
 * Converts degrees to radians.
 *
 * @param   degrees - The angle in degrees
 * @returns           The angle in radians
 */
export const toRadians = (degrees: number): number => {
    return degrees * RADIANS_PER_DEGREE;
};

/**
 * Converts radians to degrees.
 *
 * @param   radians - The angle in radians
 * @returns           The angle in degrees
 */
export const toDegrees = (radians: number): number => {
    return radians * DEGREES_PER_RADIAN;
};

/**
 * Normalizes an angle to the range [0, 2π).
 *
 * @param   angle - The angle in radians
 * @returns         The normalized angle in radians (0 to 2π)
 */
export const normalizeAngle = (angle: number): number => {
    const TAU = Math.PI * 2;
    const normalized = angle % TAU;
    return normalized < 0 ? normalized + TAU : normalized;
};

/**
 * Normalizes an angle to the range [0, 360).
 *
 * @param   angle - The angle in degrees
 * @returns         The normalized angle in degrees (0 to 360)
 */
export const normalizeAngleDeg = (angle: number): number => {
    const normalized = angle % 360;
    return normalized < 0 ? normalized + 360 : normalized;
};

/**
 * Normalizes an angle to the range [-π, π].
 *
 * @param   angle - The angle in radians
 * @returns         The normalized angle in radians (-π to π)
 */
export const normalizeAngleSigned = (angle: number): number => {
    const normalized = normalizeAngle(angle);
    return normalized > Math.PI ? normalized - Math.PI * 2 : normalized;
};

/**
 * Normalizes an angle to the range [-180, 180].
 *
 * @param   angle - The angle in degrees
 * @returns         The normalized angle in degrees (-180 to 180)
 */
export const normalizeAngleSignedDeg = (angle: number): number => {
    const normalized = normalizeAngleDeg(angle);
    return normalized > 180 ? normalized - 360 : normalized;
};

/**
 * Calculates the shortest angular distance from one angle to another.
 *
 * @param   from - The starting angle in radians
 * @param   to   - The target angle in radians
 * @returns        The shortest angular distance in radians (-π to π)
 */
export const angleDelta = (from: number, to: number): number => {
    return normalizeAngleSigned(to - from);
};

/**
 * Calculates the shortest angular distance from one angle to another.
 *
 * @param   from - The starting angle in degrees
 * @param   to   - The target angle in degrees
 * @returns        The shortest angular distance in degrees (-180 to 180)
 */
export const angleDeltaDeg = (from: number, to: number): number => {
    return normalizeAngleSignedDeg(to - from);
};

/**
 * Linearly interpolates between two angles, taking the shortest path.
 *
 * @param   from - The starting angle in radians
 * @param   to   - The target angle in radians
 * @param   t    - Interpolation factor (0-1)
 * @returns        The interpolated angle in radians
 */
export const lerpAngle = (from: number, to: number, t: number): number => {
    return from + angleDelta(from, to) * t;
};

/**
 * Linearly interpolates between two angles, taking the shortest path.
 *
 * @param   from - The starting angle in degrees
 * @param   to   - The target angle in degrees
 * @param   t    - Interpolation factor (0-1)
 * @returns        The interpolated angle in degrees
 */
export const lerpAngleDeg = (from: number, to: number, t: number): number => {
    return from + angleDeltaDeg(from, to) * t;
};

/**
 * Calculates both sine and cosine of an angle in a single call (more efficient).
 *
 * @param   angle - The angle in radians
 * @returns         A tuple [sin, cos] of the angle
 */
export const sinCos = (angle: number): [number, number] => {
    return [Math.sin(angle), Math.cos(angle)];
};

/**
 * Calculates both sine and cosine of an angle in a single call (more efficient).
 *
 * @param   angle - The angle in degrees
 * @returns         A tuple [sin, cos] of the angle
 */
export const sinCosDeg = (angle: number): [number, number] => {
    const radians = angle * RADIANS_PER_DEGREE;
    return [Math.sin(radians), Math.cos(radians)];
};

/**
 * Checks if an angle is within a specified range (accounting for wraparound).
 *
 * @param   angle - The angle to check in radians
 * @param   min   - The minimum angle in radians
 * @param   max   - The maximum angle in radians
 * @returns         True if the angle is within the range
 */
export const isAngleBetween = (angle: number, min: number, max: number): boolean => {
    const normalizedAngle = normalizeAngle(angle);
    const normalizedMin   = normalizeAngle(min);
    const normalizedMax   = normalizeAngle(max);

    if (normalizedMin <= normalizedMax) {
        return normalizedAngle >= normalizedMin && normalizedAngle <= normalizedMax;
    }

    return normalizedAngle >= normalizedMin || normalizedAngle <= normalizedMax;
};

/**
 * Checks if an angle is within a specified range (accounting for wraparound).
 *
 * @param   angle - The angle to check in degrees
 * @param   min   - The minimum angle in degrees
 * @param   max   - The maximum angle in degrees
 * @returns         True if the angle is within the range
 */
export const isAngleBetweenDeg = (angle: number, min: number, max: number): boolean => {
    const normalizedAngle = normalizeAngleDeg(angle);
    const normalizedMin   = normalizeAngleDeg(min);
    const normalizedMax   = normalizeAngleDeg(max);

    if (normalizedMin <= normalizedMax) {
        return normalizedAngle >= normalizedMin && normalizedAngle <= normalizedMax;
    }

    return normalizedAngle >= normalizedMin || normalizedAngle <= normalizedMax;
};

/**
 * Clamps an angle to a specified range.
 *
 * @param   angle - The angle to clamp in radians
 * @param   min   - The minimum angle in radians
 * @param   max   - The maximum angle in radians
 * @returns         The clamped angle in radians
 */
export const clampAngle = (angle: number, min: number, max: number): number => {
    const delta = angleDelta(min, angle);

    if (delta < 0) {
        return min;
    }

    if (delta > angleDelta(min, max)) {
        return max;
    }

    return angle;
};

/**
 * Clamps an angle to a specified range.
 *
 * @param   angle - The angle to clamp in degrees
 * @param   min   - The minimum angle in degrees
 * @param   max   - The maximum angle in degrees
 * @returns         The clamped angle in degrees
 */
export const clampAngleDeg = (angle: number, min: number, max: number): number => {
    const delta = angleDeltaDeg(min, angle);

    if (delta < 0) {
        return min;
    }

    if (delta > angleDeltaDeg(min, max)) {
        return max;
    }

    return angle;
};
