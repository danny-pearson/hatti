import { hexToUint32 } from '@hatti/color';
import { isNumber, isString } from '@hatti/shared';

/**
 * ImageBuffer extends ImageData with convenient methods for texel manipulation.
 * Provides faster access using Uint32Array view and supports iteration over texels.
 */
class ImageBuffer extends ImageData {
    #texels: Uint32Array;

    public constructor(width: number, height: number);
    public constructor(data: Uint8ClampedArray<ArrayBuffer>, width: number, height: number);
    public constructor(dataOrWidth: number | Uint8ClampedArray<ArrayBuffer>, widthOrHeight: number, height?: number) {
        if (isNumber(dataOrWidth)) {
            const byteArr = new Uint8ClampedArray(dataOrWidth * widthOrHeight * 4);
            super(byteArr, dataOrWidth, widthOrHeight);

            this.#texels = new Uint32Array(byteArr.buffer);
        } else {
            super(dataOrWidth, widthOrHeight, height);

            this.#texels = new Uint32Array(dataOrWidth.buffer);
        }
    }

    /**
     * Gets the color value at the specified coordinates.
     *
     * @param   x - X coordinate
     * @param   y - Y coordinate
     * @returns     Color as uint32
     */
    public at(x: number, y: number): number {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError(`[ImageBuffer::at]: Coordinates (${x}, ${y}) out of bounds`);
        }

        return this.#texels[x + y * this.width]!;
    }

    /**
     * Gets the color value at the specified coordinates without bounds check.
     *
     * @param   x - X coordinate
     * @param   y - Y coordinate
     * @returns     Color as uint32
     */
    public atUnchecked(x: number, y: number): number {
        return this.#texels[x + y * this.width]!;
    }

    /**
     * Sets the color at the specified coordinates.
     *
     * @param x     - X coordinate
     * @param y     - Y coordinate
     * @param color - Color as string or uint32
     */
    public setTexel(x: number, y: number, color: string | number): void {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new RangeError(`[ImageBuffer::setTexel]: Coordinates (${x}, ${y}) out of bounds`);
        }

        const colorValue = isString(color) ? hexToUint32(color) : color;

        this.#texels[x + y * this.width] = colorValue;
    }

    /**
     * Sets the color at the specified coordinates without bounds check.
     *
     * @param x     - X coordinate
     * @param y     - Y coordinate
     * @param color - Color as string or uint32
     */
    public setTexelUnchecked(x: number, y: number, color: string | number): void {
        const colorValue = isString(color) ? hexToUint32(color) : color;

        this.#texels[x + y * this.width] = colorValue;
    }

    /**
     * Gets a rectangular region as a new ImageBuffer.
     *
     * @param   x      - Starting X coordinate
     * @param   y      - Starting Y coordinate
     * @param   width  - Region width
     * @param   height - Region height
     * @returns          New ImageBuffer containing the region
     */
    public getRegion(x: number, y: number, width: number, height: number): ImageBuffer {
        const region = new ImageBuffer(width, height);

        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const color = this.at(x + dx, y + dy);

                region.setTexel(dx, dy, color);
            }
        }

        return region;
    }

    /**
     * Gets a rectangular region as a new ImageBuffer without bounds check.
     *
     * @param   x      - Starting X coordinate
     * @param   y      - Starting Y coordinate
     * @param   width  - Region width
     * @param   height - Region height
     * @returns          New ImageBuffer containing the region
     */
    public getRegionUnchecked(x: number, y: number, width: number, height: number): ImageBuffer {
        const region = new ImageBuffer(width, height);

        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                const color = this.atUnchecked(x + dx, y + dy);

                region.setTexelUnchecked(dx, dy, color);
            }
        }

        return region;
    }

    /**
     * Clears the buffer by filling all texels with transparent black.
     */
    public clear(): void {
        this.#texels.fill(0);
    }

    /**
     * Fills the entire buffer with a single color.
     *
     * @param color - Color as string or uint32
     */
    public fill(color: string | number): void {
        const colorValue = isString(color) ? hexToUint32(color) : color;

        this.#texels.fill(colorValue);
    }

    /**
     * Clones this ImageBuffer.
     *
     * @returns A new ImageBuffer with copied data
     */
    public clone(): ImageBuffer {
        return new ImageBuffer(
            new Uint8ClampedArray(this.data),
            this.width,
            this.height,
        );
    }

    /**
     * Iterates over all texels in the buffer (row by row).
     *
     * @yields Color values as uint32
     */
    public *[Symbol.iterator](): Generator<number, void, undefined> {
        const length = this.width * this.height;

        for (let i = 0; i < length; i++) {
            yield this.#texels[i]!;
        }
    }

    public get [Symbol.toStringTag]() {
        return 'ImageBuffer';
    }
}

export default ImageBuffer;
