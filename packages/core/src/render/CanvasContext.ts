import { FILL, STROKE } from './flags.js';
import { TAU, clamp } from '@hatti/math';
// import Matrix3 from '../math/Matrix3.js';
import { Bitmask } from '@hatti/bitwise';
import ContextProxy from './ContextProxy';
import type { ConstEnum } from '@hatti/shared';
// import ImageBuffer from './ImageBuffer.js';

// interface CanvasImageData {
//     putImageData(imagedata: ImageData | ImageBuffer, dx: number, dy: number): void;
//     putImageData(imagedata: ImageData | ImageBuffer, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void
// }

// interface CanvasRenderingContext2D extends CanvasImageData { }

const VertexKind = {
    NORMAL: 0,
    CURVE:  1,
    BEZIER: 2,
} as const;

type ShapeVertex = [x: number, y: number, kind: ConstEnum<typeof VertexKind>];

class CanvasContext extends ContextProxy implements CanvasRenderingContext2D {
    public readonly width: number;

    public readonly height: number;

    public curveTension: number;

    // public matrix: Matrix3;

    public zoom: number;

    private _virtualWidth?: number;

    private _isUsingVirtualCoords: boolean;

    private _currentShape: ShapeVertex[] | null;

    private _debugShapeVertices: boolean;

    private _clearColor: string | null;

    constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
        super(canvas);

        this.width = canvas.width;
        this.height = canvas.height;

        this.curveTension = 0;

        // this.matrix = Matrix3.identity();

        this.zoom = 1;

        this.setZoom(this.zoom);

        this._isUsingVirtualCoords = false;
        this._currentShape = null;
        this._debugShapeVertices = false;
        this._clearColor = null;

        this.imageSmoothingEnabled = false;

        this.lineCap = 'round';
    }

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

    public triangle(
        x1: number, y1: number,
        x2: number, y2: number,
        x3: number, y3: number,
        flags?: number,
    ): void {
        this.beginShape();

        this.vertex(x1, y1);
        this.vertex(x2, y2);
        this.vertex(x3, y3);

        this.endShape(flags);
    }

    public quad(
        x1: number, y1: number, x2: number, y2: number,
        x3: number, y3: number, x4: number, y4: number,
        flags?: number,
    ): void {
        this.beginShape();

        this.vertex(x1, y1);
        this.vertex(x2, y2);
        this.vertex(x3, y3);
        this.vertex(x4, y4);

        this.endShape(flags);
    }

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

    public capsule(x: number, y: number, width: number, height: number, flags?: number) {
        this.beginPath();

        const _width = clamp(width, 0, height * 0.75);

        this.arc(x, y + (height) - (_width), _width, 0, Math.PI);
        this.arc(x, y - height + _width, _width, Math.PI, 0);

        if (typeof flags !== 'undefined') {
            if (Bitmask.hasAny(flags, FILL)) this.fill();
            if (Bitmask.hasAny(flags, STROKE)) this.stroke();
        }
    }

    public debugShape(value: boolean) {
        this._debugShapeVertices = value;
    }

    public beginShape() {
        this._currentShape = [];

        this.beginPath();
    }

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

    public vertex(x: number, y: number) {
        if (!this._currentShape) return;

        this._currentShape.push([x, y, VertexKind.NORMAL]);
    }

    public curveVertex(x: number, y: number) {
        if (!this._currentShape) return;

        this._currentShape.push([x, y, VertexKind.CURVE]);
    }

    public bezierVertex(x: number, y: number) {
        if (!this._currentShape) return;

        this._currentShape.push([x, y, VertexKind.BEZIER]);
    }

    public useVirtualCoordinates(width: number) {
        this._isUsingVirtualCoords = true;
        this._virtualWidth = width;

        const virtualHeight = width * this.aspectRatio;

        this.setTransform(this.width / width, 0, 0, -this.height / virtualHeight, this.width / 2, this.height / 2);
    }

    public getAbsoluteWorldPoint(x: number, y: number) {
        const originalPoint = new DOMPoint(x, y);

        return this
            .getTransform()
            .invertSelf()
            .transformPoint(originalPoint);
    }

    public virtualCoordsToScreen(x: number, y: number) {
        if (!this._virtualWidth) return [x, y];

        const virtualHeight = this._virtualWidth * this.aspectRatio;

        return [
            (x / this._virtualWidth) * this.width,
            (y / virtualHeight) * this.height,
        ];
    }

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

    public setZoom(value: number) {
        this.zoom = value;

        requestAnimationFrame(() => {
            this.scale(value, value);
        });
    }

    public setClearColor(color: string) {
        this._clearColor = color;
    }

    public setLineWidth(value: number) {
        this.lineWidth = this._virtualWidth
            ? value / (this.width / this._virtualWidth)
            : value;
    }

    public clear() {
        if (this._clearColor) {
            this.fillStyle = this._clearColor;
            this.fillRect(0, 0, this.width, this.height);
            return;
        }

        this.clearRect(0, 0, this.width, this.height);
    }

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