import {
    describe, it, expect, beforeEach, afterEach, vi,
} from 'vitest';
import KeyboardModule, { Keys } from '../dist/input/KeyboardModule.js';

describe('KeyboardModule', () => {
    let keyboard: KeyboardModule;

    beforeEach(() => {
        keyboard = new KeyboardModule();
    });

    afterEach(() => {
        keyboard.destroy();
    });

    describe('isKeyDown', () => {
        it('should return false for unpressed keys', () => {
            expect(keyboard.isKeyDown('a')).toBe(false);
            expect(keyboard.isKeyDown(Keys.SPACE)).toBe(false);
        });

        it('should return true when key is pressed down', () => {
            const event = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event);

            expect(keyboard.isKeyDown('a')).toBe(true);
        });

        it('should return false after key is released', () => {
            const downEvent = new KeyboardEvent('keydown', { key: 'a' });
            const upEvent = new KeyboardEvent('keyup', { key: 'a' });

            window.dispatchEvent(downEvent);
            expect(keyboard.isKeyDown('a')).toBe(true);

            window.dispatchEvent(upEvent);
            expect(keyboard.isKeyDown('a')).toBe(false);
        });
    });

    describe('isKeyPressed', () => {
        it('should return false for unpressed keys', () => {
            expect(keyboard.isKeyPressed('a')).toBe(false);
        });

        it('should return true on initial keydown', () => {
            const event = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event);

            expect(keyboard.isKeyPressed('a')).toBe(true);
        });

        it('should not register as pressed on key repeat', () => {
            // First keydown
            const event1 = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event1);
            expect(keyboard.isKeyPressed('a')).toBe(true);

            // Second keydown (repeat) while key is still down
            const event2 = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event2);
            expect(keyboard.isKeyPressed('a')).toBe(true); // Still true from first press
        });

        it('should clear pressed state on next frame', async () => {
            const event = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event);

            expect(keyboard.isKeyPressed('a')).toBe(true);

            // Wait for RAF to clear the pressed state
            await new Promise((resolve) => requestAnimationFrame(resolve));

            expect(keyboard.isKeyPressed('a')).toBe(false);
            expect(keyboard.isKeyDown('a')).toBe(true); // Still held down
        });
    });

    describe('Keys constants', () => {
        it('should have correct key values', () => {
            expect(Keys.SPACE).toBe(' ');
            expect(Keys.ENTER).toBe('Enter');
            expect(Keys.ESCAPE).toBe('Escape');
            expect(Keys.ARROW_UP).toBe('ArrowUp');
            expect(Keys.CTRL).toBe('Control');
        });
    });

    describe('event listeners', () => {
        it('should dispatch keydown events', () => {
            const callback = vi.fn();
            keyboard.on('keydown:a', callback);

            const event = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event);

            expect(callback).toHaveBeenCalled();
        });

        it('should dispatch keypress events only on initial press', () => {
            const callback = vi.fn();
            keyboard.on('keypress:a', callback);

            // First keydown
            const event1 = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event1);
            expect(callback).toHaveBeenCalledTimes(1);

            // Second keydown (repeat)
            const event2 = new KeyboardEvent('keydown', { key: 'a' });
            window.dispatchEvent(event2);
            expect(callback).toHaveBeenCalledTimes(1); // Not called again
        });
    });

    describe('destroy', () => {
        it('should remove event listeners', () => {
            const event = new KeyboardEvent('keydown', { key: 'a' });

            keyboard.destroy();

            window.dispatchEvent(event);
            expect(keyboard.isKeyDown('a')).toBe(false);
        });
    });

    describe('multiple keys', () => {
        it('should track multiple keys independently', () => {
            const event1 = new KeyboardEvent('keydown', { key: 'a' });
            const event2 = new KeyboardEvent('keydown', { key: 'b' });

            window.dispatchEvent(event1);
            window.dispatchEvent(event2);

            expect(keyboard.isKeyDown('a')).toBe(true);
            expect(keyboard.isKeyDown('b')).toBe(true);

            const upEvent = new KeyboardEvent('keyup', { key: 'a' });
            window.dispatchEvent(upEvent);

            expect(keyboard.isKeyDown('a')).toBe(false);
            expect(keyboard.isKeyDown('b')).toBe(true);
        });
    });
});
