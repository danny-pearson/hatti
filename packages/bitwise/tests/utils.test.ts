import { describe, it, expect } from 'vitest';
import { toBinaryString, toHexString } from '../dist/utils.js';

describe('bitwise utils', () => {
    describe('toBinaryString', () => {
        it('should convert number to binary string with default 8 bits', () => {
            expect(toBinaryString(5)).toBe('00000101');
            expect(toBinaryString(255)).toBe('11111111');
            expect(toBinaryString(0)).toBe('00000000');
        });

        it('should pad with leading zeros to specified bit length', () => {
            expect(toBinaryString(1, 4)).toBe('0001');
            expect(toBinaryString(15, 8)).toBe('00001111');
            expect(toBinaryString(7, 16)).toBe('0000000000000111');
        });

        it('should handle values larger than bit length', () => {
            expect(toBinaryString(255, 4)).toBe('11111111');
            expect(toBinaryString(1024, 8)).toBe('10000000000');
        });

        it('should handle zero with various bit lengths', () => {
            expect(toBinaryString(0, 1)).toBe('0');
            expect(toBinaryString(0, 8)).toBe('00000000');
            expect(toBinaryString(0, 32)).toBe('00000000000000000000000000000000');
        });

        it('should handle powers of 2', () => {
            expect(toBinaryString(1, 8)).toBe('00000001');
            expect(toBinaryString(2, 8)).toBe('00000010');
            expect(toBinaryString(4, 8)).toBe('00000100');
            expect(toBinaryString(8, 8)).toBe('00001000');
            expect(toBinaryString(16, 8)).toBe('00010000');
            expect(toBinaryString(32, 8)).toBe('00100000');
            expect(toBinaryString(64, 8)).toBe('01000000');
            expect(toBinaryString(128, 8)).toBe('10000000');
        });

        it('should handle common bitmask values', () => {
            expect(toBinaryString(0b1010, 4)).toBe('1010');
            expect(toBinaryString(0b1111, 4)).toBe('1111');
            expect(toBinaryString(0b0011, 4)).toBe('0011');
        });

        it('should handle 32-bit values', () => {
            expect(toBinaryString(0xffffffff, 32)).toBe('11111111111111111111111111111111');
            expect(toBinaryString(0x80000000, 32)).toBe('10000000000000000000000000000000');
        });
    });

    describe('toHexString', () => {
        it('should convert number to hex string with default 6 characters', () => {
            expect(toHexString(255)).toBe('0000ff');
            expect(toHexString(0)).toBe('000000');
            expect(toHexString(16777215)).toBe('ffffff');
        });

        it('should pad with leading zeros to specified length', () => {
            expect(toHexString(15, 2)).toBe('0f');
            expect(toHexString(255, 4)).toBe('00ff');
            expect(toHexString(4095, 8)).toBe('00000fff');
        });

        it('should handle values larger than length', () => {
            expect(toHexString(255, 1)).toBe('ff');
            expect(toHexString(4095, 2)).toBe('fff');
        });

        it('should output lowercase hex', () => {
            expect(toHexString(0xabcdef, 6)).toBe('abcdef');
            expect(toHexString(0xABCDEF, 6)).toBe('abcdef');
        });

        it('should handle common color values', () => {
            expect(toHexString(0xff0000, 6)).toBe('ff0000'); // Red
            expect(toHexString(0x00ff00, 6)).toBe('00ff00'); // Green
            expect(toHexString(0x0000ff, 6)).toBe('0000ff'); // Blue
            expect(toHexString(0xffffff, 6)).toBe('ffffff'); // White
            expect(toHexString(0x000000, 6)).toBe('000000'); // Black
        });

        it('should handle powers of 16', () => {
            expect(toHexString(1, 2)).toBe('01');
            expect(toHexString(16, 2)).toBe('10');
            expect(toHexString(256, 4)).toBe('0100');
            expect(toHexString(4096, 4)).toBe('1000');
        });

        it('should handle zero with various lengths', () => {
            expect(toHexString(0, 1)).toBe('0');
            expect(toHexString(0, 2)).toBe('00');
            expect(toHexString(0, 8)).toBe('00000000');
        });

        it('should handle 32-bit values', () => {
            expect(toHexString(0xffffffff, 8)).toBe('ffffffff');
            expect(toHexString(0x12345678, 8)).toBe('12345678');
        });

        it('should handle single digit hex values', () => {
            expect(toHexString(0, 2)).toBe('00');
            expect(toHexString(1, 2)).toBe('01');
            expect(toHexString(9, 2)).toBe('09');
            expect(toHexString(10, 2)).toBe('0a');
            expect(toHexString(15, 2)).toBe('0f');
        });
    });

    describe('edge cases', () => {
        it('should handle negative numbers (unsigned 32-bit two\'s complement)', () => {
            expect(toBinaryString(-1)).toBe('11111111111111111111111111111111');
            expect(toBinaryString(-128)).toBe('11111111111111111111111110000000');
            expect(toHexString(-1)).toBe('ffffffff');
            expect(toHexString(-256)).toBe('ffffff00');
        });

        it('should handle very large numbers', () => {
            const maxSafe = Number.MAX_SAFE_INTEGER;

            expect(toBinaryString(maxSafe).length).toBeGreaterThan(0);
            expect(toHexString(maxSafe).length).toBeGreaterThan(0);
        });

        it('should truncate fractional parts', () => {
            expect(toBinaryString(5.7, 8)).toBe('00000101');
            expect(toBinaryString(255.9, 8)).toBe('11111111');
            expect(toHexString(15.3, 2)).toBe('0f');
            expect(toHexString(255.9, 2)).toBe('ff');
        });

        it('should handle maximum 32-bit unsigned value', () => {
            expect(toBinaryString(0xffffffff)).toBe('11111111111111111111111111111111');
            expect(toHexString(0xffffffff)).toBe('ffffffff');
        });

        it('should respect minimum bit/length padding', () => {
            // Small numbers with large padding
            expect(toBinaryString(1, 16)).toBe('0000000000000001');
            expect(toHexString(1, 8)).toBe('00000001');
        });
    });
});
