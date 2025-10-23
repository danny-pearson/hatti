import EventEmitter from '../EventEmitter.js';
import type Surface from '../render/Surface.js';

/**
 * Event declarations for mouse events.
 */
export interface MouseEventsDecl {
    [key: string]: object;

    'left-button-pressed': object;
}

/**
 * Manages mouse input state, position tracking, and dragging.
 *
 * Tracks mouse position in multiple coordinate systems (screen, NDC, world),
 * button states, and provides drag functionality with automatic coordinate transforms.
 *
 * **Note**: Requires an HTMLCanvasElement - does not work with OffscreenCanvas.
 *
 * @example
 * ```ts
 * const surface = new Surface(canvas);
 * const mouse = new MouseModule(surface);
 *
 * // In your game loop:
 * console.log(`Mouse at: ${mouse.x}, ${mouse.y}`);
 * console.log(`World coords: ${mouse.worldX}, ${mouse.worldY}`);
 *
 * if (mouse.isLeftButtonDown) {
 *     // Handle click
 * }
 *
 * if (mouse.isDragging) {
 *     // Handle drag from (dragStartX, dragStartY)
 * }
 * ```
 */
class MouseModule {
    /** Mouse X position in screen/canvas coordinates */
    public x: number;

    /** Mouse Y position in screen/canvas coordinates */
    public y: number;

    /** Mouse X position in normalized device coordinates (-1 to 1) */
    public ndcX: number;

    /** Mouse Y position in normalized device coordinates (-1 to 1) */
    public ndcY: number;

    /** Mouse X position in world coordinates (accounting for transforms) */
    public worldX: number;

    /** Mouse Y position in world coordinates (accounting for transforms) */
    public worldY: number;

    /** World X coordinate where the current drag started */
    public dragStartX: number;

    /** World Y coordinate where the current drag started */
    public dragStartY: number;

    /** Scroll wheel direction (-1, 0, 1) */
    public scrollDirection: number;

    /** Whether the left mouse button is currently pressed */
    public isLeftButtonDown: boolean;

    /** Whether the right mouse button is currently pressed */
    public isRightButtonDown: boolean;

    /** Whether the mouse is currently being dragged */
    public isDragging: boolean;

    private surface: Surface;

    private events: EventEmitter<MouseEventsDecl>;

    private buttonPressed: Set<number>;

    /**
     * Creates a new mouse input module for the given surface.
     *
     * @param surface - The rendering surface to track mouse input on
     * @throws Error if surface uses OffscreenCanvas instead of HTMLCanvasElement
     */
    public constructor(surface: Surface) {
        if (!(surface.el instanceof HTMLCanvasElement)) {
            throw new Error('[MouseModule]: Surface requires HTMLCanvasElement, got OffscreenCanvas');
        }

        this.x = 0;
        this.y = 0;

        this.ndcX = 0;
        this.ndcY = 0;

        this.worldX = 0;
        this.worldY = 0;

        this.dragStartX = 0;
        this.dragStartY = 0;

        this.scrollDirection = 0;

        this.isLeftButtonDown = false;
        this.isRightButtonDown = false;

        this.isDragging = false;

        this.surface = surface;

        this.events = new EventEmitter();

        this.buttonPressed = new Set();

        this.initListeners();
    }

    /**
     * Transforms screen coordinates to world coordinates.
     *
     * Applies the inverse of the canvas rendering context's current transform
     * to convert from screen space to world space.
     *
     * @param   x - Screen X coordinate
     * @param   y - Screen Y coordinate
     * @returns     DOMPoint with world coordinates
     */
    public getTransformedPoint(x: number, y: number) {
        const originalPoint = new DOMPoint(x, y);

        return this.surface.context
            .getTransform()
            .invertSelf()
            .transformPoint(originalPoint);
    }

    /**
     * Checks if a mouse button is currently held down.
     *
     * @param   button - Button number (0=left, 1=middle, 2=right)
     * @returns          True if the button is currently pressed
     */
    public isButtonDown(button: number): boolean {
        if (button === 0) return this.isLeftButtonDown;
        if (button === 2) return this.isRightButtonDown;
        return false;
    }

    /**
     * Checks if a mouse button was pressed this frame (single frame detection).
     *
     * @param   button - Button number (0=left, 1=middle, 2=right)
     * @returns          True if the button was just pressed (not held)
     */
    public isButtonPressed(button: number): boolean {
        return this.buttonPressed.has(button);
    }

    /**
     * Registers an event listener for mouse events.
     *
     * @param args - Event name and callback function
     *
     * @example
     * ```ts
     * mouse.on('left-button-pressed', () => {
     *     console.log('Left button clicked!');
     * });
     * ```
     */
    public on(...args: Parameters<typeof this.events.listen>) {
        this.events.listen(...args);
    }

    /**
     * Initializes mouse event listeners on the canvas element.
     *
     * Tracks mousedown, mouseup, and mousemove events, updating position
     * in multiple coordinate systems and handling drag detection.
     */
    private initListeners() {
        const { surface } = this;
        const canvas = surface.el as HTMLCanvasElement;

        canvas.addEventListener('mousedown', (event) => {
            const button = event.button;

            this.isLeftButtonDown = button === 0;
            this.isRightButtonDown = button === 2;

            if (!this.buttonPressed.has(button)) {
                this.buttonPressed.add(button);

                requestAnimationFrame(() => {
                    this.buttonPressed.delete(button);
                });
            }

            this.dragStartX = this.worldX;
            this.dragStartY = this.worldY;
        });

        canvas.addEventListener('mouseup', () => {
            this.isLeftButtonDown = false;
            this.isRightButtonDown = false;

            this.isDragging = false;
        });

        canvas.addEventListener('mousemove', (event) => {
            const internalX = Math.round(event.offsetX * (surface.el.width / surface.realWidth));
            const internalY = Math.round(event.offsetY * (surface.el.height / surface.realHeight));

            this.x = internalX;
            this.y = internalY;

            this.ndcX = (internalX / surface.width) * 2 - 1;
            this.ndcY = 1 - (internalY / surface.height) * 2;

            const p = this.getTransformedPoint(internalX, internalY);

            this.worldX = p.x;
            this.worldY = p.y;

            if (this.isLeftButtonDown) {
                const dx = this.worldX - this.dragStartX;
                const dy = this.worldY - this.dragStartY;

                if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                    this.isDragging = true;

                    requestAnimationFrame(() => {
                        surface.context.translate(dx, dy);
                    });
                }
            }
        });
    }
}

export default MouseModule;
