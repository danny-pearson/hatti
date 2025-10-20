export type Vector2Like = [x: number, y: number];

export type Matrix3Like = [
    m00: number, m01: number, m02: number,
    m10: number, m11: number, m12: number,
    m20: number, m21: number, m22: number,
];

export type Matrix4Like = [
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number,
];

export type RectFields = {
    x:      number;
    y:      number;
    width:  number;
    height: number;
};

export type RectLike = [x: number, y: number, w: number, h: number];
