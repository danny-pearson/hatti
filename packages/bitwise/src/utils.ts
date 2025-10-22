/**
 * Converts a number to a binary string representation.
 *
 * Floating point values are truncated to integers. Negative numbers are
 * converted using unsigned 32-bit two's complement representation.
 *
 * @param   value - The number to convert
 * @param   bits  - Minimum number of bits to display (pads with leading zeros)
 * @returns         Binary string representation
 */
export const toBinaryString = (value: number, bits: number = 8): string => {
    return (value >>> 0).toString(2).padStart(bits, '0');
};

/**
 * Converts a number to a hexadecimal string representation.
 *
 * Floating point values are truncated to integers. Negative numbers are
 * converted using unsigned 32-bit two's complement representation.
 *
 * @param   value  - The number to convert
 * @param   length - Minimum number of hex characters to display (pads with leading zeros)
 * @returns          Hexadecimal string representation (lowercase)
 */
export const toHexString = (value: number, length: number = 6): string => {
    return (value >>> 0).toString(16).padStart(length, '0');
};
