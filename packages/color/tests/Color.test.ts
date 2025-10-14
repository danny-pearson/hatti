import {
    describe, it, expect, vi,
} from 'vitest';

import {
    rgb,
    rgba,
    normalizeRgb,
    normalizeRgba,
    denormalizeRgb,
    denormalizeRgba,
    rgbToHex,
    rgbaToHex,
    uint32ToRgba,
    uint32ToNormalizedRgba,
    uint32ToHex,
    hexToRgb,
    hexToRgba,
    hexToNormalizedRgba,
    hexToUint32,
    expand12to24,
} from '../dist/Color.js';

describe('Color', () => {
    describe('rgb/rgba', () => {
        it('rgb packs RGB components correctly', () => {
            expect(rgb(255, 0, 0)).toBe(0xff0000);
            expect(rgb(0, 255, 0)).toBe(0x00ff00);
            expect(rgb(0, 0, 255)).toBe(0x0000ff);
        });

        it('rgba packs RGBA components correctly', () => {
            expect(rgba(255, 0, 0, 255)).toBe(0xff0000ff);
            expect(rgba(0, 255, 0, 128)).toBe(0x00ff0080);
        });
    });

    describe('normalize/denormalize', () => {
        it('normalizeRgb normalizes to 0–1 range', () => {
            expect(normalizeRgb(255, 128, 0)).toEqual([1, 128 / 255, 0]);
        });

        it('normalizeRgba normalizes RGBA to 0–1 range', () => {
            expect(normalizeRgba(255, 128, 0, 64)).toEqual([1, 128 / 255, 0, 64 / 255]);
        });

        it('denormalizeRgb converts normalized values back to 0–255', () => {
            expect(denormalizeRgb(1, 0.5, 0)).toEqual([255, 128, 0]);
        });

        it('denormalizeRgba converts normalized RGBA back to 0–255', () => {
            expect(denormalizeRgba(1, 0.5, 0, 0.25)).toEqual([255, 128, 0, 64]);
        });
    });

    describe('rgbToHex/rgbaToHex', () => {
        it('rgbToHex returns correct hex string', () => {
            expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
        });

        it('rgbaToHex returns correct hex string', () => {
            expect(rgbaToHex(255, 0, 0, 255)).toBe('#ff0000ff');
        });
    });

    describe('uint32ToRgba/uint32ToNormalizedRgba', () => {
        it('uint32ToRgba converts uint32 to tuple', () => {
            expect(uint32ToRgba(0xff00ff80)).toEqual([255, 0, 255, 128]);
        });

        it('uint32ToRgba warns if value exceeds 32 bits', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => { });

            uint32ToRgba(0xffffffff + 1);

            expect(warn).toHaveBeenCalledWith('[uint32ToRgba]: Value is greater than 32 bits');

            warn.mockRestore();
        });

        it('uint32ToNormalizedRgba converts and normalizes correctly', () => {
            expect(uint32ToNormalizedRgba(0xff00ff80)).toEqual([
                255 / 255,
                0,
                255 / 255,
                128 / 255,
            ]);
        });
    });

    describe('uint32ToHex', () => {
        it('returns hex string', () => {
            expect(uint32ToHex(0xff00ff)).toBe('#ff00ff');
        });
    });

    describe('hexToUint32', () => {
        it('parses #rgb shorthand correctly', () => {
            expect(hexToUint32('#abc')).toBe(((0xaabbcc << 8) + 0xff) >>> 0);
        });

        it('parses #rrggbb correctly', () => {
            expect(hexToUint32('#112233')).toBe(((0x112233 << 8) + 0xff) >>> 0);
        });

        it('parses #rrggbbaa correctly', () => {
            expect(hexToUint32('#11223344')).toBe(0x11223344);
        });

        it('throws if missing #', () => {
            expect(() => hexToUint32('123')).toThrowError();
        });

        it('throws for invalid length', () => {
            expect(() => hexToUint32('#12345')).toThrowError();
        });
    });

    describe('hexToRgb/hexToRgba/hexToNormalizedRgba', () => {
        it('hexToRgb converts #rrggbb to tuple', () => {
            expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
        });

        it('hexToRgba converts correctly', () => {
            expect(hexToRgba('#ff0000ff')).toEqual([255, 0, 0, 255]);
        });

        it('hexToNormalizedRgba converts correctly', () => {
            expect(hexToNormalizedRgba('#ff000080')).toEqual([1, 0, 0, 128 / 255]);
        });
    });

    describe('expand12to24', () => {
        it('expands 12-bit to 24-bit RGB', () => {
            expect(expand12to24(0xabc)).toBe(0xaabbcc);
        });

        it('warns if > 12 bits', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            expand12to24(0x1fff);

            expect(warn).toHaveBeenCalledWith('[expand12to24]: Value must be no more than 12bits');

            warn.mockRestore();
        });
    });
});