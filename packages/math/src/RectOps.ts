import type { RectLike } from './types';

/**
 * Checks if two rectangles intersect (AABB collision detection).
 *
 * @param   a - The first rectangle
 * @param   b - The second rectangle
 * @returns     True if the rectangles overlap
 */
export const intersects = (a: RectLike, b: RectLike): boolean => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;

    return ax! < bx! + bw!
        && ax! + aw! > bx!
        && ay! < by! + bh!
        && ay! + ah! > by!;
};

/**
 * Checks if a point is inside a rectangle.
 *
 * @param   rect - The rectangle to check
 * @param   x    - The x coordinate of the point
 * @param   y    - The y coordinate of the point
 * @returns        True if the point is inside the rectangle
 */
export const containsPoint = (rect: RectLike, x: number, y: number): boolean => {
    const [rx, ry, rw, rh] = rect;

    return x >= rx!
        && x <= rx! + rw!
        && y >= ry!
        && y <= ry! + rh!;
};

/**
 * Checks if rectangle A completely contains rectangle B.
 *
 * @param   a - The container rectangle
 * @param   b - The rectangle to check if contained
 * @returns     True if A completely contains B
 */
export const contains = (a: RectLike, b: RectLike): boolean => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;

    return bx! > ax!
        && by! > ay!
        && bx! + bw! < ax! + aw!
        && by! + bh! < ay! + ah!;
};

/**
 * Gets the intersection rectangle of two rectangles.
 *
 * @param   a - The first rectangle
 * @param   b - The second rectangle
 * @returns     A new RectLike representing the intersection, or null if no intersection
 */
export const intersection = (a: RectLike, b: RectLike): RectLike | null => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;

    const left   = Math.max(ax!, bx!);
    const top    = Math.max(ay!, by!);
    const right  = Math.min(ax! + aw!, bx! + bw!);
    const bottom = Math.min(ay! + ah!, by! + bh!);

    if (left >= right || top >= bottom) return null;

    return [left, top, right - left, bottom - top];
};

/**
 * Gets the intersection rectangle of two rectangles and writes the result to out.
 *
 * @param   out - Output array to store the result
 * @param   a   - The first rectangle
 * @param   b   - The second rectangle
 * @returns       The out array with the intersection, or null if no intersection
 */
export const intersectionMut = (out: RectLike, a: RectLike, b: RectLike): RectLike | null => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;

    const left   = Math.max(ax!, bx!);
    const top    = Math.max(ay!, by!);
    const right  = Math.min(ax! + aw!, bx! + bw!);
    const bottom = Math.min(ay! + ah!, by! + bh!);

    if (left >= right || top >= bottom) return null;

    out[0] = left;
    out[1] = top;
    out[2] = right - left;
    out[3] = bottom - top;

    return out;
};

/**
 * Gets the union (bounding box) of two rectangles.
 *
 * @param   a - The first rectangle
 * @param   b - The second rectangle
 * @returns     A new RectLike representing the union
 */
export const union = (a: RectLike, b: RectLike): RectLike => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;

    const left   = Math.min(ax!, bx!);
    const top    = Math.min(ay!, by!);
    const right  = Math.max(ax! + aw!, bx! + bw!);
    const bottom = Math.max(ay! + ah!, by! + bh!);

    return [left, top, right - left, bottom - top];
};

/**
 * Gets the union (bounding box) of two rectangles and writes the result to out.
 *
 * @param   out - Output array to store the result
 * @param   a   - The first rectangle
 * @param   b   - The second rectangle
 * @returns       The out array with the union
 */
export const unionMut = (out: RectLike, a: RectLike, b: RectLike): RectLike => {
    const [ax, ay, aw, ah] = a;
    const [bx, by, bw, bh] = b;

    const left   = Math.min(ax!, bx!);
    const top    = Math.min(ay!, by!);
    const right  = Math.max(ax! + aw!, bx! + bw!);
    const bottom = Math.max(ay! + ah!, by! + bh!);

    out[0] = left;
    out[1] = top;
    out[2] = right - left;
    out[3] = bottom - top;

    return out;
};

/**
 * Creates a rectangle from a center point and dimensions.
 *
 * @param   cx     - Center x coordinate
 * @param   cy     - Center y coordinate
 * @param   width  - Width of the rectangle
 * @param   height - Height of the rectangle
 * @returns          A new RectLike centered at the given point
 */
export const fromCenter = (cx: number, cy: number, width: number, height: number): RectLike => {
    return [cx - width / 2, cy - height / 2, width, height];
};

/**
 * Gets the center point of a rectangle.
 *
 * @param   rect - The rectangle
 * @returns        Array containing the center x and y coordinates
 */
export const getCenter = (rect: RectLike): [number, number] => {
    const [x, y, w, h] = rect;

    return [x! + w! / 2, y! + h! / 2];
};

/**
 * Gets the area of a rectangle.
 *
 * @param   rect - The rectangle
 * @returns        The area (width * height)
 */
export const area = (rect: RectLike): number => {
    const [, , w, h] = rect;

    return w! * h!;
};

/**
 * Gets the perimeter of a rectangle.
 *
 * @param   rect - The rectangle
 * @returns        The perimeter (2 * width + 2 * height)
 */
export const perimeter = (rect: RectLike): number => {
    const [, , w, h] = rect;

    return 2 * (w! + h!);
};

/**
 * Expands a rectangle by a given amount in all directions.
 *
 * @param   rect   - The rectangle to expand
 * @param   amount - The amount to expand by (can be negative to shrink)
 * @returns          A new expanded RectLike
 */
export const expand = (rect: RectLike, amount: number): RectLike => {
    const [x, y, w, h] = rect;

    return [x! - amount, y! - amount, w! + amount * 2, h! + amount * 2];
};

/**
 * Expands a rectangle by a given amount in all directions and writes the result to out.
 *
 * @param   out    - Output array to store the result
 * @param   rect   - The rectangle to expand
 * @param   amount - The amount to expand by (can be negative to shrink)
 * @returns          The out array with the expanded rectangle
 */
export const expandMut = (out: RectLike, rect: RectLike, amount: number): RectLike => {
    const [x, y, w, h] = rect;

    out[0] = x! - amount;
    out[1] = y! - amount;
    out[2] = w! + amount * 2;
    out[3] = h! + amount * 2;

    return out;
};

/**
 * Translates a rectangle by the given offset.
 *
 * @param   rect - The rectangle to translate
 * @param   dx   - The x offset
 * @param   dy   - The y offset
 * @returns        A new translated RectLike
 */
export const translate = (rect: RectLike, dx: number, dy: number): RectLike => {
    const [x, y, w, h] = rect;

    return [x! + dx, y! + dy, w!, h!];
};

/**
 * Translates a rectangle by the given offset and writes the result to out.
 *
 * @param   out  - Output array to store the result
 * @param   rect - The rectangle to translate
 * @param   dx   - The x offset
 * @param   dy   - The y offset
 * @returns        The out array with the translated rectangle
 */
export const translateMut = (out: RectLike, rect: RectLike, dx: number, dy: number): RectLike => {
    const [x, y, w, h] = rect;

    out[0] = x! + dx;
    out[1] = y! + dy;
    out[2] = w!;
    out[3] = h!;

    return out;
};
