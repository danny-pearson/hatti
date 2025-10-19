import {
    describe, it, expect,
} from 'vitest';
import ImageBuffer from '../dist/render/ImageBuffer.js';

/**
 * Tests for the ImageBuffer class.
 */
describe('ImageBuffer', () => {
    describe('constructor', () => {
        it('should create an ImageBuffer with specified dimensions', () => {
            const buffer = new ImageBuffer(10, 20);

            expect(buffer.width).toBe(10);
            expect(buffer.height).toBe(20);
            expect(buffer.data.length).toBe(10 * 20 * 4);
        });

        it('should create an ImageBuffer from existing Uint8ClampedArray', () => {
            const data = new Uint8ClampedArray(10 * 20 * 4);
            data[0] = 255; // Set red channel
            data[1] = 128; // Set green channel
            data[2] = 64; // Set blue channel
            data[3] = 255; // Set alpha channel

            const buffer = new ImageBuffer(data, 10, 20);

            expect(buffer.width).toBe(10);
            expect(buffer.height).toBe(20);
            expect(buffer.data).toBe(data);
        });

        it('should initialize all texels to 0 (transparent black)', () => {
            const buffer = new ImageBuffer(5, 5);

            for (const texel of buffer) {
                expect(texel).toBe(0);
            }
        });
    });

    describe('at()', () => {
        it('should get color at specified coordinates', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.setTexel(3, 4, 0xFF0000FF); // Red

            const color = buffer.at(3, 4);

            expect(color).toBe(0xFF0000FF);
        });

        it('should throw RangeError for negative x coordinate', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.at(-1, 5)).toThrow(RangeError);
            expect(() => buffer.at(-1, 5)).toThrow('[ImageBuffer::at]: Coordinates (-1, 5) out of bounds');
        });

        it('should throw RangeError for negative y coordinate', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.at(5, -1)).toThrow(RangeError);
            expect(() => buffer.at(5, -1)).toThrow('[ImageBuffer::at]: Coordinates (5, -1) out of bounds');
        });

        it('should throw RangeError for x >= width', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.at(10, 5)).toThrow(RangeError);
        });

        it('should throw RangeError for y >= height', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.at(5, 10)).toThrow(RangeError);
        });

        it('should work at buffer boundaries', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.setTexel(0, 0, 0xFF0000FF);
            buffer.setTexel(9, 9, 0x00FF00FF);

            expect(buffer.at(0, 0)).toBe(0xFF0000FF);
            expect(buffer.at(9, 9)).toBe(0x00FF00FF);
        });
    });

    describe('atUnchecked()', () => {
        it('should get color at specified coordinates without bounds check', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.setTexel(3, 4, 0xFF0000FF);

            const color = buffer.atUnchecked(3, 4);

            expect(color).toBe(0xFF0000FF);
        });

        it('should not throw for out of bounds access (unsafe)', () => {
            const buffer = new ImageBuffer(10, 10);

            // This won't throw but will access memory outside bounds
            // The behavior is undefined but it shouldn't crash
            expect(() => buffer.atUnchecked(100, 100)).not.toThrow();
        });

        it('should be faster than at() for known-valid coordinates', () => {
            const buffer = new ImageBuffer(100, 100);

            // Just verify it works the same for valid coordinates
            buffer.setTexel(50, 50, 0xFF0000FF);

            expect(buffer.atUnchecked(50, 50)).toBe(buffer.at(50, 50));
        });
    });

    describe('setTexel()', () => {
        it('should set color using uint32 value', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.setTexel(5, 5, 0xFF0000FF);

            expect(buffer.at(5, 5)).toBe(0xFF0000FF);
        });

        it('should set color using hex string', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.setTexel(5, 5, '#ff0000');

            // Note: hexToUint32 should convert #ff0000 to uint32 with alpha
            expect(buffer.at(5, 5)).toBeTypeOf('number');
        });

        it('should throw RangeError for negative x coordinate', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.setTexel(-1, 5, 0xFF0000FF)).toThrow(RangeError);
            expect(() => buffer.setTexel(-1, 5, 0xFF0000FF)).toThrow(
                '[ImageBuffer::setTexel]: Coordinates (-1, 5) out of bounds',
            );
        });

        it('should throw RangeError for negative y coordinate', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.setTexel(5, -1, 0xFF0000FF)).toThrow(RangeError);
        });

        it('should throw RangeError for x >= width', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.setTexel(10, 5, 0xFF0000FF)).toThrow(RangeError);
        });

        it('should throw RangeError for y >= height', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.setTexel(5, 10, 0xFF0000FF)).toThrow(RangeError);
        });

        it('should work at buffer boundaries', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => {
                buffer.setTexel(0, 0, 0xFF0000FF);
                buffer.setTexel(9, 9, 0x00FF00FF);
            }).not.toThrow();

            expect(buffer.at(0, 0)).toBe(0xFF0000FF);
            expect(buffer.at(9, 9)).toBe(0x00FF00FF);
        });

        it('should overwrite existing color', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.setTexel(5, 5, 0xFF0000FF);
            expect(buffer.at(5, 5)).toBe(0xFF0000FF);

            buffer.setTexel(5, 5, 0x00FF00FF);
            expect(buffer.at(5, 5)).toBe(0x00FF00FF);
        });
    });

    describe('setTexelUnchecked()', () => {
        it('should set color using uint32 value without bounds check', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.setTexelUnchecked(5, 5, 0xFF0000FF);

            expect(buffer.at(5, 5)).toBe(0xFF0000FF);
        });

        it('should set color using hex string without bounds check', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.setTexelUnchecked(5, 5, '#ff0000');

            expect(buffer.at(5, 5)).toBeTypeOf('number');
        });

        it('should not throw for out of bounds access (unsafe)', () => {
            const buffer = new ImageBuffer(10, 10);

            // This won't throw but will access memory outside bounds
            // The behavior is undefined but it shouldn't crash
            expect(() => buffer.setTexelUnchecked(100, 100, 0xFF0000FF)).not.toThrow();
        });

        it('should work at buffer boundaries', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => {
                buffer.setTexelUnchecked(0, 0, 0xFF0000FF);
                buffer.setTexelUnchecked(9, 9, 0x00FF00FF);
            }).not.toThrow();

            expect(buffer.at(0, 0)).toBe(0xFF0000FF);
            expect(buffer.at(9, 9)).toBe(0x00FF00FF);
        });

        it('should overwrite existing color', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.setTexelUnchecked(5, 5, 0xFF0000FF);
            expect(buffer.at(5, 5)).toBe(0xFF0000FF);

            buffer.setTexelUnchecked(5, 5, 0x00FF00FF);
            expect(buffer.at(5, 5)).toBe(0x00FF00FF);
        });

        it('should work the same as setTexel() for valid coordinates', () => {
            const buffer = new ImageBuffer(100, 100);

            buffer.setTexelUnchecked(50, 50, 0xFF0000FF);
            buffer.setTexel(51, 50, 0xFF0000FF);

            expect(buffer.at(50, 50)).toBe(buffer.at(51, 50));
        });
    });

    describe('clear()', () => {
        it('should fill entire buffer with transparent black (0)', () => {
            const buffer = new ImageBuffer(10, 10);

            // Set some colors
            buffer.setTexel(0, 0, 0xFF0000FF);
            buffer.setTexel(5, 5, 0x00FF00FF);
            buffer.setTexel(9, 9, 0x0000FFFF);

            buffer.clear();

            // Check all texels are 0
            for (const texel of buffer) {
                expect(texel).toBe(0);
            }
        });

        it('should work on empty buffer', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.clear()).not.toThrow();

            for (const texel of buffer) {
                expect(texel).toBe(0);
            }
        });
    });

    describe('fill()', () => {
        it('should fill entire buffer with uint32 color', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.fill(0xFF0000FF);

            for (const texel of buffer) {
                expect(texel).toBe(0xFF0000FF);
            }
        });

        it('should fill entire buffer with hex string color', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.fill('#ff0000');

            // All texels should have the same value
            const firstTexel = buffer.at(0, 0);

            for (const texel of buffer) {
                expect(texel).toBe(firstTexel);
            }
        });

        it('should overwrite existing colors', () => {
            const buffer = new ImageBuffer(10, 10);

            buffer.setTexel(0, 0, 0x00FF00FF);
            buffer.setTexel(5, 5, 0x0000FFFF);

            buffer.fill(0xFF0000FF);

            for (const texel of buffer) {
                expect(texel).toBe(0xFF0000FF);
            }
        });
    });

    describe('clone()', () => {
        it('should create a deep copy of the buffer', () => {
            const original = new ImageBuffer(10, 10);
            original.setTexel(3, 4, 0xFF0000FF);
            original.setTexel(7, 8, 0x00FF00FF);

            const cloned = original.clone();

            expect(cloned.width).toBe(original.width);
            expect(cloned.height).toBe(original.height);
            expect(cloned.at(3, 4)).toBe(0xFF0000FF);
            expect(cloned.at(7, 8)).toBe(0x00FF00FF);
        });

        it('should create independent copy (mutations do not affect original)', () => {
            const original = new ImageBuffer(10, 10);
            original.fill(0xFF0000FF);

            const cloned = original.clone();
            cloned.setTexel(5, 5, 0x00FF00FF);

            expect(cloned.at(5, 5)).toBe(0x00FF00FF);
            expect(original.at(5, 5)).toBe(0xFF0000FF);
        });

        it('should clone empty buffer', () => {
            const original = new ImageBuffer(5, 5);
            const cloned = original.clone();

            expect(cloned.width).toBe(5);
            expect(cloned.height).toBe(5);

            for (const texel of cloned) {
                expect(texel).toBe(0);
            }
        });
    });

    describe('getRegion()', () => {
        it('should extract a rectangular region', () => {
            const buffer = new ImageBuffer(10, 10);

            // Create a 2x2 red square at (3, 4)
            buffer.setTexel(3, 4, 0xFF0000FF);
            buffer.setTexel(4, 4, 0xFF0000FF);
            buffer.setTexel(3, 5, 0xFF0000FF);
            buffer.setTexel(4, 5, 0xFF0000FF);

            const region = buffer.getRegion(3, 4, 2, 2);

            expect(region.width).toBe(2);
            expect(region.height).toBe(2);
            expect(region.at(0, 0)).toBe(0xFF0000FF);
            expect(region.at(1, 0)).toBe(0xFF0000FF);
            expect(region.at(0, 1)).toBe(0xFF0000FF);
            expect(region.at(1, 1)).toBe(0xFF0000FF);
        });

        it('should extract region at buffer origin', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.setTexel(0, 0, 0xFF0000FF);
            buffer.setTexel(1, 0, 0x00FF00FF);

            const region = buffer.getRegion(0, 0, 2, 1);

            expect(region.at(0, 0)).toBe(0xFF0000FF);
            expect(region.at(1, 0)).toBe(0x00FF00FF);
        });

        it('should extract 1x1 region', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.setTexel(5, 5, 0xFF0000FF);

            const region = buffer.getRegion(5, 5, 1, 1);

            expect(region.width).toBe(1);
            expect(region.height).toBe(1);
            expect(region.at(0, 0)).toBe(0xFF0000FF);
        });

        it('should create independent region (mutations do not affect original)', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.fill(0xFF0000FF);

            const region = buffer.getRegion(2, 2, 3, 3);
            region.setTexel(1, 1, 0x00FF00FF);

            expect(region.at(1, 1)).toBe(0x00FF00FF);
            expect(buffer.at(3, 3)).toBe(0xFF0000FF); // Original unchanged
        });

        it('should throw error if region extends beyond buffer bounds', () => {
            const buffer = new ImageBuffer(10, 10);

            expect(() => buffer.getRegion(8, 8, 5, 5)).toThrow(RangeError);
        });
    });

    describe('getRegionUnchecked()', () => {
        it('should extract a rectangular region without bounds check', () => {
            const buffer = new ImageBuffer(10, 10);

            // Create a 2x2 red square at (3, 4)
            buffer.setTexel(3, 4, 0xFF0000FF);
            buffer.setTexel(4, 4, 0xFF0000FF);
            buffer.setTexel(3, 5, 0xFF0000FF);
            buffer.setTexel(4, 5, 0xFF0000FF);

            const region = buffer.getRegionUnchecked(3, 4, 2, 2);

            expect(region.width).toBe(2);
            expect(region.height).toBe(2);
            expect(region.at(0, 0)).toBe(0xFF0000FF);
            expect(region.at(1, 0)).toBe(0xFF0000FF);
            expect(region.at(0, 1)).toBe(0xFF0000FF);
            expect(region.at(1, 1)).toBe(0xFF0000FF);
        });

        it('should extract region at buffer origin without bounds check', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.setTexel(0, 0, 0xFF0000FF);
            buffer.setTexel(1, 0, 0x00FF00FF);

            const region = buffer.getRegionUnchecked(0, 0, 2, 1);

            expect(region.at(0, 0)).toBe(0xFF0000FF);
            expect(region.at(1, 0)).toBe(0x00FF00FF);
        });

        it('should extract 1x1 region without bounds check', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.setTexel(5, 5, 0xFF0000FF);

            const region = buffer.getRegionUnchecked(5, 5, 1, 1);

            expect(region.width).toBe(1);
            expect(region.height).toBe(1);
            expect(region.at(0, 0)).toBe(0xFF0000FF);
        });

        it('should create independent region (mutations do not affect original)', () => {
            const buffer = new ImageBuffer(10, 10);
            buffer.fill(0xFF0000FF);

            const region = buffer.getRegionUnchecked(2, 2, 3, 3);
            region.setTexel(1, 1, 0x00FF00FF);

            expect(region.at(1, 1)).toBe(0x00FF00FF);
            expect(buffer.at(3, 3)).toBe(0xFF0000FF); // Original unchanged
        });

        it('should not throw for out of bounds access (unsafe)', () => {
            const buffer = new ImageBuffer(10, 10);

            // This won't throw but may produce undefined behavior
            // Just verify it doesn't crash
            expect(() => buffer.getRegionUnchecked(8, 8, 5, 5)).not.toThrow();
        });

        it('should work the same as getRegion() for valid coordinates', () => {
            const buffer = new ImageBuffer(100, 100);
            buffer.fill(0xFF0000FF);

            const region1 = buffer.getRegionUnchecked(25, 25, 50, 50);
            const region2 = buffer.getRegion(25, 25, 50, 50);

            // Both should produce the same result for valid coordinates
            expect(region1.width).toBe(region2.width);
            expect(region1.height).toBe(region2.height);
            expect(region1.at(0, 0)).toBe(region2.at(0, 0));
        });
    });

    describe('Symbol.iterator', () => {
        it('should iterate over all texels', () => {
            const buffer = new ImageBuffer(3, 2);

            // Fill with sequential values
            buffer.setTexel(0, 0, 1);
            buffer.setTexel(1, 0, 2);
            buffer.setTexel(2, 0, 3);
            buffer.setTexel(0, 1, 4);
            buffer.setTexel(1, 1, 5);
            buffer.setTexel(2, 1, 6);

            const texels = [...buffer];

            expect(texels).toHaveLength(6);
            expect(texels).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('should iterate in row-major order', () => {
            const buffer = new ImageBuffer(2, 2);

            buffer.setTexel(0, 0, 1); // Top-left
            buffer.setTexel(1, 0, 2); // Top-right
            buffer.setTexel(0, 1, 3); // Bottom-left
            buffer.setTexel(1, 1, 4); // Bottom-right

            const texels = [...buffer];

            expect(texels).toEqual([1, 2, 3, 4]);
        });

        it('should work with for...of loop', () => {
            const buffer = new ImageBuffer(5, 5);
            buffer.fill(0xFF0000FF);

            let count = 0;

            for (const texel of buffer) {
                expect(texel).toBe(0xFF0000FF);
                count++;
            }

            expect(count).toBe(25);
        });

        it('should work with Array.from()', () => {
            const buffer = new ImageBuffer(3, 3);
            buffer.fill(42);

            const array = Array.from(buffer);

            expect(array).toHaveLength(9);
            expect(array.every((t) => t === 42)).toBe(true);
        });
    });

    describe('Symbol.toStringTag', () => {
        it('should return "ImageBuffer"', () => {
            const buffer = new ImageBuffer(5, 5);

            expect(buffer[Symbol.toStringTag]).toBe('ImageBuffer');
        });

        it('should affect Object.prototype.toString', () => {
            const buffer = new ImageBuffer(5, 5);

            expect(Object.prototype.toString.call(buffer)).toBe('[object ImageBuffer]');
        });
    });

    describe('integration tests', () => {
        it('should handle complex drawing operations', () => {
            const buffer = new ImageBuffer(20, 20);

            // Draw horizontal red line
            for (let x = 0; x < 20; x++) {
                buffer.setTexel(x, 10, 0xFF0000FF);
            }

            // Draw vertical green line
            for (let y = 0; y < 20; y++) {
                buffer.setTexel(10, y, 0x00FF00FF);
            }

            // Check intersection is green (overwrites red)
            expect(buffer.at(10, 10)).toBe(0x00FF00FF);

            // Check red line
            expect(buffer.at(5, 10)).toBe(0xFF0000FF);

            // Check green line
            expect(buffer.at(10, 5)).toBe(0x00FF00FF);
        });

        it('should work as ImageData for canvas operations', () => {
            const buffer = new ImageBuffer(10, 10);

            // ImageBuffer extends ImageData, so it should be compatible
            expect(buffer).toBeInstanceOf(ImageData);
            expect(buffer.data).toBeInstanceOf(Uint8ClampedArray);
        });

        it('should handle large buffers efficiently', () => {
            const buffer = new ImageBuffer(1000, 1000);

            // Fill entire buffer
            buffer.fill(0xFF0000FF);

            // Sample check
            expect(buffer.at(0, 0)).toBe(0xFF0000FF);
            expect(buffer.at(500, 500)).toBe(0xFF0000FF);
            expect(buffer.at(999, 999)).toBe(0xFF0000FF);
        });
    });
});
