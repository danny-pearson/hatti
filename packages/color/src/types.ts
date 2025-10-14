export type RGB = {
    r: number;
    g: number;
    b: number;
};

export type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type TupleRGB = [r: number, g: number, b: number];
export type TupleRGBA = [r: number, g: number, b: number, a: number];

export type RGBLike = number | RGB | TupleRGB;
export type RGBALike = number | RGBA | TupleRGBA;