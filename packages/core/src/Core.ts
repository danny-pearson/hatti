import type Surface from './render/Surface.js';

type Core = {
    mainSurface:  Surface | null;
    renderTarget: Surface | null;
};

const core: Core = {
    mainSurface:  null,
    renderTarget: null,
};

export const init = (surface: Surface) => {
    if (core.mainSurface) return;

    core.mainSurface = surface;

    if (core.renderTarget) return;

    core.renderTarget = surface;
};

export const assertContext = () => {
    if (!core.renderTarget) {
        throw new Error('[Core::assertContext]: Render target not set.');
    }

    return core.renderTarget.getContext();
};

export const getRenderTarget = (): Surface => {
    if (!core.renderTarget) {
        throw new Error('[Core::getRenderTarget]: Render target not set.');
    }

    return core.renderTarget;
};

export const setRenderTarget = (surface: Surface): void => {
    core.renderTarget = surface;
};

export const getMainSurface = (): Surface => {
    if (!core.mainSurface) {
        throw new Error('[Core::mainSurface]: Render target not set.');
    }

    return core.mainSurface;
};
