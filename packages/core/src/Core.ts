import type Surface from './render/Surface.js';

type Core = {
    mainSurface:  Surface | null;
    renderTarget: Surface | null;
};

const core: Core = {
    mainSurface:  null,
    renderTarget: null,
};

/**
 * Initializes the core rendering system with the main surface.
 *
 * Sets both the main surface and initial render target. Should be called
 * once at application startup before rendering.
 *
 * @param surface - The main rendering surface
 */
export const init = (surface: Surface) => {
    if (core.mainSurface) return;

    core.mainSurface = surface;

    if (core.renderTarget) return;

    core.renderTarget = surface;
};

/**
 * Gets the current render target's context, throwing if not set.
 *
 * @returns The rendering context
 * @throws  Error if render target is not initialized
 */
export const assertContext = () => {
    if (!core.renderTarget) {
        throw new Error('[Core::assertContext]: Render target not set.');
    }

    return core.renderTarget.getContext();
};

/**
 * Gets the current render target surface.
 *
 * @returns The current render target
 * @throws  Error if render target is not initialized
 */
export const getRenderTarget = (): Surface => {
    if (!core.renderTarget) {
        throw new Error('[Core::getRenderTarget]: Render target not set.');
    }

    return core.renderTarget;
};

/**
 * Sets the current render target surface.
 *
 * Allows rendering to different surfaces (e.g., off-screen buffers).
 *
 * @param surface - The surface to use as the render target
 */
export const setRenderTarget = (surface: Surface): void => {
    core.renderTarget = surface;
};

/**
 * Gets the main rendering surface.
 *
 * @returns The main surface
 * @throws  Error if core is not initialized
 */
export const getMainSurface = (): Surface => {
    if (!core.mainSurface) {
        throw new Error('[Core::mainSurface]: Render target not set.');
    }

    return core.mainSurface;
};
