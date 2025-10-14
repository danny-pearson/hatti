import type { TupleRGB, TupleRGBA } from './types';

const _clamp8  = (value: number) => Math.min(Math.max(value | 0, 0), 0xff);
const _clamp12 = (value: number) => Math.min(Math.max(value | 0, 0), 0xfff);
const _clamp32 = (value: number) => Math.min(Math.max(Math.trunc(value), 0), 0xffffffff);

export const rgb = (r: number, g: number, b: number): number => {
    const _r = _clamp8(r);
    const _g = _clamp8(g);
    const _b = _clamp8(b);

    return (((_r & 0xff) << 16) | ((_g & 0xff) << 8) | (_b & 0xff)) >>> 0;
};

export const rgba = (r: number, g: number, b: number, a: number): number => {
    const _r = _clamp8(r);
    const _g = _clamp8(g);
    const _b = _clamp8(b);
    const _a = _clamp8(a);

    return (((_r & 0xff) << 24) | ((_g & 0xff) << 16) | ((_b & 0xff) << 8) | (_a & 0xff)) >>> 0;
};

export const normalizeRgb = (r: number, g: number, b: number): TupleRGB => [
    _clamp8(r) / 0xff,
    _clamp8(g) / 0xff,
    _clamp8(b) / 0xff,
];

export const normalizeRgba = (r: number, g: number, b: number, a: number): TupleRGBA => [
    _clamp8(r) / 0xff,
    _clamp8(g) / 0xff,
    _clamp8(b) / 0xff,
    _clamp8(a) / 0xff,
];

export const denormalizeRgb = (r: number, g: number, b: number): TupleRGB => [
    _clamp8(Math.round(r * 0xff)),
    _clamp8(Math.round(g * 0xff)),
    _clamp8(Math.round(b * 0xff)),
];

export const denormalizeRgba = (r: number, g: number, b: number, a: number): TupleRGBA => [
    _clamp8(Math.round(r * 0xff)),
    _clamp8(Math.round(g * 0xff)),
    _clamp8(Math.round(b * 0xff)),
    _clamp8(Math.round(a * 0xff)),
];

export const rgbToHex = (r: number, g: number, b: number) => {
    return `#${rgb(r, g, b).toString(16).padStart(6, '0')}`;
};

export const rgbaToHex = (r: number, g: number, b: number, a: number) => {
    return `#${rgba(r, g, b, a).toString(16).padStart(8, '0')}`;
};

export const uint32ToRgba = (value: number): TupleRGBA => {
    if (value >= 0xffffffff) {
        console.warn('[uint32ToRgba]: Value is greater than 32 bits');
    }

    const _value = _clamp32(value);

    console.log(value, _value);

    return [
        (_value & 0xff000000) >>> 24,
        (_value & 0x00ff0000) >>> 16,
        (_value & 0x0000ff00) >>> 8,
        (_value & 0x000000ff),
    ];
};

export const uint32ToNormalizedRgba = (value: number): TupleRGBA => {
    if (value >= 2 ** 32) {
        console.warn('[uint32ToNormalizedRgba]: Value is greater than 32 bits');
    }

    const _value = _clamp32(value);

    return [
        ((_value & 0xff000000) >>> 24) / 0xff,
        ((_value & 0x00ff0000) >>> 16) / 0xff,
        ((_value & 0x0000ff00) >>> 8) / 0xff,
        (_value & 0x000000ff) / 0xff,
    ];
};

export const uint32ToHex = (value: number): string => {
    return `#${value.toString(16)}`;
};

export const hexToRgb = (value: string): TupleRGB => {
    const u24 = hexToUint32(value) >>> 8;

    return [
        (u24 & 0x00ff0000) >>> 16,
        (u24 & 0x0000ff00) >>> 8,
        (u24 & 0x000000ff),
    ];
};

export const hexToRgba = (value: string): TupleRGBA => {
    return uint32ToRgba(hexToUint32(value));
};

export const hexToNormalizedRgba = (value: string): TupleRGBA => {
    return uint32ToNormalizedRgba(hexToUint32(value));
};

export const hexToUint32 = (hex: string): number => {
    if (!hex.startsWith('#')) {
        throw new Error(`[hexToUint32]: Valid hex string must start with a '#'`);
    }

    const _hex  = hex.slice(1);
    const value = parseInt(_hex, 16);

    switch (_hex.length) {
        case 3: return ((expand12to24(value) << 8) + 0xff) >>> 0;
        case 6: return ((value << 8) + 0xff) >>> 0;
        case 8: return value;

        default: throw new Error(`[hexToUint32]: Invalid hex string length`);
    }
};

export const expand12to24 = (value: number): number => {
    if (value > 0xfff) {
        console.warn(`[expand12to24]: Value must be no more than 12bits`);
    }

    const _value = _clamp12(value);

    let r = (_value >> 8) & 0xf;
    let g = (_value >> 4) & 0xf;
    let b = (_value) & 0xf;

    r = (r << 4) | r;
    g = (g << 4) | g;
    b = (b << 4) | b;

    return (r << 16) | (g << 8) | b;
};
