type ContextPoxyInstance = CanvasRenderingContext2D;

interface ContextProxyConstructor {
    prototype: ContextPoxyInstance;
    new(canvas: HTMLCanvasElement | OffscreenCanvas): ContextPoxyInstance;
};

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

abstract class ContextProxy extends $ContextProxy implements CanvasRenderingContext2D {
    public constructor(canvas: HTMLCanvasElement | OffscreenCanvas) {
        const proxiedContext = super(canvas);

        Object.setPrototypeOf(proxiedContext, new.target.prototype);
    }
}

export default ContextProxy;
