import EventEmitter from '../EventEmitter.js';
import CanvasContext from './CanvasContext.js';

/**
 * A wrapper around HTMLCanvasElement or OffscreenCanvas that provides a unified rendering surface.
 *
 * Supports multiple initialisation patterns:
 * - New canvas with dimensions: `new Surface(800, 600)`
 * - New offscreen canvas:       `new Surface(800, 600, true)`
 * - Attach to DOM element:      `new Surface(element, 800, 600)`
 * - Wrap existing canvas:       `new Surface(canvasElement)`
 *
 * For fullscreen canvases, use `setFullscreen()` to enable automatic scaling and resize handling:
 * ```ts
 * const surface = new Surface(container, 800, 600);
 * surface.setFullscreen(true); // Enable fullscreen mode with resize listener
 *
 * Later, you can disable it
 * surface.setFullscreen(false); // Disable fullscreen, remove listener, reset styles
 * ```
 */
class Surface {
    public readonly el:      HTMLCanvasElement | OffscreenCanvas;

    public readonly context: CanvasContext;

    public readonly events?: EventEmitter;

    public realWidth!:       number;

    public realHeight!:      number;

    public scaleFactor!:     number;

    private _isFullscreen:   boolean;

    private _resizeHandler?: VoidFunction;

    constructor(width: number, height: number, offscreen?: boolean);
    constructor(rootEl: Element, width: number, height: number);
    constructor(canvas: HTMLCanvasElement | OffscreenCanvas);
    constructor(
        rootElOrWidthOrCanvas: Element | number | HTMLCanvasElement | OffscreenCanvas,
        widthOrHeight?: number,
        heightOrOffscreen?: number | boolean,
    ) {
        this._isFullscreen = false;

        if (rootElOrWidthOrCanvas instanceof HTMLCanvasElement || rootElOrWidthOrCanvas instanceof OffscreenCanvas) {
            this.el = rootElOrWidthOrCanvas;

            this.realWidth   = this.el.width;
            this.realHeight  = this.el.height;
            this.scaleFactor = 1;

            this.context = new CanvasContext(this.el);

            if (this.el instanceof HTMLCanvasElement) {
                this.events = new EventEmitter();
            }

            return;
        }

        if (rootElOrWidthOrCanvas instanceof Element) {
            if (rootElOrWidthOrCanvas instanceof HTMLCanvasElement) {
                this.el = rootElOrWidthOrCanvas;
            } else {
                this.el = document.createElement('canvas');

                rootElOrWidthOrCanvas.append(this.el);
            }

            this.context = new CanvasContext(this.el);

            const w = widthOrHeight!;
            const h = heightOrOffscreen as number;

            this.el.width  = w;
            this.el.height = h;

            this.realWidth   = w;
            this.realHeight  = h;
            this.scaleFactor = 1;

            this.context = new CanvasContext(this.el);
            this.events  = new EventEmitter();

            return;
        }

        const w         = rootElOrWidthOrCanvas;
        const h         = widthOrHeight!;
        const offscreen = heightOrOffscreen as boolean | undefined;

        if (offscreen) {
            this.el = new OffscreenCanvas(w, h);
        } else {
            this.el = document.createElement('canvas');

            this.el.width  = w;
            this.el.height = h;

            this.events = new EventEmitter();
        }

        this.realWidth   = w;
        this.realHeight  = h;
        this.scaleFactor = 1;

        this.context = new CanvasContext(this.el);
    }

    public getContext() {
        return this.context;
    }

    /**
     * Enables or disables fullscreen mode for the canvas.
     *
     * When enabled, the canvas will scale to fit the window while maintaining aspect ratio
     * and automatically update on window resize.
     *
     * @param   enabled - Whether to enable fullscreen mode
     * @returns           The Surface instance for chaining
     */
    public setFullscreen(enabled: boolean): this {
        if (!(this.el instanceof HTMLCanvasElement)) {
            console.warn('[Surface::setFullscreen]: Only available for HTMLCanvasElement, not OffscreenCanvas');
            return this;
        }

        if (this._isFullscreen === enabled) {
            return this;
        }

        this._isFullscreen = enabled;

        if (enabled) {
            this._resizeHandler = () => this.computeFullscreen();

            window.addEventListener('resize', this._resizeHandler);

            this.computeFullscreen();
        } else {
            if (this._resizeHandler) {
                window.removeEventListener('resize', this._resizeHandler);

                this._resizeHandler = undefined;
            }

            this.scaleFactor = 1;
            this.realWidth   = this.el.width;
            this.realHeight  = this.el.height;

            this.el.style.width    = `${this.el.width}px`;
            this.el.style.height   = `${this.el.height}px`;
            this.el.style.position = '';
            this.el.style.left     = '';
            this.el.style.top      = '';
        }

        return this;
    }

    /**
     * Computes and applies fullscreen scaling to fit the canvas within the window while maintaining aspect ratio.
     *
     * This method is called automatically when fullscreen mode is enabled and the window is resized.
     * You can also call it manually to force a recalculation.
     *
     * Note: This method only works with HTMLCanvasElement, not OffscreenCanvas.
     */
    public computeFullscreen(): void {
        if (!(this.el instanceof HTMLCanvasElement)) {
            console.warn('[Surface::computeFullscreen]: Only available for HTMLCanvasElement, not OffscreenCanvas');
            return;
        }

        if (!this._isFullscreen) {
            console.warn('[Surface::computeFullscreen]: Fullscreen mode is not enabled. Call setFullscreen(true) first');
            return;
        }

        const scaleX = window.innerWidth / this.el.width;
        const scaleY = window.innerHeight / this.el.height;

        this.scaleFactor = Math.min(scaleX, scaleY);

        this.realWidth  = this.el.width * this.scaleFactor;
        this.realHeight = this.el.height * this.scaleFactor;

        this.el.style.width  = `${this.realWidth}px`;
        this.el.style.height = `${this.realHeight}px`;

        this.el.style.position = 'absolute';
        this.el.style.left     = `${(window.innerWidth - this.realWidth) / 2}px`;
        this.el.style.top      = `${(window.innerHeight - this.realHeight) / 2}px`;
    }

    /**
     * Gets the current fullscreen state.
     *
     * @returns True if fullscreen mode is enabled
     */
    public get isFullscreen(): boolean {
        return this._isFullscreen;
    }

    get width() {
        return this.el.width;
    }

    get height() {
        return this.el.height;
    }
}

export default Surface;
