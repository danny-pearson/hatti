export const toBinaryString = (value: number, bits: number = 8): string => {
    return value.toString(2).padStart(bits, '0');
};

export const toHexString = (value: number, length: number = 6): string => {
    return value.toString(16).padStart(length, '0');
};
