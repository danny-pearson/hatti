import type { RectFields, RectLike } from './types';

/**
 * A rectangle defined by its position (x, y) and dimensions (width, height).
 *
 * Compatible with DOMRect interface but works in any environment (browser or Node).
 */
class Rect implements DOMRect {
    public x:      number;

    public y:      number;

    public width:  number;

    public height: number;

    /**
     * Creates a new Rect instance.
     *
     * @param   x      - The x coordinate of the rectangle's origin
     * @param   y      - The y coordinate of the rectangle's origin
     * @param   width  - The width of the rectangle
     * @param   height - The height of the rectangle
     */
    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
    }

    /**
     * Gets the left edge x coordinate (same as x).
     *
     * @returns The x coordinate of the left edge
     */
    get left(): number {
        return this.x;
    }

    /**
     * Gets the top edge y coordinate (same as y).
     *
     * @returns The y coordinate of the top edge
     */
    get top(): number {
        return this.y;
    }

    /**
     * Gets the right edge x coordinate.
     *
     * @returns The x coordinate of the right edge (x + width)
     */
    get right(): number {
        return this.x + this.width;
    }

    /**
     * Gets the bottom edge y coordinate.
     *
     * @returns The y coordinate of the bottom edge (y + height)
     */
    get bottom(): number {
        return this.y + this.height;
    }

    /**
     * Converts the rectangle to an array [x, y, width, height].
     *
     * @returns Array representation of the rectangle
     */
    public toArray(): RectLike {
        return [this.x, this.y, this.width, this.height];
    }

    /**
     * Creates a JSON representation of the rectangle.
     *
     * @returns Object containing x, y, width, and height properties
     */
    public toJSON(): RectFields {
        return {
            x:      this.x,
            y:      this.y,
            width:  this.width,
            height: this.height,
        };
    }
}

export default Rect;
