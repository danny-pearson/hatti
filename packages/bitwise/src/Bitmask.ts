export const hasAny = (value: number, mask: number): boolean => {
    return (value & mask) !== 0;
};

export const hasAll = (value: number, mask: number): boolean => {
    return (value & mask) === mask;
};

export const set = (value: number, mask: number): number => {
    return value | mask;
};

export const clear = (value: number, mask: number): number => {
    return value & ~mask;
};

export const toggle = (value: number, mask: number): number => {
    return value ^ mask;
};