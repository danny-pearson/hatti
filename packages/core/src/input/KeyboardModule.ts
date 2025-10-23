import EventEmitter from '../EventEmitter.js';

/**
 * Event declarations for keyboard events.
 *
 * Supports dynamic event keys for any keyboard key:
 * - `keydown:${string}`  - Fired continuously while a key is held down
 * - `keypress:${string}` - Fired once when a key is initially pressed
 */
export interface KeyboardEventsDecl {
    [key: `keydown:${string}`]:  object;
    [key: `keypress:${string}`]: object;
}

/**
 * Common keyboard key constants to avoid typos.
 *
 * Use these constants instead of string literals for better type safety
 * and to prevent common typos in key names.
 *
 * @example
 * ```ts
 * if (keyboard.isKeyDown(Keys.SPACE)) {
 *     // Handle spacebar press
 * }
 * ```
 */
export const Keys = {
    SPACE:       ' ',
    ENTER:       'Enter',
    ESCAPE:      'Escape',
    TAB:         'Tab',
    BACKSPACE:   'Backspace',
    DELETE:      'Delete',
    ARROW_UP:    'ArrowUp',
    ARROW_DOWN:  'ArrowDown',
    ARROW_LEFT:  'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    SHIFT:       'Shift',
    CTRL:        'Control',
    ALT:         'Alt',
    META:        'Meta',
} as const;

/**
 * Manages keyboard input state and events.
 *
 * Tracks which keys are currently held down and which were just pressed,
 * allowing for both continuous (hold) and single-frame (press) detection.
 *
 * The module automatically handles key repeat - holding a key only registers
 * one press event, preventing duplicate press detections.
 *
 * @example
 * ```ts
 * const keyboard = new KeyboardModule();
 *
 * // In your game loop:
 * if (keyboard.isKeyDown('w')) {
 *     // Move forward while W is held
 * }
 *
 * if (keyboard.isKeyPressed(Keys.SPACE)) {
 *     // Jump once when space is pressed
 * }
 *
 * // Listen for specific key events:
 * keyboard.on('keypress:Enter', () => {
 *     console.log('Enter was pressed!');
 * });
 *
 * // Clean up when done:
 * keyboard.destroy();
 * ```
 */
class KeyboardModule {
    private keysDown:    Set<string>;

    private keysPressed: Set<string>;

    private events:      EventEmitter<KeyboardEventsDecl>;

    private keydownHandler?: (event: KeyboardEvent) => void;

    private keyupHandler?:   (event: KeyboardEvent) => void;

    /**
     * Creates a new keyboard input module.
     *
     * Automatically attaches event listeners to the window object.
     * Call `destroy()` when the module is no longer needed to clean up listeners.
     */
    constructor() {
        this.keysDown    = new Set();
        this.keysPressed = new Set();

        this.events = new EventEmitter();

        this.initListeners();
    }

    /**
     * Checks if a key is currently held down.
     *
     * @param   key - The key to check (e.g., 'a', 'Enter', 'ArrowUp')
     * @returns     True if the key is currently pressed
     */
    public isKeyDown(key: string): boolean {
        return this.keysDown.has(key);
    }

    /**
     * Checks if a key was pressed this frame (single frame detection).
     *
     * @param   key - The key to check
     * @returns     True if the key was just pressed (not held)
     */
    public isKeyPressed(key: string): boolean {
        return this.keysPressed.has(key);
    }

    /**
     * Removes all event listeners. Call when destroying the module.
     */
    public destroy(): void {
        if (this.keydownHandler) {
            window.removeEventListener('keydown', this.keydownHandler);
        }

        if (this.keyupHandler) {
            window.removeEventListener('keyup', this.keyupHandler);
        }
    }

    /**
     * Registers an event listener for keyboard events.
     *
     * @param args - Event name and callback function
     *
     * @example
     * ```ts
     * keyboard.on('keypress:Space', () => {
     *     console.log('Space was pressed!');
     * });
     * ```
     */
    public on(...args: Parameters<typeof this.events.listen>) {
        this.events.listen(...args);
    }

    /**
     * Initializes keyboard event listeners on the window object.
     *
     * Handles keydown and keyup events, managing both held and pressed key states.
     * Uses requestAnimationFrame to clear pressed keys on the next frame.
     */
    private initListeners() {
        this.keydownHandler = (event) => {
            if (!this.keysDown.has(event.key)) {
                this.keysPressed.add(event.key);

                this.events.dispatch(`keypress:${event.key}`);

                requestAnimationFrame(() => {
                    this.keysPressed.delete(event.key);
                });
            }

            this.keysDown.add(event.key);

            this.events.dispatch(`keydown:${event.key}`);
        };

        this.keyupHandler = (event) => {
            this.keysDown.delete(event.key);
        };

        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }
}

export default KeyboardModule;

/**
 * Global singleton instance of KeyboardModule for convenience.
 *
 * Use this if you only need one keyboard handler for your entire application.
 * For more complex scenarios (multiple contexts, testing), create separate instances.
 *
 * @example
 * ```ts
 * import { Keyboard, Keys } from '@hatti/core';
 *
 * if (Keyboard.isKeyPressed(Keys.SPACE)) {
 *     player.jump();
 * }
 * ```
 */
export const Keyboard = new KeyboardModule();
