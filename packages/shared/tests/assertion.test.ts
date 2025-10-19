import { describe, expect, it, vi } from 'vitest';
import {
    assert,
    assertDef,
    isArray,
    isBigInt,
    isBool,
    isDef,
    isEmpty,
    isEmptyArray,
    isEmptyObject,
    isEmptyString,
    isEqual,
    isFalse,
    isFinite,
    isFunction,
    isInteger,
    isNaN,
    isNumber,
    isNumeric,
    isObject,
    isPlainObject,
    isSafeInteger,
    isString,
    isSymbol,
    isTrue,
    isUndef,
    isZero,
} from '../dist/index.js';

describe('isArray', () => {
    it('should return true for arrays', () => {
        expect(isArray([])).toBe(true);
        expect(isArray([1, 2, 3])).toBe(true);
        expect(isArray(new Array(5))).toBe(true);
    });

    it('should return false for non-arrays', () => {
        expect(isArray({})).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray(undefined)).toBe(false);
        expect(isArray('array')).toBe(false);
        expect(isArray(123)).toBe(false);
    });
});

describe('isEqual', () => {
    it('should return true for equal primitives', () => {
        expect(isEqual(42, 42)).toBe(true);
        expect(isEqual('test', 'test')).toBe(true);
        expect(isEqual(true, true)).toBe(true);
        expect(isEqual(null, null)).toBe(true);
        expect(isEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for +0 and -0 (Object.is distinguishes them)', () => {
        expect(isEqual(+0, -0)).toBe(false);
    });

    it('should return true for same object reference', () => {
        const obj = { a: 1 };
        expect(isEqual(obj, obj)).toBe(true);
    });

    it('should return false for different values', () => {
        expect(isEqual(42, 43)).toBe(false);
        expect(isEqual('test', 'Test')).toBe(false);
        expect(isEqual(true, false)).toBe(false);
    });

    it('should return false for NaN comparison (Object.is behavior)', () => {
        expect(isEqual(NaN, NaN)).toBe(true); // Object.is treats NaN as equal
    });

    it('should return false for different object references', () => {
        expect(isEqual({ a: 1 }, { a: 1 })).toBe(false);
        expect(isEqual([1, 2], [1, 2])).toBe(false);
    });
});

describe('isFinite', () => {
    it('should return true for finite numbers', () => {
        expect(isFinite(0)).toBe(true);
        expect(isFinite(42)).toBe(true);
        expect(isFinite(-100)).toBe(true);
        expect(isFinite(3.14159)).toBe(true);
        expect(isFinite(Number.MIN_VALUE)).toBe(true);
        expect(isFinite(Number.MAX_VALUE)).toBe(true);
    });

    it('should return false for infinite values', () => {
        expect(isFinite(Infinity)).toBe(false);
        expect(isFinite(-Infinity)).toBe(false);
    });

    it('should return false for NaN', () => {
        expect(isFinite(NaN)).toBe(false);
    });
});

describe('isNaN', () => {
    it('should return true for NaN', () => {
        expect(isNaN(NaN)).toBe(true);
        expect(isNaN(0 / 0)).toBe(true);
    });

    it('should return false for numbers', () => {
        expect(isNaN(0)).toBe(false);
        expect(isNaN(42)).toBe(false);
        expect(isNaN(Infinity)).toBe(false);
        expect(isNaN(-Infinity)).toBe(false);
    });
});

describe('assert', () => {
    it('should not throw or warn when condition is true', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        assert(true, 'Should not warn');

        expect(warnSpy).not.toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('should warn when condition is false', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        assert(false, 'Test warning message');

        expect(warnSpy).toHaveBeenCalledWith('Test warning message');
        warnSpy.mockRestore();
    });

    it('should handle edge case with truthy values', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        assert(1 === 1, 'Should not warn');
        assert('string' === 'string', 'Should not warn');

        expect(warnSpy).not.toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});

describe('assertDef', () => {
    it('should not throw for defined values', () => {
        expect(() => assertDef(0, 'Should not throw')).not.toThrow();
        expect(() => assertDef('', 'Should not throw')).not.toThrow();
        expect(() => assertDef(false, 'Should not throw')).not.toThrow();
        expect(() => assertDef([], 'Should not throw')).not.toThrow();
        expect(() => assertDef({}, 'Should not throw')).not.toThrow();
    });

    it('should throw for undefined', () => {
        expect(() => assertDef(undefined, 'Value is undefined')).toThrow('Value is undefined');
    });

    it('should throw for null', () => {
        expect(() => assertDef(null, 'Value is null')).toThrow('Value is null');
    });
});

describe('isUndef', () => {
    it('should return true for undefined', () => {
        expect(isUndef(undefined)).toBe(true);
    });

    it('should return true for null', () => {
        expect(isUndef(null)).toBe(true);
    });

    it('should return false for defined values', () => {
        expect(isUndef(0)).toBe(false);
        expect(isUndef('')).toBe(false);
        expect(isUndef(false)).toBe(false);
        expect(isUndef([])).toBe(false);
        expect(isUndef({})).toBe(false);
        expect(isUndef(NaN)).toBe(false);
    });
});

describe('isDef', () => {
    it('should return true for defined values', () => {
        expect(isDef(0)).toBe(true);
        expect(isDef('')).toBe(true);
        expect(isDef(false)).toBe(true);
        expect(isDef([])).toBe(true);
        expect(isDef({})).toBe(true);
        expect(isDef(NaN)).toBe(true);
        expect(isDef('string')).toBe(true);
        expect(isDef(42)).toBe(true);
    });

    it('should return false for undefined', () => {
        expect(isDef(undefined)).toBe(false);
    });

    it('should return false for null', () => {
        expect(isDef(null)).toBe(false);
    });
});

describe('isTrue', () => {
    it('should return true only for boolean true', () => {
        expect(isTrue(true)).toBe(true);
    });

    it('should return false for truthy values that are not true', () => {
        expect(isTrue(1)).toBe(false);
        expect(isTrue('true')).toBe(false);
        expect(isTrue({})).toBe(false);
        expect(isTrue([])).toBe(false);
    });

    it('should return false for false and falsy values', () => {
        expect(isTrue(false)).toBe(false);
        expect(isTrue(0)).toBe(false);
        expect(isTrue('')).toBe(false);
        expect(isTrue(null)).toBe(false);
        expect(isTrue(undefined)).toBe(false);
    });
});

describe('isFalse', () => {
    it('should return true only for boolean false', () => {
        expect(isFalse(false)).toBe(true);
    });

    it('should return false for falsy values that are not false', () => {
        expect(isFalse(0)).toBe(false);
        expect(isFalse('')).toBe(false);
        expect(isFalse(null)).toBe(false);
        expect(isFalse(undefined)).toBe(false);
    });

    it('should return false for true and truthy values', () => {
        expect(isFalse(true)).toBe(false);
        expect(isFalse(1)).toBe(false);
        expect(isFalse('false')).toBe(false);
        expect(isFalse({})).toBe(false);
        expect(isFalse([])).toBe(false);
    });
});

describe('isString', () => {
    it('should return true for strings', () => {
        expect(isString('')).toBe(true);
        expect(isString('hello')).toBe(true);
        expect(isString('123')).toBe(true);
        expect(isString(String('test'))).toBe(true);
    });

    it('should return false for non-strings', () => {
        expect(isString(123)).toBe(false);
        expect(isString(true)).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString({})).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
    });

    it('should return false for String objects', () => {
        // eslint-disable-next-line no-new-wrappers
        expect(isString(new String('test'))).toBe(false);
    });
});

describe('isNumber', () => {
    it('should return true for numbers', () => {
        expect(isNumber(0)).toBe(true);
        expect(isNumber(42)).toBe(true);
        expect(isNumber(-100)).toBe(true);
        expect(isNumber(3.14159)).toBe(true);
        expect(isNumber(Infinity)).toBe(true);
        expect(isNumber(-Infinity)).toBe(true);
    });

    it('should return true for NaN (it is a number type)', () => {
        expect(isNumber(NaN)).toBe(true);
    });

    it('should return false for non-numbers', () => {
        expect(isNumber('123')).toBe(false);
        expect(isNumber(true)).toBe(false);
        expect(isNumber([])).toBe(false);
        expect(isNumber({})).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
    });
});

describe('isBool', () => {
    it('should return true for booleans', () => {
        expect(isBool(true)).toBe(true);
        expect(isBool(false)).toBe(true);
        expect(isBool(Boolean(1))).toBe(true);
        expect(isBool(Boolean(0))).toBe(true);
    });

    it('should return false for non-booleans', () => {
        expect(isBool(1)).toBe(false);
        expect(isBool(0)).toBe(false);
        expect(isBool('true')).toBe(false);
        expect(isBool('false')).toBe(false);
        expect(isBool([])).toBe(false);
        expect(isBool({})).toBe(false);
        expect(isBool(null)).toBe(false);
        expect(isBool(undefined)).toBe(false);
    });
});

describe('isFunction', () => {
    it('should return true for functions', () => {
        expect(isFunction(() => {})).toBe(true);
        expect(isFunction(function() {})).toBe(true);
        expect(isFunction(async () => {})).toBe(true);
        expect(isFunction(Function)).toBe(true);
        expect(isFunction(isFunction)).toBe(true);
    });

    it('should return false for non-functions', () => {
        expect(isFunction(123)).toBe(false);
        expect(isFunction('function')).toBe(false);
        expect(isFunction(true)).toBe(false);
        expect(isFunction([])).toBe(false);
        expect(isFunction({})).toBe(false);
        expect(isFunction(null)).toBe(false);
        expect(isFunction(undefined)).toBe(false);
    });
});

describe('isSymbol', () => {
    it('should return true for symbols', () => {
        expect(isSymbol(Symbol())).toBe(true);
        expect(isSymbol(Symbol('test'))).toBe(true);
        expect(isSymbol(Symbol.for('test'))).toBe(true);
    });

    it('should return false for non-symbols', () => {
        expect(isSymbol('symbol')).toBe(false);
        expect(isSymbol(123)).toBe(false);
        expect(isSymbol(true)).toBe(false);
        expect(isSymbol([])).toBe(false);
        expect(isSymbol({})).toBe(false);
        expect(isSymbol(null)).toBe(false);
        expect(isSymbol(undefined)).toBe(false);
    });
});

describe('isBigInt', () => {
    it('should return true for bigints', () => {
        expect(isBigInt(0n)).toBe(true);
        expect(isBigInt(BigInt(123))).toBe(true);
        expect(isBigInt(123n)).toBe(true);
        expect(isBigInt(-456n)).toBe(true);
    });

    it('should return false for non-bigints', () => {
        expect(isBigInt(123)).toBe(false);
        expect(isBigInt('123n')).toBe(false);
        expect(isBigInt(true)).toBe(false);
        expect(isBigInt([])).toBe(false);
        expect(isBigInt({})).toBe(false);
        expect(isBigInt(null)).toBe(false);
        expect(isBigInt(undefined)).toBe(false);
    });
});

describe('isNumeric', () => {
    it('should return true for valid numeric values', () => {
        expect(isNumeric(0)).toBe(true);
        expect(isNumeric(42)).toBe(true);
        expect(isNumeric(-100)).toBe(true);
        expect(isNumeric(3.14159)).toBe(true);
        expect(isNumeric(Number.MIN_VALUE)).toBe(true);
        expect(isNumeric(Number.MAX_VALUE)).toBe(true);
    });

    it('should return false for Infinity', () => {
        expect(isNumeric(Infinity)).toBe(false);
        expect(isNumeric(-Infinity)).toBe(false);
    });

    it('should return false for NaN', () => {
        expect(isNumeric(NaN)).toBe(false);
        expect(isNumeric(0 / 0)).toBe(false);
    });

    it('should return false for non-numbers', () => {
        expect(isNumeric('123')).toBe(false);
        expect(isNumeric(true)).toBe(false);
        expect(isNumeric([])).toBe(false);
        expect(isNumeric({})).toBe(false);
        expect(isNumeric(null)).toBe(false);
        expect(isNumeric(undefined)).toBe(false);
    });
});

describe('isInteger', () => {
    it('should return true for integers', () => {
        expect(isInteger(0)).toBe(true);
        expect(isInteger(42)).toBe(true);
        expect(isInteger(-100)).toBe(true);
        expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
        expect(isInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
    });

    it('should return false for floats', () => {
        expect(isInteger(3.14)).toBe(false);
        expect(isInteger(0.1)).toBe(false);
        expect(isInteger(-2.5)).toBe(false);
    });

    it('should return false for Infinity and NaN', () => {
        expect(isInteger(Infinity)).toBe(false);
        expect(isInteger(-Infinity)).toBe(false);
        expect(isInteger(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
        expect(isInteger('42')).toBe(false);
        expect(isInteger(true)).toBe(false);
        expect(isInteger(null)).toBe(false);
        expect(isInteger(undefined)).toBe(false);
    });
});

describe('isSafeInteger', () => {
    it('should return true for safe integers', () => {
        expect(isSafeInteger(0)).toBe(true);
        expect(isSafeInteger(42)).toBe(true);
        expect(isSafeInteger(-100)).toBe(true);
        expect(isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
        expect(isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
    });

    it('should return false for unsafe integers', () => {
        expect(isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
        expect(isSafeInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false);
        expect(isSafeInteger(9007199254740992)).toBe(false);
    });

    it('should return false for floats', () => {
        expect(isSafeInteger(3.14)).toBe(false);
        expect(isSafeInteger(0.1)).toBe(false);
    });

    it('should return false for Infinity and NaN', () => {
        expect(isSafeInteger(Infinity)).toBe(false);
        expect(isSafeInteger(-Infinity)).toBe(false);
        expect(isSafeInteger(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
        expect(isSafeInteger('42')).toBe(false);
        expect(isSafeInteger(true)).toBe(false);
        expect(isSafeInteger(null)).toBe(false);
        expect(isSafeInteger(undefined)).toBe(false);
    });
});

describe('isZero', () => {
    it('should return true for zero', () => {
        expect(isZero(0)).toBe(true);
        expect(isZero(-0)).toBe(true); // -0 === 0 in JavaScript
    });

    it('should return false for non-zero numbers', () => {
        expect(isZero(1)).toBe(false);
        expect(isZero(-1)).toBe(false);
        expect(isZero(0.1)).toBe(false);
        expect(isZero(Infinity)).toBe(false);
        expect(isZero(-Infinity)).toBe(false);
        expect(isZero(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
        expect(isZero('0')).toBe(false);
        expect(isZero(false)).toBe(false);
        expect(isZero(null)).toBe(false);
        expect(isZero(undefined)).toBe(false);
    });
});

describe('isObject', () => {
    it('should return true for plain objects', () => {
        expect(isObject({})).toBe(true);
        expect(isObject({ a: 1 })).toBe(true);
        expect(isObject(Object.create(null))).toBe(true);
    });

    it('should return false for arrays', () => {
        expect(isObject([])).toBe(false);
        expect(isObject([1, 2, 3])).toBe(false);
    });

    it('should return false for null and undefined', () => {
        expect(isObject(null)).toBe(false);
        expect(isObject(undefined)).toBe(false);
    });

    it('should return false for primitives', () => {
        expect(isObject(42)).toBe(false);
        expect(isObject('string')).toBe(false);
        expect(isObject(true)).toBe(false);
    });

    it('should return true for other object types', () => {
        expect(isObject(new Date())).toBe(true);
        expect(isObject(/regex/)).toBe(true);
        expect(isObject(new Map())).toBe(true);
        expect(isObject(new Set())).toBe(true);
    });
});

describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
        expect(isPlainObject({})).toBe(true);
        expect(isPlainObject({ a: 1 })).toBe(true);
        expect(isPlainObject({ nested: { key: 'value' } })).toBe(true);
    });

    it('should return true for Object.create(null)', () => {
        expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it('should return false for arrays', () => {
        expect(isPlainObject([])).toBe(false);
        expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    it('should return false for other object types', () => {
        expect(isPlainObject(new Date())).toBe(false);
        expect(isPlainObject(/regex/)).toBe(false);
        expect(isPlainObject(new Map())).toBe(false);
        expect(isPlainObject(new Set())).toBe(false);
    });

    it('should return false for primitives', () => {
        expect(isPlainObject(42)).toBe(false);
        expect(isPlainObject('string')).toBe(false);
        expect(isPlainObject(true)).toBe(false);
        expect(isPlainObject(null)).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
    });

    it('should return false for class instances', () => {
        class TestClass {}
        expect(isPlainObject(new TestClass())).toBe(false);
    });
});

describe('isEmptyString', () => {
    it('should return true for empty string', () => {
        expect(isEmptyString('')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
        expect(isEmptyString('hello')).toBe(false);
        expect(isEmptyString(' ')).toBe(false);
        expect(isEmptyString('0')).toBe(false);
    });

    it('should return false for non-strings', () => {
        expect(isEmptyString(0)).toBe(false);
        expect(isEmptyString(false)).toBe(false);
        expect(isEmptyString(null)).toBe(false);
        expect(isEmptyString(undefined)).toBe(false);
        expect(isEmptyString([])).toBe(false);
        expect(isEmptyString({})).toBe(false);
    });
});

describe('isEmptyObject', () => {
    it('should return true for empty objects', () => {
        expect(isEmptyObject({})).toBe(true);
        expect(isEmptyObject(Object.create(null))).toBe(true);
    });

    it('should return false for non-empty objects', () => {
        expect(isEmptyObject({ a: 1 })).toBe(false);
        expect(isEmptyObject({ key: undefined })).toBe(false);
    });

    it('should return false for non-objects', () => {
        expect(isEmptyObject([])).toBe(false);
        expect(isEmptyObject('')).toBe(false);
        expect(isEmptyObject(0)).toBe(false);
        expect(isEmptyObject(null)).toBe(false);
        expect(isEmptyObject(undefined)).toBe(false);
    });

    it('should return false for objects with inherited properties only', () => {
        const proto = { inherited: 'value' };
        const obj = Object.create(proto);
        expect(isEmptyObject(obj)).toBe(true); // Object.keys doesn't include inherited properties
    });

    it('should handle objects with symbol keys', () => {
        const sym = Symbol('test');
        const obj = { [sym]: 'value' };
        expect(isEmptyObject(obj)).toBe(true); // Object.keys doesn't include symbol keys
    });
});

describe('isEmptyArray', () => {
    it('should return true for empty arrays', () => {
        expect(isEmptyArray([])).toBe(true);
    });

    it('should return false for non-empty arrays', () => {
        expect(isEmptyArray([1])).toBe(false);
        expect(isEmptyArray([1, 2, 3])).toBe(false);
        expect(isEmptyArray([undefined])).toBe(false);
    });

    it('should return false for sparse arrays with length', () => {
        const sparse = new Array(5);
        expect(isEmptyArray(sparse)).toBe(false);
    });

    it('should return false for non-arrays', () => {
        expect(isEmptyArray({})).toBe(false);
        expect(isEmptyArray('')).toBe(false);
        expect(isEmptyArray(0)).toBe(false);
        expect(isEmptyArray(null)).toBe(false);
        expect(isEmptyArray(undefined)).toBe(false);
    });
});

describe('isEmpty', () => {
    it('should return true for undefined and null', () => {
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty(null)).toBe(true);
    });

    it('should return true for empty objects', () => {
        expect(isEmpty({})).toBe(true);
    });

    it('should return true for empty arrays', () => {
        expect(isEmpty([])).toBe(true);
    });

    it('should return true for empty strings', () => {
        expect(isEmpty('')).toBe(true);
    });

    it('should return true for NaN', () => {
        expect(isEmpty(NaN)).toBe(true);
    });

    it('should return false for non-empty objects', () => {
        expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return false for non-empty arrays', () => {
        expect(isEmpty([1, 2, 3])).toBe(false);
        expect(isEmpty([undefined])).toBe(false);
    });

    it('should return false for non-empty strings', () => {
        expect(isEmpty('hello')).toBe(false);
        expect(isEmpty(' ')).toBe(false);
    });

    it('should return false for numbers (except NaN)', () => {
        expect(isEmpty(0)).toBe(false);
        expect(isEmpty(42)).toBe(false);
        expect(isEmpty(Infinity)).toBe(false);
        expect(isEmpty(-Infinity)).toBe(false);
    });

    it('should return false for booleans', () => {
        expect(isEmpty(true)).toBe(false);
        expect(isEmpty(false)).toBe(false);
    });

    it('should return false for functions', () => {
        expect(isEmpty(() => {})).toBe(false);
        expect(isEmpty(function() {})).toBe(false);
    });

    it('should return false for non-plain objects like Date, RegExp, Map, Set', () => {
        // These are not plain objects, so isEmpty returns false
        expect(isEmpty(new Date())).toBe(false);
        expect(isEmpty(/regex/)).toBe(false);
        expect(isEmpty(new Map())).toBe(false);
        expect(isEmpty(new Set())).toBe(false);
    });
});
