import { FILL, STROKE } from './flags.js';
import { TAU, clamp } from '@hatti/math';
import { Bitmask } from '@hatti/bitwise';
import ContextProxy from './ContextProxy';
import type { ConstEnum } from '@hatti/shared';
// import ImageBuffer from './ImageBuffer.js';

/**
 * Vertex kinds for custom shape rendering.
 */
const VertexKind = {
    NORMAL: 0,
    CURVE:  1,
    BEZIER: 2,
} as const;

/**
 * Tuple representing a shape vertex with position and kind.
 */
type ShapeVertex = [x: number, y: number, kind: ConstEnum<typeof VertexKind>];

/**
 * Extended 2D rendering context with custom shape drawing and coordinate system utilities.
 *
 * Provides Processing-like shape API (beginShape/vertex/endShape), virtual coordinate systems,
 * zoom controls, and convenience methods for common shapes (circle, triangle, pentagon, etc.).
 */
class CanvasContext extends ContextProxy implements CanvasRenderingContext2D {
    public readonly width: number;

    public readonly height: number;

    public curveTension: number;

    public zoom: number;

    private _virtualWidth?: number;

    private _currentShape: ShapeVertex[] | null;

    private _debugShapeVertices: boolean;

    private _clearColor: string | null;

    /**
     * Creates a new extended rendering context for the given canvas.
     *
     * @param canvas - The HTMLCanvasElement or OffscreenCanvas to render to
     */
    constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
        super(canvas);

        this.width = canvas.width;
        this.height = canvas.height;

        this.curveTension = 0;

        this.zoom = 1;

        this.setZoom(this.zoom);

        this._currentShape = null;
        this._debugShapeVertices = false;
        this._clearColor = null;

        this.imageSmoothingEnabled = false;

        this.lineCap = 'round';
    }

    /**
     * Draws a rectangle centered at the given position.
     *
     * @param x      - X coordinate of rectangle center
     * @param y      - Y coordinate of rectangle center
     * @param width  - Width of the rectangle
     * @param height - Height of the rectangle
     * @param flags  - Optional FILL and/or STROKE flags
     */
    public override rect(x: number, y: number, width: number, height: number, flags?: number) {
        this.save();
        this.beginPath();
        this.translate(-width / 2, -height / 2);
        super.rect(x, y, width, height);
        this.restore();

        if (typeof flags !== 'undefined') {
            if (Bitmask.hasAny(flags, FILL)) this.fill();
            if (Bitmask.hasAny(flags, STROKE)) this.stroke();
        }
    }

    /**
     * Draws a circle at the given position.
     *
     * @param x      - X coordinate of circle center
     * @param y      - Y coordinate of circle center
     * @param radius - Radius of the circle
     * @param flags  - Optional FILL and/or STROKE flags
     */
    public circle(
        x: number,
        y: number,
        radius: number,
        flags?: number,
    ): void {
        this.beginPath();
        this.arc(x, y, radius, 0, TAU);

        if (typeof flags !== 'undefined') {
            if (Bitmask.hasAny(flags, FILL)) this.fill();
            if (Bitmask.hasAny(flags, STROKE)) this.stroke();
        }
    };

    /**
     * Draws an equilateral triangle centered at the given position.
     *
     * @param x        - X coordinate of triangle center
     * @param y        - Y coordinate of triangle center
     * @param radius   - Radius from center to vertices
     * @param rotation - Optional rotation in radians (default: 0, pointing up)
     * @param flags    - Optional FILL and/or STROKE flags
     */
    public triangle(
        x: number,
        y: number,
        radius: number,
        rotation = 0,
        flags?: number,
    ): void {
        this.beginShape();

        for (let i = 0; i < 3; i++) {
            const theta = rotation + (Math.PI / 2) - i * (TAU / 3);

            const _x = x + radius * Math.cos(theta);
            const _y = y + radius * Math.sin(theta);

            this.vertex(_x, _y);
        }

        this.endShape(flags);
    }

    /**
     * Draws a regular pentagon centered at the given position.
     *
     * @param x      - X coordinate of pentagon center
     * @param y      - Y coordinate of pentagon center
     * @param radius - Radius from center to vertices
     * @param flags  - Optional FILL and/or STROKE flags
     */
    public pentagon(
        x: number, y: number, radius: number, flags?: number,
    ): void {
        this.beginShape();

        for (let i = 0; i < 5; i++) {
            const theta = (Math.PI / 2) - i * ((2 * Math.PI) / 5);

            const _x = x + radius * Math.cos(theta);
            const _y = y + radius * Math.sin(theta);

            this.vertex(_x, _y);
        }

        this.endShape(flags);
    }

    /**
     * Draws a regular hexagon centered at the given position.
     *
     * @param x      - X coordinate of hexagon center
     * @param y      - Y coordinate of hexagon center
     * @param radius - Radius from center to vertices
     * @param flags  - Optional FILL and/or STROKE flags
     */
    public hexagon(
        x: number, y: number, radius: number, flags?: number,
    ): void {
        this.beginShape();

        for (let i = 0; i < 6; i++) {
            const theta = i * (Math.PI / 3);

            const _x = x + radius * Math.cos(theta);
            const _y = y + radius * Math.sin(theta);

            this.vertex(_x, _y);
        }

        this.endShape(flags);
    }

    /**
     * Draws a capsule shape (rounded rectangle) at the given position.
     *
     * @param x      - X coordinate of capsule center
     * @param y      - Y coordinate of capsule center
     * @param width  - Width of the capsule (clamped to 75% of height)
     * @param height - Height of the capsule
     * @param flags  - Optional FILL and/or STROKE flags
     */
    public capsule(x: number, y: number, width: number, height: number, flags?: number) {
        this.beginPath();

        const _width = clamp(width, 0, height * 0.75);

        this.arc(x, y + height - _width, _width, 0, Math.PI);
        this.arc(x, y - height + _width, _width, Math.PI, 0);
        this.lineTo(x + width, y + height - _width);

        if (typeof flags !== 'undefined') {
            if (Bitmask.hasAny(flags, FILL)) this.fill();
            if (Bitmask.hasAny(flags, STROKE)) this.stroke();
        }
    }

    /**
     * Enables or disables debug visualization of shape vertices.
     *
     * @param value - Whether to draw debug circles at each vertex
     */
    public debugShape(value: boolean) {
        this._debugShapeVertices = value;
    }

    /**
     * Begins a new custom shape.
     *
     * Call vertex methods to add points, then endShape to render.
     */
    public beginShape() {
        this._currentShape = [];

        this.beginPath();
    }

    /**
     * Ends and renders the current custom shape.
     *
     * @param flags - Optional FILL and/or STROKE flags
     */
    public endShape(flags?: number) {
        if (!this._currentShape) return;

        if (this._currentShape.length < 3) {
            return;
        }

        const points = this._currentShape;
        const firstPoint = points[0];
        const secondPoint = points[1];

        if (!firstPoint || !secondPoint) return;

        points.push(firstPoint);

        this.moveTo(secondPoint[0], secondPoint[1]);

        for (let i = 1; i < points.length - 1; i++) {
            const currentPoint = points[i];
            const nextPoint = points[i + 1];

            if (!currentPoint || !nextPoint) continue;

            if (currentPoint[2] === VertexKind.NORMAL) {
                this.lineTo(nextPoint[0], nextPoint[1]);
                continue;
            }

            if (currentPoint[2] === VertexKind.CURVE) {
                if (i + 2 >= points.length) break;

                const p0 = points[i - 1] || currentPoint;
                const p1 = currentPoint;
                const p2 = nextPoint;
                const p3 = points[i + 2] || p2;

                const tension = 1 - this.curveTension;

                const cp1x = p1[0] + (p2[0] - p0[0]) * tension / 6;
                const cp1y = p1[1] + (p2[1] - p0[1]) * tension / 6;
                const cp2x = p2[0] - (p3[0] - p1[0]) * tension / 6;
                const cp2y = p2[1] - (p3[1] - p1[1]) * tension / 6;

                this.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
                continue;
            }
        }

        this.closePath();

        this._currentShape = null;

        if (typeof flags !== 'undefined') {
            if (Bitmask.hasAny(flags, FILL)) this.fill();
            if (Bitmask.hasAny(flags, STROKE)) this.stroke();
        }

        if (this._debugShapeVertices) {
            this.save();

            for (const point of points.slice(0, -1)) {
                this.fillStyle = '#f00';
                this.circle(point[0], point[1], 4, FILL);
            }

            this.restore();
        }
    }

    /**
     * Adds a normal vertex to the current shape.
     *
     * @param x - X coordinate of the vertex
     * @param y - Y coordinate of the vertex
     */
    public vertex(x: number, y: number) {
        if (!this._currentShape) return;

        this._currentShape.push([x, y, VertexKind.NORMAL]);
    }

    /**
     * Adds a curve vertex to the current shape using Catmull-Rom interpolation.
     *
     * @param x - X coordinate of the vertex
     * @param y - Y coordinate of the vertex
     */
    public curveVertex(x: number, y: number) {
        if (!this._currentShape) return;

        this._currentShape.push([x, y, VertexKind.CURVE]);
    }

    /**
     * Adds a bezier curve vertex to the current shape.
     *
     * @param x - X coordinate of the vertex
     * @param y - Y coordinate of the vertex
     */
    public bezierVertex(x: number, y: number) {
        if (!this._currentShape) return;

        this._currentShape.push([x, y, VertexKind.BEZIER]);
    }

    /**
     * Sets up a virtual coordinate system with a specified width.
     *
     * The height is calculated based on aspect ratio. Transforms the canvas so (0,0)
     * is at the center and Y-axis points up.
     *
     * @param width - The virtual width of the coordinate system
     */
    public useVirtualCoordinates(width: number) {
        this._virtualWidth = width;

        const virtualHeight = width * this.aspectRatio;

        this.setTransform(this.width / width, 0, 0, -this.height / virtualHeight, this.width / 2, this.height / 2);
    }

    /**
     * Converts screen coordinates to world coordinates accounting for current transform.
     *
     * @param   x - Screen X coordinate
     * @param   y - Screen Y coordinate
     * @returns     DOMPoint with world coordinates
     */
    public getAbsoluteWorldPoint(x: number, y: number) {
        const originalPoint = new DOMPoint(x, y);

        return this
            .getTransform()
            .invertSelf()
            .transformPoint(originalPoint);
    }

    /**
     * Converts virtual coordinates to screen pixel coordinates.
     *
     * @param   x - Virtual X coordinate
     * @param   y - Virtual Y coordinate
     * @returns     Array of [screenX, screenY]
     */
    public virtualCoordsToScreen(x: number, y: number) {
        if (!this._virtualWidth) return [x, y];

        const virtualHeight = this._virtualWidth * this.aspectRatio;

        return [
            (x / this._virtualWidth) * this.width,
            (y / virtualHeight) * this.height,
        ];
    }

    /**
     * Converts world coordinates to screen pixel coordinates.
     *
     * Accounts for virtual coordinate system with centered origin and flipped Y-axis.
     *
     * @param   x - World X coordinate
     * @param   y - World Y coordinate
     * @returns     Array of [screenX, screenY]
     */
    public worldToScreen(x: number, y: number) {
        if (!this._virtualWidth) return [x, y];

        const virtualHeight = this._virtualWidth * this.aspectRatio;

        return [
            ((x + this._virtualWidth / 2) / this._virtualWidth) * this.width,
            ((1 - (y + virtualHeight / 2) / virtualHeight)) * this.height,
        ];
    }

    // public getImageBuffer() {
    //     const imageData = this.getImageData(0, 0, this.width, this.height);

    //     return new ImageBuffer(imageData.data, imageData.width, imageData.height);
    // }

    // public getColorMask(targetColor, threshold) {
    //     const imageBuffer = this.getImageBuffer();

    //     const maskBuffer = new ImageBuffer(imageBuffer.width, imageBuffer.height);

    //     console.log(imageBuffer);

    //     for (const tex of imageBuffer) {
    //         console.log(tex);
    //     }

    //     // for (let y = 0; y < height; y++) {
    //     //     const row = [];

    //     //     for (let x = 0; x < width; x++) {
    //     //         const i = (y * width + x) * 4;
    //     //         const r = data[i];
    //     //         const g = data[i + 1];
    //     //         const b = data[i + 2];

    //     //         const dist = (
    //     //             (r - targetColor.r) ** 2 +
    //     //             (g - targetColor.g) ** 2 +
    //     //             (b - targetColor.b) ** 2
    //     //         );

    //     //         row.push(dist > (threshold ** 2) ? 1 : 0);
    //     //     }

    //     //     mask.push(row);
    //     // }
    // }

    /**
     * Sets the zoom level for the canvas.
     *
     * @param value - The zoom multiplier (1 = normal, 2 = 2x zoom, etc.)
     */
    public setZoom(value: number) {
        this.zoom = value;

        requestAnimationFrame(() => {
            this.scale(value, value);
        });
    }

    /**
     * Sets the clear color used when clearing the canvas.
     *
     * @param color - CSS color string (e.g., '#000000', 'rgb(0,0,0)')
     */
    public setClearColor(color: string) {
        this._clearColor = color;
    }

    /**
     * Sets the line width accounting for virtual coordinates.
     *
     * @param value - Line width in virtual or pixel units
     */
    public setLineWidth(value: number) {
        this.lineWidth = this._virtualWidth
            ? value / (this.width / this._virtualWidth)
            : value;
    }

    /**
     * Clears the canvas.
     *
     * If a clear color is set, fills with that color. Otherwise uses clearRect.
     */
    public clear() {
        if (this._clearColor) {
            this.fillStyle = this._clearColor;
            this.fillRect(0, 0, this.width, this.height);
            return;
        }

        this.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Gets the aspect ratio (height / width) of the canvas.
     *
     * @returns The aspect ratio
     */
    get aspectRatio() {
        return this.height / this.width;
    }
}

export default CanvasContext;

// function createColorMask(imageData, targetColor, threshold = 30) {
//     const mask = [];
//     const { data, width, height } = imageData;

//     console.log(imageData);

//     for (let y = 0; y < height; y++) {
//         const row = [];

//         for (let x = 0; x < width; x++) {
//             const i = (y * width + x) * 4;
//             const r = data[i];
//             const g = data[i + 1];
//             const b = data[i + 2];

//             const dist = (
//                 (r - targetColor.r) ** 2 +
//                 (g - targetColor.g) ** 2 +
//                 (b - targetColor.b) ** 2
//             );

//             row.push(dist > (threshold ** 2) ? 1 : 0);
//         }

//         mask.push(row);
//     }

//     return mask;
// }