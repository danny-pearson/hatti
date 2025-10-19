/**
 * Checks if a value is an array.
 */
export const { isArray } = Array;

/**
 * Checks if two values are the same value (using Object.is equality).
 */
export const { is: isEqual } = Object;

/**
 * Type guards and utilities for checking numeric properties.
 */
export const {
    isFinite,
    isInteger,
    isNaN,
    isSafeInteger,
} = Number;

/**
 * Asserts that a condition is true, warns if false.
 *
 * @param condition - The condition to assert
 * @param message   - The warning message to display if condition is false
 */
export const assert = (condition: boolean, message: string): asserts condition => {
    if (condition) return;

    // if (import.meta.dev) {
    //     throw new Error(message);
    // }

    console.warn(message);
};

/**
 * Asserts that a value is defined (not null or undefined), throws if not.
 *
 * @param value   - The value to check
 * @param message - The error message to throw if value is not defined
 */
export const assertDef = <Type>(value: Type, message: string): asserts value is NonNullable<Type> => {
    if (value !== undefined && value !== null) return;

    throw new Error(message);
};

/**
 * Checks if a value is undefined or null.
 *
 * @param   value - The value to check
 * @returns         True if the value is undefined or null
 */
export const isUndef = (value: unknown): value is undefined | null => {
    return value === undefined || value === null;
};

/**
 * Checks if a value is defined (not undefined or null).
 *
 * @param   value - The value to check
 * @returns         True if the value is not undefined or null
 */
export const isDef = (value: unknown): value is NonNullable<unknown> => {
    return value !== undefined && value !== null;
};

/**
 * Checks if a value is strictly true.
 *
 * @param   value - The value to check
 * @returns         True if the value is the boolean true
 */
export const isTrue = (value: unknown): value is true => {
    return value === true;
};

/**
 * Checks if a value is strictly false.
 *
 * @param   value - The value to check
 * @returns         True if the value is the boolean false
 */
export const isFalse = (value: unknown): value is false => {
    return value === false;
};

/**
 * Checks if a value is a string.
 *
 * @param   value - The value to check
 * @returns         True if the value is a string
 */
export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

/**
 * Checks if a value is a number (including NaN and Infinity).
 *
 * @param   value - The value to check
 * @returns         True if the value is a number
 */
export const isNumber = (value: unknown): value is number => {
    return typeof value === 'number';
};

/**
 * Checks if a value is a boolean.
 *
 * @param   value - The value to check
 * @returns         True if the value is a boolean
 */
export const isBool = (value: unknown): value is boolean => {
    return typeof value === 'boolean';
};

/**
 * Checks if a value is a function.
 *
 * @param   value - The value to check
 * @returns         True if the value is a function
 */
export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => {
    return typeof value === 'function';
};

/**
 * Checks if a value is a symbol.
 *
 * @param   value - The value to check
 * @returns         True if the value is a symbol
 */
export const isSymbol = (value: unknown): value is symbol => {
    return typeof value === 'symbol';
};

/**
 * Checks if a value is a bigint.
 *
 * @param   value - The value to check
 * @returns         True if the value is a bigint
 */
export const isBigInt = (value: unknown): value is bigint => {
    return typeof value === 'bigint';
};

/**
 * Checks if a value is a finite, non-NaN number.
 *
 * @param   value - The value to check
 * @returns         True if the value is a valid numeric value
 */
export const isNumeric = (value: unknown): value is number => {
    return isNumber(value)
        && isFinite(value)
        && !isNaN(value);
};

/**
 * Checks if a value is exactly zero.
 *
 * @param   value - The value to check
 * @returns         True if the value is 0
 */
export const isZero = (value: unknown): value is 0 => {
    return value === 0;
};

/**
 * Checks if a value is an object (excludes arrays, null, and primitives).
 *
 * @param   value - The value to check
 * @returns         True if the value is an object
 */
export const isObject = (value: unknown): value is object => {
    return isDef(value) && typeof value === 'object' && !isArray(value);
};

/**
 * Checks if a value is a plain object (not an instance of a class or built-in type).
 *
 * @param   value - The value to check
 * @returns         True if the value is a plain object
 */
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (!isObject(value)) return false;

    const proto = Object.getPrototypeOf(value);

    return proto === null || proto === Object.prototype;
};

/**
 * Checks if a value is an empty string.
 *
 * @param   value - The value to check
 * @returns         True if the value is an empty string
 */
export const isEmptyString = (value: unknown): value is '' => {
    return value === '';
};

/**
 * Checks if a value is an empty object (no own enumerable properties).
 *
 * @param   value - The value to check
 * @returns         True if the value is an object with no keys
 */
export const isEmptyObject = (value: unknown): value is Record<string, never> => {
    return isObject(value) && !Object.keys(value).length;
};

/**
 * Checks if a value is an empty array.
 *
 * @param   value - The value to check
 * @returns         True if the value is an array with length 0
 */
export const isEmptyArray = (value: unknown): value is never[] => {
    return isArray(value) && isZero(value.length);
};

/**
 * Checks if a value is empty (undefined, null, empty string, NaN, empty array, or empty plain object).
 *
 * @param   value - The value to check
 * @returns         True if the value is considered empty
 */
export const isEmpty = (value: unknown): boolean => {
    return (
        isUndef(value)
            || isEmptyString(value)
            || (isNumber(value) && isNaN(value))
            || isEmptyArray(value)
            || (isPlainObject(value) && !Object.keys(value).length)
    );
};
