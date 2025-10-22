/**
 * Options for configuring event listeners.
 */
interface ListenerOptions {
    /**
     * If true, listener will be removed after first invocation
     */
    once?: boolean;

    /**
     * If true, listener will be added to the beginning of the handler list
     */
    prepend?: boolean;
}

/**
 * Event object passed to event handlers.
 *
 * @template Type - Event map type
 * @template Key  - Event name key
 */
interface EmitterEvent<Type, Key extends keyof Type> {
    /**
     * Name of the event that was dispatched
     */
    readonly name: Key;

    /**
     * Payload data associated with the event
     */
    readonly payload: Type[Key];
}

/**
 * Event handler function signature.
 *
 * @template Type - Event map type
 * @template Key  - Event name key
 */
interface EventHandler<Type, Key extends keyof Type> {
    (event: EmitterEvent<Type, Key>): void;
    __once__?: boolean;
}

/**
 * Type-safe event emitter for implementing observer pattern.
 *
 * Allows components to subscribe to and dispatch typed events. Supports
 * one-time listeners, prepending handlers, and automatic cleanup.
 *
 * @template Type - Object mapping event names to their payload types
 *
 * @example
 * ```typescript
 * interface GameEvents {
 *     'player-died': { playerId: number };
 *     'score-changed': { score: number };
 * }
 *
 * const emitter = new EventEmitter<GameEvents>();
 *
 * emitter.listen('player-died', (e) => {
 *     console.log(`Player ${e.payload.playerId} died`);
 * });
 *
 * emitter.dispatch('player-died', { playerId: 1 });
 * ```
 */
class EventEmitter<Type = Record<string, unknown>> {
    protected listeners: Map<keyof Type, EventHandler<Type, keyof Type>[]>;

    /**
     * Creates a new EventEmitter instance.
     */
    public constructor() {
        this.listeners = new Map();
    }

    /**
     * Registers an event listener for the specified event.
     *
     * @param event   - Event name to listen for
     * @param handler - Function to call when event is dispatched
     * @param options - Optional listener configuration
     */
    public listen<Key extends keyof Type>(
        event:    Key,
        handler:  EventHandler<Type, Key>,
        options?: ListenerOptions,
    ): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }

        let fn: EventHandler<Type, Key>;

        if (options?.once) {
            fn = (e) => handler(e);
            fn.__once__ = true;
        } else {
            fn = handler;
        }

        const _listeners = this.listeners.get(event) as EventHandler<Type, Key>[];

        if (options?.prepend) {
            _listeners.unshift(fn);
            return;
        }
        _listeners.push(fn);
    };

    /**
     * Removes an event listener for the specified event.
     *
     * @param event   - Event name to stop listening for
     * @param handler - Handler function to remove
     */
    public unlisten<Key extends keyof Type>(
        event:   Key,
        handler: EventHandler<Type, Key>,
    ): void {
        if (!this.listeners.has(event)) return;

        const _listeners = this.listeners.get(event) as (typeof handler)[];
        const index      = _listeners.indexOf(handler);

        if (index === -1) return;

        if (_listeners.length < 2) {
            this.listeners.delete(event);
            return;
        }

        _listeners.splice(index, 1);
    };

    /**
     * Dispatches an event to all registered listeners.
     *
     * Calls all handlers registered for the event in order. Handlers that
     * throw errors are caught and logged. One-time listeners are automatically
     * removed after being called.
     *
     * @param event   - Event name to dispatch
     * @param payload - Data to pass to event handlers
     */
    public dispatch<Key extends keyof Type>(
        event:    Key,
        payload?: Type[Key],
    ): void {
        const _listeners = this.listeners.get(event);

        if (!_listeners?.length) return;

        const _payload = payload as Type[Key];

        const cleanupArr = [];

        for (const handler of _listeners) {
            try {
                handler({
                    name: event,
                    payload: _payload,
                });

                if (handler.__once__) {
                    cleanupArr.push(handler);
                }
            } catch (err) {
                console.error('[EventEmitter::dispatch]:', err);
            }
        }

        if (!cleanupArr.length) return;

        for (const handler of cleanupArr) {
            this.unlisten(event, handler);
        }
    };
}

export default EventEmitter;
