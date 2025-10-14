import { describe, it, expect } from 'vitest';
import {
    hasAny, hasAll, set, clear, toggle,
} from '../dist/Bitmask.js';

describe('bitmask utils', () => {
    describe('hasAny', () => {
        it('returns true if any bit from mask is set in value', () => {
            expect(hasAny(0b1010, 0b0010)).toBe(true);
            expect(hasAny(0b1111, 0b0100)).toBe(true);
        });

        it('returns false if no bits from mask are set in value', () => {
            expect(hasAny(0b1000, 0b0100)).toBe(false);
            expect(hasAny(0b0000, 0b1111)).toBe(false);
        });
    });

    describe('hasAll', () => {
        it('returns true if all bits in mask are set in value', () => {
            expect(hasAll(0b1111, 0b0110)).toBe(true);
            expect(hasAll(0b1010, 0b0010)).toBe(true);
        });

        it('returns false if not all bits in mask are set in value', () => {
            expect(hasAll(0b1010, 0b0110)).toBe(false);
            expect(hasAll(0b0100, 0b1100)).toBe(false);
        });
    });

    describe('set', () => {
        it('sets the specified bits in the value', () => {
            expect(set(0b0001, 0b0100)).toBe(0b0101);
            expect(set(0b1000, 0b0100)).toBe(0b1100);
        });

        it('does not unset bits that are already set', () => {
            expect(set(0b0101, 0b0100)).toBe(0b0101);
        });
    });

    describe('clear', () => {
        it('clears the specified bits in the value', () => {
            expect(clear(0b1111, 0b0100)).toBe(0b1011);
            expect(clear(0b1010, 0b0010)).toBe(0b1000);
        });

        it('does nothing if the bits are already clear', () => {
            expect(clear(0b0001, 0b0100)).toBe(0b0001);
        });
    });

    describe('toggle', () => {
        it('flips the specified bits in the value', () => {
            expect(toggle(0b0001, 0b0100)).toBe(0b0101);
            expect(toggle(0b0101, 0b0100)).toBe(0b0001);
        });

        it('works with multiple bits in the mask', () => {
            expect(toggle(0b1111, 0b0110)).toBe(0b1001);
        });
    });

    describe('edge cases', () => {
        it('handles zero correctly', () => {
            expect(hasAny(0, 0)).toBe(false);
            expect(hasAll(0, 0)).toBe(true);
            expect(set(0, 0)).toBe(0);
            expect(clear(0, 0)).toBe(0);
            expect(toggle(0, 0)).toBe(0);
        });

        it('handles full 32-bit masks', () => {
            const allBits = 0xffffffff;

            expect(hasAny(allBits, 0b1)).toBe(true);
            expect(hasAll(allBits, 0b1111)).toBe(true);
            expect(clear(allBits, 0xffffffff)).toBe(0);
            expect(toggle(allBits, 0xffffffff)).toBe(0);
        });
    });
});