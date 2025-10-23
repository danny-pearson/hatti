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
    public constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
    }

    /**
     * Creates a rectangle from a center point and dimensions.
     *
     * @param   cx     - Center x coordinate
     * @param   cy     - Center y coordinate
     * @param   width  - Width of the rectangle
     * @param   height - Height of the rectangle
     * @returns        A new Rect centered at the given point
     */
    public static fromCenter(cx: number, cy: number, width: number, height: number): Rect {
        return new Rect(cx - width / 2, cy - height / 2, width, height);
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

    /**
     * Checks if this rectangle intersects with another rectangle (AABB collision).
     *
     * @param   other - The other rectangle to check intersection with
     * @returns         True if the rectangles overlap
     */
    public intersects(other: RectLike | Rect): boolean {
        const [ox, oy, ow, oh] = !Array.isArray(other)
            ? [other.x, other.y, other.width, other.height] as const
            : other;

        return this.x < ox! + ow!
            && this.x + this.width > ox!
            && this.y < oy! + oh!
            && this.y + this.height > oy!;
    }

    /**
     * Checks if a point is inside this rectangle.
     *
     * @param   x - The x coordinate of the point
     * @param   y - The y coordinate of the point
     * @returns     True if the point is inside the rectangle
     */
    public containsPoint(x: number, y: number): boolean {
        return x >= this.x
            && x <= this.x + this.width
            && y >= this.y
            && y <= this.y + this.height;
    }

    /**
     * Checks if this rectangle completely contains another rectangle.
     *
     * @param   other - The rectangle to check if contained
     * @returns         True if this rectangle completely contains the other
     */
    public contains(other: RectLike | Rect): boolean {
        const [ox, oy, ow, oh] = !Array.isArray(other)
            ? [other.x, other.y, other.width, other.height] as const
            : other;

        return ox! > this.x
            && oy! > this.y
            && ox! + ow! < this.x + this.width
            && oy! + oh! < this.y + this.height;
    }

    /**
     * Gets the intersection rectangle with another rectangle.
     *
     * @param   other - The rectangle to intersect with
     * @returns         A new Rect representing the intersection, or null if no intersection
     */
    public intersection(other: RectLike | Rect): Rect | null {
        const [ox, oy, ow, oh] = !Array.isArray(other)
            ? [other.x, other.y, other.width, other.height] as const
            : other;

        const left   = Math.max(this.x, ox!);
        const top    = Math.max(this.y, oy!);
        const right  = Math.min(this.x + this.width, ox! + ow!);
        const bottom = Math.min(this.y + this.height, oy! + oh!);

        if (left >= right || top >= bottom) return null;

        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Gets the union (bounding box) with another rectangle.
     *
     * @param   other - The rectangle to union with
     * @returns         A new Rect representing the union
     */
    public union(other: RectLike | Rect): Rect {
        const [ox, oy, ow, oh] = !Array.isArray(other)
            ? [other.x, other.y, other.width, other.height] as const
            : other;

        const left   = Math.min(this.x, ox!);
        const top    = Math.min(this.y, oy!);
        const right  = Math.max(this.x + this.width, ox! + ow!);
        const bottom = Math.max(this.y + this.height, oy! + oh!);

        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Gets the center point of the rectangle.
     *
     * @returns Array containing the center x and y coordinates
     */
    public getCenter(): [number, number] {
        return [this.x + this.width / 2, this.y + this.height / 2];
    }

    /**
     * Gets the left edge x coordinate (same as x).
     *
     * @returns The x coordinate of the left edge
     */
    public get left(): number {
        return this.x;
    }

    /**
     * Gets the top edge y coordinate (same as y).
     *
     * @returns The y coordinate of the top edge
     */
    public get top(): number {
        return this.y;
    }

    /**
     * Gets the right edge x coordinate.
     *
     * @returns The x coordinate of the right edge (x + width)
     */
    public get right(): number {
        return this.x + this.width;
    }

    /**
     * Gets the bottom edge y coordinate.
     *
     * @returns The y coordinate of the bottom edge (y + height)
     */
    public get bottom(): number {
        return this.y + this.height;
    }
}

export default Rect;
