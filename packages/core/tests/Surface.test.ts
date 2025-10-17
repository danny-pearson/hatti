import {
    describe, it, expect, beforeEach, vi,
} from 'vitest';
import Surface from '../dist/render/Surface.js';

/**
 * Tests for the Surface class.
 *
 * Note: These tests run in a jsdom environment to provide DOM APIs.
 */
describe('Surface', () => {
    describe('Constructor: width and height', () => {
        it('should create an HTMLCanvasElement with specified dimensions', () => {
            const surface = new Surface(800, 600);

            expect(surface.el).toBeInstanceOf(HTMLCanvasElement);
            expect(surface.width).toBe(800);
            expect(surface.height).toBe(600);
            expect(surface.realWidth).toBe(800);
            expect(surface.realHeight).toBe(600);
            expect(surface.scaleFactor).toBe(1);
        });

        it('should create a CanvasContext', () => {
            const surface = new Surface(800, 600);

            expect(surface.context).toBeDefined();
            expect(surface.context.width).toBe(800);
            expect(surface.context.height).toBe(600);
        });

        it('should have events for HTMLCanvasElement', () => {
            const surface = new Surface(800, 600);

            expect(surface.events).toBeDefined();
        });
    });

    describe('Constructor: width, height, and offscreen flag', () => {
        it('should create an OffscreenCanvas when offscreen is true', () => {
            const surface = new Surface(800, 600, true);

            expect(surface.el).toBeInstanceOf(OffscreenCanvas);
            expect(surface.width).toBe(800);
            expect(surface.height).toBe(600);
            expect(surface.realWidth).toBe(800);
            expect(surface.realHeight).toBe(600);
            expect(surface.scaleFactor).toBe(1);
        });

        it('should not have events for OffscreenCanvas', () => {
            const surface = new Surface(800, 600, true);

            expect(surface.events).toBeUndefined();
        });

        it('should create HTMLCanvasElement when offscreen is false', () => {
            const surface = new Surface(800, 600, false);

            expect(surface.el).toBeInstanceOf(HTMLCanvasElement);
            expect(surface.events).toBeDefined();
        });

        it('should create HTMLCanvasElement when offscreen is undefined', () => {
            const surface = new Surface(800, 600);

            expect(surface.el).toBeInstanceOf(HTMLCanvasElement);
            expect(surface.events).toBeDefined();
        });
    });

    describe('Constructor: existing canvas element', () => {
        it('should wrap an existing HTMLCanvasElement', () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 768;

            const surface = new Surface(canvas);

            expect(surface.el).toBe(canvas);
            expect(surface.width).toBe(1024);
            expect(surface.height).toBe(768);
            expect(surface.realWidth).toBe(1024);
            expect(surface.realHeight).toBe(768);
            expect(surface.scaleFactor).toBe(1);
            expect(surface.events).toBeDefined();
        });

        it('should wrap an existing OffscreenCanvas', () => {
            const canvas = new OffscreenCanvas(1024, 768);

            const surface = new Surface(canvas);

            expect(surface.el).toBe(canvas);
            expect(surface.width).toBe(1024);
            expect(surface.height).toBe(768);
            expect(surface.realWidth).toBe(1024);
            expect(surface.realHeight).toBe(768);
            expect(surface.scaleFactor).toBe(1);
            expect(surface.events).toBeUndefined();
        });
    });

    describe('Constructor: DOM element container', () => {
        let container: HTMLDivElement;

        beforeEach(() => {
            container = document.createElement('div');
            document.body.appendChild(container);
        });

        it('should create a canvas and append it to a container element', () => {
            const surface = new Surface(container, 640, 480);

            expect(surface.el).toBeInstanceOf(HTMLCanvasElement);
            expect(surface.width).toBe(640);
            expect(surface.height).toBe(480);
            expect(container.contains(surface.el as HTMLCanvasElement)).toBe(true);
            expect(surface.events).toBeDefined();
        });

        it('should not call computeFullscreen automatically', () => {
            const surface = new Surface(container, 800, 600);

            // Should use original dimensions, not scaled
            expect(surface.scaleFactor).toBe(1);
            expect(surface.realWidth).toBe(800);
            expect(surface.realHeight).toBe(600);
        });
    });

    describe('getContext', () => {
        it('should return the CanvasContext instance', () => {
            const surface = new Surface(800, 600);
            const context = surface.getContext();

            expect(context).toBe(surface.context);
            expect(context.width).toBe(800);
            expect(context.height).toBe(600);
        });
    });

    describe('setFullscreen', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1920,
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 1080,
            });
        });

        it('should enable fullscreen mode and scale canvas', () => {
            const surface = new Surface(800, 600);
            surface.setFullscreen(true);

            const scaleX = 1920 / 800;
            const scaleY = 1080 / 600;
            const expectedScale = Math.min(scaleX, scaleY);

            expect(surface.isFullscreen).toBe(true);
            expect(surface.scaleFactor).toBe(expectedScale);
            expect(surface.realWidth).toBe(800 * expectedScale);
            expect(surface.realHeight).toBe(600 * expectedScale);
        });

        it('should center canvas when fullscreen is enabled', () => {
            const surface = new Surface(800, 600);
            surface.setFullscreen(true);

            const canvas = surface.el as HTMLCanvasElement;
            const expectedLeft = (1920 - surface.realWidth) / 2;
            const expectedTop = (1080 - surface.realHeight) / 2;

            expect(canvas.style.left).toBe(`${expectedLeft}px`);
            expect(canvas.style.top).toBe(`${expectedTop}px`);
            expect(canvas.style.position).toBe('absolute');
        });

        it('should disable fullscreen mode and reset styles', () => {
            const surface = new Surface(800, 600);
            surface.setFullscreen(true);
            surface.setFullscreen(false);

            const canvas = surface.el as HTMLCanvasElement;

            expect(surface.isFullscreen).toBe(false);
            expect(surface.scaleFactor).toBe(1);
            expect(surface.realWidth).toBe(800);
            expect(surface.realHeight).toBe(600);
            expect(canvas.style.position).toBe('');
            expect(canvas.style.left).toBe('');
            expect(canvas.style.top).toBe('');
        });

        it('should return the Surface instance for chaining', () => {
            const surface = new Surface(800, 600);
            const result = surface.setFullscreen(true);

            expect(result).toBe(surface);
        });

        it('should warn when called on OffscreenCanvas', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const surface = new Surface(800, 600, true);

            surface.setFullscreen(true);

            expect(consoleSpy).toHaveBeenCalledWith(
                '[Surface::setFullscreen]: Only available for HTMLCanvasElement, not OffscreenCanvas',
            );

            consoleSpy.mockRestore();
        });

        it('should do nothing if already in the desired state', () => {
            const surface = new Surface(800, 600);
            surface.setFullscreen(true);

            const firstScale = surface.scaleFactor;

            surface.setFullscreen(true); // Already enabled

            expect(surface.scaleFactor).toBe(firstScale);
        });
    });

    describe('computeFullscreen', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1920,
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 1080,
            });
        });

        it('should warn if called without enabling fullscreen mode first', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const surface = new Surface(800, 600);

            surface.computeFullscreen();

            expect(consoleSpy).toHaveBeenCalledWith(
                '[Surface::computeFullscreen]: Fullscreen mode is not enabled. Call setFullscreen(true) first',
            );

            consoleSpy.mockRestore();
        });

        it('should recalculate dimensions when called manually', () => {
            const surface = new Surface(800, 600);
            surface.setFullscreen(true);

            // Change window size
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 1280,
            });
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 720,
            });

            surface.computeFullscreen();

            const scaleX = 1280 / 800;
            const scaleY = 720 / 600;
            const expectedScale = Math.min(scaleX, scaleY);

            expect(surface.scaleFactor).toBe(expectedScale);
        });

        it('should warn when called on OffscreenCanvas', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const surface = new Surface(800, 600, true);

            surface.computeFullscreen();

            expect(consoleSpy).toHaveBeenCalledWith(
                '[Surface::computeFullscreen]: Only available for HTMLCanvasElement, not OffscreenCanvas',
            );

            consoleSpy.mockRestore();
        });
    });

    describe('width and height getters', () => {
        it('should return canvas width and height', () => {
            const surface = new Surface(1024, 768);

            expect(surface.width).toBe(1024);
            expect(surface.height).toBe(768);
        });

        it('should return OffscreenCanvas width and height', () => {
            const surface = new Surface(640, 480, true);

            expect(surface.width).toBe(640);
            expect(surface.height).toBe(480);
        });
    });

    describe('Integration: Different initialization patterns', () => {
        it('should work with all constructor patterns', () => {
            // Pattern 1: width, height
            const surface1 = new Surface(800, 600);
            expect(surface1.el).toBeInstanceOf(HTMLCanvasElement);

            // Pattern 2: width, height, offscreen
            const surface2 = new Surface(800, 600, true);
            expect(surface2.el).toBeInstanceOf(OffscreenCanvas);

            // Pattern 3: existing canvas
            const canvas = document.createElement('canvas');
            const surface3 = new Surface(canvas);
            expect(surface3.el).toBe(canvas);

            // Pattern 4: DOM container
            const div = document.createElement('div');
            const surface4 = new Surface(div, 800, 600);
            expect(surface4.el).toBeInstanceOf(HTMLCanvasElement);
            expect(div.contains(surface4.el as HTMLCanvasElement)).toBe(true);
        });
    });
});
