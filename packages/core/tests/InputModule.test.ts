import {
    describe, it, expect, beforeEach, afterEach, vi,
} from 'vitest';
import InputModule from '../dist/input/InputModule.js';
import KeyboardModule from '../dist/input/KeyboardModule.js';
import MouseModule from '../dist/input/MouseModule.js';
import Surface from '../dist/render/Surface.js';

describe('InputModule', () => {
    let keyboard: KeyboardModule;
    let mouse: MouseModule;
    let input: InputModule;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        document.body.appendChild(canvas);

        keyboard = new KeyboardModule();
        const surface = new Surface(canvas);
        mouse = new MouseModule(surface);
        input = new InputModule(keyboard, mouse);
    });

    afterEach(() => {
        keyboard.destroy();
        input.destroy();
        document.body.removeChild(canvas);
    });

    describe('bindAction', () => {
        it('should bind a key action', () => {
            input.bindAction('jump', { keys: ['Space'] });

            const event = new KeyboardEvent('keydown', { key: 'Space' });
            window.dispatchEvent(event);

            expect(input.isActionDown('jump')).toBe(true);
        });

        it('should bind multiple keys to one action', () => {
            input.bindAction('jump', { keys: ['Space', 'w'] });

            const event1 = new KeyboardEvent('keydown', { key: 'Space' });
            window.dispatchEvent(event1);
            expect(input.isActionDown('jump')).toBe(true);

            const upEvent = new KeyboardEvent('keyup', { key: 'Space' });
            window.dispatchEvent(upEvent);

            const event2 = new KeyboardEvent('keydown', { key: 'w' });
            window.dispatchEvent(event2);
            expect(input.isActionDown('jump')).toBe(true);
        });

        it('should bind a chord action', () => {
            input.bindAction('sprint', { chord: ['Shift', 'w'] });

            const event1 = new KeyboardEvent('keydown', { key: 'Shift' });
            window.dispatchEvent(event1);
            expect(input.isActionDown('sprint')).toBe(false);

            const event2 = new KeyboardEvent('keydown', { key: 'w' });
            window.dispatchEvent(event2);
            expect(input.isActionDown('sprint')).toBe(true);
        });

        it('should bind a button action', () => {
            input.bindAction('fire', { buttons: [0] });

            const event = new MouseEvent('mousedown', { button: 0 });
            canvas.dispatchEvent(event);

            expect(input.isActionDown('fire')).toBe(true);
        });
    });

    describe('unbindAction', () => {
        it('should remove a bound action', () => {
            input.bindAction('jump', { keys: ['Space'] });
            const removed = input.unbindAction('jump');

            expect(removed).toBe(true);
            expect(input.isActionDown('jump')).toBeUndefined();
        });

        it('should return false for non-existent action', () => {
            const removed = input.unbindAction('nonexistent');
            expect(removed).toBe(false);
        });
    });

    describe('isActionDown', () => {
        it('should return true when key action is held', () => {
            input.bindAction('jump', { keys: ['Space'] });

            const event = new KeyboardEvent('keydown', { key: 'Space' });
            window.dispatchEvent(event);

            expect(input.isActionDown('jump')).toBe(true);
        });

        it('should return false when no keys are pressed', () => {
            input.bindAction('jump', { keys: ['Space'] });
            expect(input.isActionDown('jump')).toBe(false);
        });

        it('should return undefined and warn for unbound action', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const result = input.isActionDown('unbound');

            expect(result).toBeUndefined();
            expect(warnSpy).toHaveBeenCalledWith(
                '[InputModule::isActionDown]: No mapping for action \'unbound\'',
            );

            warnSpy.mockRestore();
        });

        it('should handle chord actions correctly', () => {
            input.bindAction('sprint', { chord: ['Shift', 'w'] });

            const shift = new KeyboardEvent('keydown', { key: 'Shift' });
            window.dispatchEvent(shift);
            expect(input.isActionDown('sprint')).toBe(false);

            const w = new KeyboardEvent('keydown', { key: 'w' });
            window.dispatchEvent(w);
            expect(input.isActionDown('sprint')).toBe(true);

            const upShift = new KeyboardEvent('keyup', { key: 'Shift' });
            window.dispatchEvent(upShift);
            expect(input.isActionDown('sprint')).toBe(false);
        });
    });

    describe('isActionPressed', () => {
        it('should return true on initial key press', () => {
            input.bindAction('jump', { keys: ['Space'] });

            const event = new KeyboardEvent('keydown', { key: 'Space' });
            window.dispatchEvent(event);

            expect(input.isActionPressed('jump')).toBe(true);
        });

        it('should return undefined for unbound action', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const result = input.isActionPressed('unbound');

            expect(result).toBeUndefined();
            expect(warnSpy).toHaveBeenCalledWith(
                '[InputModule::isActionPressed]: No mapping for action \'unbound\'',
            );

            warnSpy.mockRestore();
        });

        it('should handle chord pressed correctly', () => {
            input.bindAction('sprint', { chord: ['Shift', 'w'] });

            const shift = new KeyboardEvent('keydown', { key: 'Shift' });
            window.dispatchEvent(shift);
            expect(input.isActionPressed('sprint')).toBe(false);

            const w = new KeyboardEvent('keydown', { key: 'w' });
            window.dispatchEvent(w);
            expect(input.isActionPressed('sprint')).toBe(true);
        });
    });

    describe('destroy', () => {
        it('should clean up keyboard listeners', () => {
            input.destroy();

            const event = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event);

            expect(keyboard.isKeyDown('a')).toBe(false);
        });
    });

    describe('direct module access', () => {
        it('should provide access to keyboard module', () => {
            expect(input.keyboard).toBe(keyboard);
        });

        it('should provide access to mouse module', () => {
            expect(input.mouse).toBe(mouse);
        });
    });
});
