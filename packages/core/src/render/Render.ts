import { TAU } from '@hatti/math';
import { Bitmask } from '@hatti/bitwise';
import { isString } from '@hatti/shared';
import { Color } from '@hatti/color';
import { FILL, STROKE } from './flags';
import { assertContext } from '../Core';

/**
 * Sets the fill color for subsequent drawing operations.
 *
 * @param color - Color as a string (e.g., '#ff0000') or uint32 number
 */
export const setFill = (color: string | number) => {
    const context = assertContext();

    context.fillStyle = isString(color) ? color : Color.uint32ToHex(color);
};

/**
 * Sets the stroke color and optionally the line width.
 *
 * @param color - Color as a string (e.g., '#ff0000') or uint32 number
 * @param width - Optional line width in pixels
 */
export const setStroke = (color: string | number, width?: number) => {
    const context = assertContext();

    context.strokeStyle = isString(color) ? color : Color.uint32ToHex(color);

    if (!width) return;

    context.setLineWidth(width);
};

/**
 * Sets the line width for stroke operations.
 *
 * @param width - Line width in pixels
 */
export const setLineWidth = (width: number) => {
    const context = assertContext();

    context.setLineWidth(width);
};

/**
 * Sets the text writing direction.
 *
 * @param value - Direction ('ltr', 'rtl', or 'inherit')
 */
export const setWritingDirection = (value: CanvasDirection) => {
    const context = assertContext();

    context.direction = value;
};

/**
 * Sets the filter for drawing operations (e.g., blur, brightness).
 *
 * @param value - CSS filter string
 */
export const setFilter = (value: string) => {
    const context = assertContext();

    context.filter = value;
};

/**
 * Sets the font for text rendering.
 *
 * @param value - CSS font string (e.g., '16px Arial')
 */
export const setFont = (value: string) => {
    const context = assertContext();

    context.font = value;
};

/**
 * Sets the font kerning mode.
 *
 * @param value - Kerning mode ('auto', 'normal', or 'none')
 */
export const setFontKerning = (value: CanvasFontKerning) => {
    const context = assertContext();

    context.fontKerning = value;
};

/**
 * Sets the font stretch property.
 *
 * @param value - Font stretch value
 */
export const setFontStretch = (value: CanvasFontStretch) => {
    const context = assertContext();

    context.fontStretch = value;
};

/**
 * Sets the font variant caps property.
 *
 * @param value - Font variant caps value
 */
export const setFontVariantCaps = (value: CanvasFontVariantCaps) => {
    const context = assertContext();

    context.fontVariantCaps = value;
};

/**
 * Sets the global alpha (opacity) for all drawing operations.
 *
 * @param value - Alpha value between 0 (transparent) and 1 (opaque)
 */
export const setGlobalAlpha = (value: number) => {
    const context = assertContext();

    context.globalAlpha = value;
};

/**
 * Sets the global composite operation for blending modes.
 *
 * @param value - Composite operation (e.g., 'source-over', 'multiply')
 */
export const setGlobalCompositeOperation = (value: GlobalCompositeOperation) => {
    const context = assertContext();

    context.globalCompositeOperation = value;
};

/**
 * Enables or disables image smoothing (anti-aliasing).
 *
 * @param value - True to enable smoothing, false to disable
 */
export const setImageSmoothingEnabled = (value: boolean) => {
    const context = assertContext();

    context.imageSmoothingEnabled = value;
};

/**
 * Sets the quality of image smoothing.
 *
 * @param value - Quality level ('low', 'medium', or 'high')
 */
export const setImageSmoothingQuality = (value: ImageSmoothingQuality) => {
    const context = assertContext();

    context.imageSmoothingQuality = value;
};

// export const setLang = (lang: string) => {
//     const context = assertContext();

//     context.lang = lang;
// };

/**
 * Sets the letter spacing for text rendering.
 *
 * @param value - Letter spacing value (e.g., '2px', '0.1em')
 */
export const setLetterSpacing = (value: string) => {
    const context = assertContext();

    context.letterSpacing = value;
};

/**
 * Sets the line cap style for strokes.
 *
 * @param value - Line cap style ('butt', 'round', or 'square')
 */
export const setLineCap = (value: CanvasLineCap) => {
    const context = assertContext();

    context.lineCap = value;
};

/**
 * Sets the line dash offset for dashed lines.
 *
 * @param value - Offset value in pixels
 */
export const setLineDashOffset = (value: number) => {
    const context = assertContext();

    context.lineDashOffset = value;
};

/**
 * Sets the line join style for stroke corners.
 *
 * @param value - Line join style ('round', 'bevel', or 'miter')
 */
export const setLineJoin = (value: CanvasLineJoin) => {
    const context = assertContext();

    context.lineJoin = value;
};

/**
 * Sets the miter limit for line joins.
 *
 * @param value - Miter limit ratio
 */
export const setMiterLimit = (value: number) => {
    const context = assertContext();

    context.miterLimit = value;
};

/**
 * Sets the shadow blur radius.
 *
 * @param value - Blur radius in pixels
 */
export const setShadowBlur = (value: number) => {
    const context = assertContext();

    context.shadowBlur = value;
};

/**
 * Sets the shadow color.
 *
 * @param color - Color as a string (e.g., '#ff0000') or uint32 number
 */
export const setShadowColor = (color: string | number) => {
    const context = assertContext();

    context.shadowColor = isString(color) ? color : Color.uint32ToHex(color);
};

/**
 * Sets the horizontal shadow offset.
 *
 * @param value - Offset in pixels
 */
export const setShadowOffsetX = (value: number) => {
    const context = assertContext();

    context.shadowOffsetX = value;
};

/**
 * Sets the vertical shadow offset.
 *
 * @param value - Offset in pixels
 */
export const setShadowOffsetY = (value: number) => {
    const context = assertContext();

    context.shadowOffsetY = value;
};

/**
 * Sets the text alignment.
 *
 * @param value - Text align ('start', 'end', 'left', 'right', or 'center')
 */
export const setTextAlign = (value: CanvasTextAlign) => {
    const context = assertContext();

    context.textAlign = value;
};

/**
 * Sets the text baseline alignment.
 *
 * @param value - Baseline ('top', 'hanging', 'middle', 'alphabetic', 'ideographic', or 'bottom')
 */
export const setTextBaseline = (value: CanvasTextBaseline) => {
    const context = assertContext();

    context.textBaseline = value;
};

/**
 * Sets the text rendering quality.
 *
 * @param value - Rendering mode ('auto', 'optimizeSpeed', 'optimizeLegibility', or 'geometricPrecision')
 */
export const setTextRendering = (value: CanvasTextRendering) => {
    const context = assertContext();

    context.textRendering = value;
};

/**
 * Sets the word spacing for text rendering.
 *
 * @param value - Word spacing value (e.g., '4px', '0.2em')
 */
export const setWordSpacing = (value: string) => {
    const context = assertContext();

    context.wordSpacing = value;
};

/**
 * Fills the given path with the current fill style.
 *
 * @param path - Path2D object to fill
 */
export const fill = (path: Path2D) => {
    const context = assertContext();

    context.fill(path);
};

/**
 * Strokes the current path with the current stroke style.
 */
export const stroke = () => {
    const context = assertContext();

    context.stroke();
};

/**
 * Clears the entire canvas to transparent.
 */
export const clear = () => {
    const context = assertContext();

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clear();
    context.restore();
};

/**
 * Clears the canvas by filling it with a solid color.
 *
 * @param color - Fill color as a string
 */
export const clearColor = (color: string): void => {
    const context = assertContext();

    context.save();

    context.fillStyle = color;

    context.fillRect(0, 0, context.width, context.height);
    context.restore();
};

/**
 * Moves the drawing cursor to the specified position without drawing.
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 */
export const moveTo = (x: number, y: number) => {
    const context = assertContext();

    context.moveTo(x, y);
};

/**
 * Draws a line from the current position to the specified position.
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 */
export const lineTo = (x: number, y: number) => {
    const context = assertContext();

    context.lineTo(x, y);
};

/**
 * Draws a line between two points.
 *
 * @param xA    - Starting X coordinate
 * @param yA    - Starting Y coordinate
 * @param xB    - Ending X coordinate
 * @param yB    - Ending Y coordinate
 * @param flags - Optional rendering flags (FILL, STROKE)
 */
export const line = (
    xA:     number,
    yA:     number,
    xB:     number,
    yB:     number,
    flags?: number,
): void => {
    const context = assertContext();

    context.moveTo(xA, yA);
    context.lineTo(xB, yB);

    if (typeof flags === 'undefined') return;

    if (Bitmask.hasAny(flags, FILL)) context.fill();
    if (Bitmask.hasAny(flags, STROKE)) context.stroke();
};

/**
 * Draws a cubic Bezier curve to the specified point.
 *
 * @param cp1x - First control point X
 * @param cp1y - First control point Y
 * @param cp2x - Second control point X
 * @param cp2y - Second control point Y
 * @param x    - Ending point X
 * @param y    - Ending point Y
 */
export const bezierTo = (
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x:    number,
    y:    number,
) => {
    const context = assertContext();

    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
};

/**
 * Draws an arc (portion of a circle).
 *
 * @param x          - Center X coordinate
 * @param y          - Center Y coordinate
 * @param radius     - Arc radius
 * @param startAngle - Starting angle in radians
 * @param endAngle   - Ending angle in radians
 * @param flags      - Optional rendering flags (FILL, STROKE)
 */
export const arc = (
    x:          number,
    y:          number,
    radius:     number,
    startAngle: number,
    endAngle:   number,
    flags?:     number,
) => {
    const context = assertContext();

    context.arc(x, y, radius, startAngle, endAngle);

    if (typeof flags === 'undefined') return;

    if (Bitmask.hasAny(flags, FILL)) context.fill();
    if (Bitmask.hasAny(flags, STROKE)) context.stroke();
};

/**
 * Draws a rectangle.
 *
 * @param x      - X coordinate of top-left corner
 * @param y      - Y coordinate of top-left corner
 * @param width  - Rectangle width
 * @param height - Rectangle height
 * @param flags  - Optional rendering flags (FILL, STROKE)
 */
export const rect = (
    x:      number,
    y:      number,
    width:  number,
    height: number,
    flags?: number,
) => {
    const context = assertContext();

    context.rect(x, y, width, height, flags);
};

/**
 * Draws a circle.
 *
 * @param x      - Center X coordinate
 * @param y      - Center Y coordinate
 * @param radius - Circle radius
 * @param flags  - Optional rendering flags (FILL, STROKE)
 */
export const circle = (
    x:      number,
    y:      number,
    radius: number,
    flags?: number,
): void => {
    const context = assertContext();

    context.circle(x, y, radius, flags);
};

/**
 * Draws an ellipse.
 *
 * @param x       - Center X coordinate
 * @param y       - Center Y coordinate
 * @param radiusX - Horizontal radius
 * @param radiusY - Vertical radius
 * @param flags   - Optional rendering flags (FILL, STROKE)
 */
export const ellipse = (
    x:       number,
    y:       number,
    radiusX: number,
    radiusY: number,
    flags?:  number,
) => {
    const context = assertContext();

    context.beginPath();
    context.ellipse(
        x,
        y,
        radiusX,
        radiusY,
        0,
        0,
        TAU,
    );

    if (typeof flags === 'undefined') return;

    if (Bitmask.hasAny(flags, FILL)) context.fill();
    if (Bitmask.hasAny(flags, STROKE)) context.stroke();
};

/**
 * Draws a capsule (rounded rectangle).
 *
 * @param x      - X coordinate
 * @param y      - Y coordinate
 * @param width  - Capsule width
 * @param height - Capsule height
 * @param flags  - Optional rendering flags (FILL, STROKE)
 */
export const capsule = (
    x:      number,
    y:      number,
    width:  number,
    height: number,
    flags?: number,
) => {
    const context = assertContext();

    context.capsule(x, y, width, height, flags);
};

/**
 * Draws an equilateral triangle.
 *
 * @param x        - Center X coordinate
 * @param y        - Center Y coordinate
 * @param radius   - Radius from center to vertices
 * @param rotation - Optional rotation in radians (default: 0, pointing up)
 * @param flags    - Optional rendering flags (FILL, STROKE)
 */
export const triangle = (
    x:        number,
    y:        number,
    radius:   number,
    rotation: number = 0,
    flags?:   number,
) => {
    const context = assertContext();

    context.triangle(x, y, radius, rotation, flags);
};

/**
 * Draws a regular pentagon.
 *
 * @param x      - Center X coordinate
 * @param y      - Center Y coordinate
 * @param radius - Radius from center to vertices
 * @param flags  - Optional rendering flags (FILL, STROKE)
 */
export const pentagon = (
    x: number, y: number, radius: number, flags?: number,
) => {
    const context = assertContext();

    context.pentagon(x, y, radius, flags);
};

/**
 * Draws a regular hexagon.
 *
 * @param x      - Center X coordinate
 * @param y      - Center Y coordinate
 * @param radius - Radius from center to vertices
 * @param flags  - Optional rendering flags (FILL, STROKE)
 */
export const hexagon = (
    x: number, y: number, radius: number, flags?: number,
) => {
    const context = assertContext();

    context.hexagon(x, y, radius, flags);
};

/**
 * Begins a new path, clearing any existing paths.
 */
export const beginPath = () => {
    const context = assertContext();

    context.beginPath();
};

/**
 * Closes the current path by drawing a line to the starting point.
 */
export const closePath = () => {
    const context = assertContext();

    context.closePath();
};

/**
 * Begins a custom shape definition.
 */
export const beginShape = () => {
    const context = assertContext();

    context.beginShape();
};

/**
 * Ends the current shape definition and optionally renders it.
 *
 * @param flags - Optional rendering flags (FILL, STROKE)
 */
export const endShape = (flags?: number) => {
    const context = assertContext();

    context.endShape(flags);
};

/**
 * Adds a vertex to the current shape.
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 */
export const vertex = (x: number, y: number) => {
    const context = assertContext();

    context.vertex(x, y);
};

/**
 * Adds a curve vertex to the current shape.
 *
 * @param x - X coordinate
 * @param y - Y coordinate
 */
export const curveVertex = (x: number, y: number) => {
    const context = assertContext();

    context.curveVertex(x, y);
};

/**
 * Enables or disables shape debugging visualization.
 *
 * @param value - True to enable debugging, false to disable
 */
export const debugShape = (value: boolean) => {
    const context = assertContext();

    context.debugShape(value);
};

/**
 * Saves the current drawing state (transforms, styles, etc.).
 */
export const push = () => {
    const context = assertContext();

    context.save();
};

/**
 * Restores the most recently saved drawing state.
 */
export const pop = () => {
    const context = assertContext();

    context.restore();
};

/**
 * Reads pixel data from a rectangular region of the canvas.
 *
 * @param   sx       - Source X coordinate
 * @param   sy       - Source Y coordinate
 * @param   sw       - Source width
 * @param   sh       - Source height
 * @param   settings - Optional image data settings
 * @returns            ImageData containing the pixel data
 */
export const readPixels = (
    sx:        number,
    sy:        number,
    sw:        number,
    sh:        number,
    settings?: ImageDataSettings,
) => {
    const context = assertContext();

    return context.getImageData(sx, sy, sw, sh, settings);
};

/**
 * Writes pixel data from an ImageData buffer to the canvas.
 *
 * @param buffer      - ImageData buffer to write
 * @param dx          - Destination X coordinate
 * @param dy          - Destination Y coordinate
 * @param dirtyX      - Optional dirty rectangle X
 * @param dirtyY      - Optional dirty rectangle Y
 * @param dirtyWidth  - Optional dirty rectangle width
 * @param dirtyHeight - Optional dirty rectangle height
 */
export const blit = (
    buffer:       ImageData,
    dx:           number,
    dy:           number,
    dirtyX?:      number,
    dirtyY?:      number,
    dirtyWidth?:  number,
    dirtyHeight?: number,
) => {
    const context = assertContext();

    context.putImageData(buffer, dx, dy, dirtyX!, dirtyY!, dirtyWidth!, dirtyHeight!);
};

/**
 * Draws an image onto the canvas with optional rotation.
 *
 * @param image - Image source to draw
 * @param sx    - Source X coordinate
 * @param sy    - Source Y coordinate
 * @param sw    - Source width
 * @param sh    - Source height
 * @param dx    - Destination X coordinate
 * @param dy    - Destination Y coordinate
 * @param dw    - Destination width
 * @param dh    - Destination height
 * @param angle - Optional rotation angle in radians
 */
export const drawImage = (
    image:  CanvasImageSource,
    sx:     number,
    sy:     number,
    sw:     number,
    sh:     number,
    dx:     number,
    dy:     number,
    dw:     number,
    dh:     number,
    angle?: number,
) => {
    const context = assertContext();

    if (!angle) {
        context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        return;
    }

    context.save();
    context.translate(dx + dw / 2, dy + dh / 2);
    context.rotate(angle);
    context.drawImage(image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
    context.restore();
};

/**
 * Translates the coordinate system.
 *
 * @param x - Horizontal translation
 * @param y - Vertical translation
 */
export const translate = (x: number, y: number) => {
    const context = assertContext();

    context.translate(x, y);
};

/**
 * Rotates the coordinate system.
 *
 * @param angle - Rotation angle in radians
 */
export const rotate = (angle: number) => {
    const context = assertContext();

    context.rotate(angle);
};

/**
 * Scales the coordinate system.
 *
 * @param x - Horizontal scale factor
 * @param y - Vertical scale factor
 */
export const scale = (x: number, y: number) => {
    const context = assertContext();

    context.scale(x, y);
};

/**
 * Gets the current transformation matrix.
 *
 * @returns The current DOMMatrix transformation
 */
export const getTransform = () => {
    const context = assertContext();

    return context.getTransform();
};

/**
 * Resets the rendering context to its default state.
 */
export const reset = () => {
    const context = assertContext();

    context.reset();
};
