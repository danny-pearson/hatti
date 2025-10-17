interface ListenerOptions {
    once?:    boolean;
    prepend?: boolean;
}

interface EmitterEvent<Type, Key extends keyof Type> {
    readonly name:    Key;
    readonly payload: Type[Key];
}

type EventHandler<Type, Key extends keyof Type> = (event: EmitterEvent<Type, Key>) => void;

class EventEmitter<Type = Record<string, unknown>> {
    protected listeners: Map<keyof Type, EventHandler<Type, keyof Type>[]>;

    public constructor() {
        this.listeners = new Map();
    }

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
            fn = (e) => {
                handler(e);
                this.unlisten(event, fn);
            };
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

    public unlisten<Key extends keyof Type>(
        event:   Key,
        handler: EventHandler<Type, Key>,
    ): void {
        if (!this.listeners.has(event)) return;

        const _listeners = this.listeners.get(event) as (typeof handler)[];

        if (_listeners.length < 2) {
            this.listeners.delete(event);
            return;
        }

        const index = _listeners.indexOf(handler);

        if (index === -1) return;

        _listeners.splice(index, 1);
    };

    public dispatch = <Key extends keyof Type>(
        event:    Key,
        payload?: Type[Key],
    ): void => {
        const _listeners = this.listeners.get(event);

        if (!_listeners?.length) return;

        const _payload = payload as Type[Key];

        _listeners.forEach((handler: EventHandler<Type, Key>) => {
            try {
                handler({
                    name: event,
                    payload: _payload,
                });
            } catch (err) {
                console.error('[EventEmitter::dispatch]:', err);
            }
        });
    };
}

export default EventEmitter;
