import EventEmitter from '../EventEmitter.js';
import type KeyboardModule from './KeyboardModule.js';
import type { KeyboardEventsDecl } from './KeyboardModule.js';
import type MouseModule from './MouseModule.js';
import type { MouseEventsDecl } from './MouseModule.js';

/**
 * Event declarations for input module events.
 *
 * Combines keyboard and mouse events, plus custom action events.
 */
interface InputEventsDecl extends KeyboardEventsDecl, MouseEventsDecl {
    [key: `action:${string}`]: object;
}

/**
 * Descriptor for binding inputs to named actions.
 *
 * Supports three types of bindings:
 * - `keys`: Any of the specified keys (OR logic)
 * - `chord`: All specified keys must be pressed (AND logic)
 * - `buttons`: Any of the specified mouse buttons (OR logic)
 *
 * @example
 * ```ts
 * // Jump action triggered by Space OR W
 * { keys: ['Space', 'w'] }
 *
 * // Sprint action requires Shift AND W
 * { chord: ['Shift', 'w'] }
 *
 * // Fire action triggered by left or right mouse button
 * { buttons: [0, 2] }
 * ```
 */
export type InputActionDescriptor =
    | { keys: string[]; }
    | { chord: string[]; }
    | { buttons: number[]; };

/**
 * High-level input manager that maps raw inputs to named actions.
 *
 * Provides an abstraction layer over keyboard and mouse inputs, allowing you
 * to bind multiple inputs to a single action name for easier rebinding and
 * more readable game logic.
 *
 * @example
 * ```ts
 * const keyboard = new KeyboardModule();
 * const mouse = new MouseModule(surface);
 * const input = new InputModule(keyboard, mouse);
 *
 * // Bind actions
 * input.bindAction('jump', { keys: ['Space', 'w'] });
 * input.bindAction('sprint', { chord: ['Shift', 'w'] });
 * input.bindAction('fire', { buttons: [0] });
 *
 * // In game loop:
 * if (input.isActionPressed('jump')) {
 *     player.jump();
 * }
 *
 * if (input.isActionDown('sprint')) {
 *     player.setSprinting(true);
 * }
 * ```
 */
class InputModule {
    /** Direct access to the keyboard module */
    public keyboard: KeyboardModule;

    /** Direct access to the mouse module */
    public mouse: MouseModule;

    private mapping: Map<string, InputActionDescriptor>;

    private events: EventEmitter<InputEventsDecl>;

    /**
     * Creates a new input manager.
     *
     * @param keyboard - Keyboard input module to use
     * @param mouse    - Mouse input module to use
     */
    public constructor(keyboard: KeyboardModule, mouse: MouseModule) {
        this.events   = new EventEmitter();

        this.keyboard = keyboard;
        this.mouse    = mouse;

        this.mapping  = new Map();
    }

    /**
     * Binds an action to input(s).
     *
     * @param handle     - Unique identifier for the action
     * @param descriptor - Input configuration (keys, chord, or buttons)
     */
    public bindAction(handle: string, descriptor: InputActionDescriptor): void {
        this.mapping.set(handle, descriptor);
    }

    /**
     * Unbinds an action.
     *
     * @param   handle - Action identifier to remove
     * @returns          True if the action was removed, false if it didn't exist
     */
    public unbindAction(handle: string): boolean {
        return this.mapping.delete(handle);
    }

    /**
     * Checks if an action is currently held down.
     *
     * @param   handle - Action identifier
     * @returns          True if action is active, undefined if not found
     */
    public isActionDown(handle: string): boolean | undefined {
        const descriptor = this.mapping.get(handle);

        if (!descriptor) {
            console.warn(`[InputModule::isActionDown]: No mapping for action '${handle}'`);
            return undefined;
        }

        return this.checkAction(descriptor, 'down');
    }

    /**
     * Checks if an action was just pressed this frame.
     *
     * @param   handle - Action identifier
     * @returns          True if action was just pressed, undefined if not found
     */
    public isActionPressed(handle: string): boolean | undefined {
        const descriptor = this.mapping.get(handle);

        if (!descriptor) {
            console.warn(`[InputModule::isActionPressed]: No mapping for action '${handle}'`);
            return undefined;
        }

        return this.checkAction(descriptor, 'pressed');
    }

    /**
     * Removes all event listeners. Call when destroying the module.
     */
    public destroy(): void {
        this.keyboard.destroy();
    }

    /**
     * Registers an event listener for input events.
     *
     * @param args - Event name and callback function
     */
    public on(...args: Parameters<typeof this.events.listen>) {
        this.events.listen(...args);
    }

    /**
     * Internal helper to check if an action is active based on its descriptor.
     *
     * @param   descriptor - The action descriptor to check
     * @param   mode       - Whether to check for 'down' (held) or 'pressed' (just pressed)
     * @returns              True if the action is active
     */
    private checkAction(descriptor: InputActionDescriptor, mode: 'down' | 'pressed'): boolean {
        if ('keys' in descriptor) {
            const checkFn = mode === 'down'
                ? (key: string) => this.keyboard.isKeyDown(key)
                : (key: string) => this.keyboard.isKeyPressed(key);

            return descriptor.keys.some(checkFn);
        }

        if ('chord' in descriptor) {
            const allDown = descriptor.chord.every((key) => this.keyboard.isKeyDown(key));

            if (mode === 'down') return allDown;

            const anyPressed = descriptor.chord.some((key) => this.keyboard.isKeyPressed(key));

            return allDown && anyPressed;
        }

        if ('buttons' in descriptor) {
            const checkFn = mode === 'down'
                ? (button: number) => this.mouse.isButtonDown(button)
                : (button: number) => this.mouse.isButtonPressed(button);

            return descriptor.buttons.some(checkFn);
        }

        return false;
    }
}

export default InputModule;
