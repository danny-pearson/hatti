/**
 * Vitest setup file for core package tests.
 *
 * Provides polyfills and mocks for DOM APIs not available in jsdom.
 */
import { vi } from 'vitest';

// Mock CanvasRenderingContext2D for ContextProxy
if (typeof CanvasRenderingContext2D === 'undefined') {
    global.CanvasRenderingContext2D = class CanvasRenderingContext2D {} as any;
}

// Mock OffscreenCanvas (not available in jsdom)
if (typeof OffscreenCanvas === 'undefined') {
    global.OffscreenCanvas = class OffscreenCanvas {
        public width: number;
        public height: number;

        constructor(width: number, height: number) {
            this.width = width;
            this.height = height;
        }

        getContext(_contextId: string, _options?: any): any {
            if (_contextId === '2d') {
                return createMockContext(this);
            }
            return null;
        }

        convertToBlob(_options?: any): Promise<Blob> {
            return Promise.resolve(new Blob());
        }

        transferToImageBitmap(): ImageBitmap {
            return {} as ImageBitmap;
        }
    } as any;
}

// Helper to create a mock 2D context
function createMockContext(canvas: any) {
    return {
        canvas,
        fillStyle: '#000000',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        globalAlpha: 1,
        globalCompositeOperation: 'source-over',
        imageSmoothingEnabled: true,
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        direction: 'ltr',

        save: vi.fn(),
        restore: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        translate: vi.fn(),
        transform: vi.fn(),
        setTransform: vi.fn(),
        resetTransform: vi.fn(),
        getTransform: vi.fn(() => new DOMMatrix()),

        beginPath: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        bezierCurveTo: vi.fn(),
        quadraticCurveTo: vi.fn(),
        arc: vi.fn(),
        arcTo: vi.fn(),
        ellipse: vi.fn(),
        rect: vi.fn(),

        fill: vi.fn(),
        stroke: vi.fn(),
        clip: vi.fn(),
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        clearRect: vi.fn(),

        fillText: vi.fn(),
        strokeText: vi.fn(),
        measureText: vi.fn(() => ({ width: 0 })),

        drawImage: vi.fn(),
        createImageData: vi.fn(),
        getImageData: vi.fn(() => ({
            data: new Uint8ClampedArray(0),
            width: 0,
            height: 0,
        })),
        putImageData: vi.fn(),

        createLinearGradient: vi.fn(),
        createRadialGradient: vi.fn(),
        createPattern: vi.fn(),

        isPointInPath: vi.fn(() => false),
        isPointInStroke: vi.fn(() => false),
    };
}

// Enhance HTMLCanvasElement.getContext to return a proper mock
const originalGetContext = HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, _options?: any): any {
    if (contextId === '2d') {
        return createMockContext(this);
    }

    return originalGetContext.call(this, contextId, _options);
} as any;

// Mock OffscreenCanvas.getContext (after the class is defined)
if (typeof OffscreenCanvas !== 'undefined') {
    OffscreenCanvas.prototype.getContext = function (this: OffscreenCanvas, contextId: string, _options?: any): any {
        if (contextId === '2d') {
            return createMockContext(this);
        }

        return null;
    } as any;
}

// Patch Image to auto-trigger load events for testing
if (typeof Image !== 'undefined') {
    const originalImageSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    const originalImageSrcSet = originalImageSrcDescriptor?.set;

    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set(this: HTMLImageElement, value: string) {
            originalImageSrcSet?.call(this, value);

            // Set dimensions for testing
            Object.defineProperty(this, 'naturalWidth', { value: 100, writable: true });
            Object.defineProperty(this, 'naturalHeight', { value: 100, writable: true });

            // Auto-trigger load event asynchronously
            setTimeout(() => {
                this.dispatchEvent(new Event('load'));
            }, 0);
        },
        get(this: HTMLImageElement) {
            return originalImageSrcDescriptor?.get?.call(this) || '';
        },
    });
}

// Mock global fetch for ImageLoader tests
if (typeof fetch === 'undefined' || !vi.isMockFunction(fetch)) {
    global.fetch = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
        const mockBlob = new Blob(['fake image data'], { type: 'image/png' });

        return Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            blob: async () => mockBlob,
        } as Response);
    });
}

// Mock createImageBitmap (not available in jsdom)
if (typeof createImageBitmap === 'undefined') {
    global.createImageBitmap = vi.fn(async (_image: ImageBitmapSource, _options?: ImageBitmapOptions) => {
        return Promise.resolve({
            width: 100,
            height: 100,
            close: vi.fn(),
        } as unknown as ImageBitmap);
    }) as typeof createImageBitmap;
}
