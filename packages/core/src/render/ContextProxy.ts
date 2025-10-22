/**
 * Type alias for the 2D rendering context instance.
 */
type ContextPoxyInstance = CanvasRenderingContext2D;

/**
 * Constructor interface for creating 2D rendering contexts from canvas elements.
 */
interface ContextProxyConstructor {
    prototype: ContextPoxyInstance;
    new(canvas: HTMLCanvasElement | OffscreenCanvas): ContextPoxyInstance;
};

/**
 * Proxied constructor that creates a 2D context with willReadFrequently enabled.
 *
 * This proxy intercepts context creation to automatically configure optimal settings.
 */
const $ContextProxy = new Proxy<ContextProxyConstructor>(
    CanvasRenderingContext2D, {
        construct(_, args) {
            const [canvas] = args;

            if (!canvas) {
                throw new TypeError(
                    'ContextProxy must be passed an HTMLCanvasElement or OffscreenCanvas.',
                );
            }

            return canvas.getContext('2d', { willReadFrequently: true });
        },
    },
);

/**
 * Abstract base class for custom 2D rendering contexts.
 *
 * Extends CanvasRenderingContext2D through a proxy to enable inheritance from
 * built-in browser types. Subclasses can add custom rendering methods and utilities.
 */
abstract class ContextProxy extends $ContextProxy implements CanvasRenderingContext2D {
    /**
     * Creates a new context proxy for the given canvas element.
     *
     * @param canvas - The HTMLCanvasElement or OffscreenCanvas to create a context for
     */
    public constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
        const proxiedContext = super(canvas);

        Object.setPrototypeOf(proxiedContext, new.target.prototype);
    }
}

export default ContextProxy;
