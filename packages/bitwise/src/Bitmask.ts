/**
 * Checks if any bits in the mask are set in the value.
 *
 * @param   value - The value to check
 * @param   mask  - The bitmask to test against
 * @returns         True if at least one bit from the mask is set in the value
 */
export const hasAny = (value: number, mask: number): boolean => {
    return (value & mask) !== 0;
};

/**
 * Checks if all bits in the mask are set in the value.
 *
 * @param   value - The value to check
 * @param   mask  - The bitmask to test against
 * @returns         True if all bits from the mask are set in the value
 */
export const hasAll = (value: number, mask: number): boolean => {
    return (value & mask) === mask;
};

/**
 * Sets the specified bits in the value.
 *
 * @param   value - The original value
 * @param   mask  - The bitmask indicating which bits to set
 * @returns         The value with the masked bits set to 1
 */
export const set = (value: number, mask: number): number => {
    return value | mask;
};

/**
 * Clears the specified bits in the value.
 *
 * @param   value - The original value
 * @param   mask  - The bitmask indicating which bits to clear
 * @returns         The value with the masked bits set to 0
 */
export const clear = (value: number, mask: number): number => {
    return value & ~mask;
};

/**
 * Toggles the specified bits in the value.
 *
 * @param   value - The original value
 * @param   mask  - The bitmask indicating which bits to toggle
 * @returns         The value with the masked bits flipped
 */
export const toggle = (value: number, mask: number): number => {
    return value ^ mask;
};