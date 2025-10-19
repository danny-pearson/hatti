import {
    describe, it, expect, vi,
} from 'vitest';
import EventEmitter from '../dist/EventEmitter.js';

/**
 * Tests for the EventEmitter class.
 */
describe('EventEmitter', () => {
    interface TestEvents {
        message: string;
        data: { value: number; };
        empty: undefined;
    }

    describe('listen()', () => {
        it('should register an event handler', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            emitter.listen('message', handler);

            emitter.dispatch('message', 'hello');

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith({
                name: 'message',
                payload: 'hello',
            });
        });

        it('should register multiple handlers for the same event', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler1 = vi.fn();
            const handler2 = vi.fn();

            emitter.listen('message', handler1);
            emitter.listen('message', handler2);

            emitter.dispatch('message', 'hello');

            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(1);
        });

        it('should call handlers in registration order', () => {
            const emitter = new EventEmitter<TestEvents>();
            const callOrder: number[] = [];

            emitter.listen('message', () => callOrder.push(1));
            emitter.listen('message', () => callOrder.push(2));
            emitter.listen('message', () => callOrder.push(3));

            emitter.dispatch('message', 'test');

            expect(callOrder).toEqual([1, 2, 3]);
        });

        it('should support "once" option to auto-unlisten after first call', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            emitter.listen('message', handler, { once: true });

            emitter.dispatch('message', 'first');
            emitter.dispatch('message', 'second');

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith({
                name: 'message',
                payload: 'first',
            });
        });

        it('should support "prepend" option to add handler at the beginning', () => {
            const emitter = new EventEmitter<TestEvents>();
            const callOrder: number[] = [];

            emitter.listen('message', () => callOrder.push(1));
            emitter.listen('message', () => callOrder.push(2));
            emitter.listen('message', () => callOrder.push(3), { prepend: true });

            emitter.dispatch('message', 'test');

            expect(callOrder).toEqual([3, 1, 2]);
        });

        it('should support both "once" and "prepend" options together', () => {
            const emitter = new EventEmitter<TestEvents>();
            const callOrder: number[] = [];

            emitter.listen('message', () => callOrder.push(1));
            emitter.listen('message', () => callOrder.push(2), {
                once: true,
                prepend: true,
            });

            emitter.dispatch('message', 'first'); // Calls 2, 1 (then 2 is removed)
            emitter.dispatch('message', 'second'); // Calls 1 only

            expect(callOrder).toEqual([2, 1, 1]);
        });

        it('should handle events with complex payload types', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            emitter.listen('data', handler);

            emitter.dispatch('data', { value: 42 });

            expect(handler).toHaveBeenCalledWith({
                name: 'data',
                payload: { value: 42 },
            });
        });

        it('should handle events with undefined payload', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            emitter.listen('empty', handler);

            emitter.dispatch('empty', undefined);

            expect(handler).toHaveBeenCalledWith({
                name: 'empty',
                payload: undefined,
            });
        });
    });

    describe('unlisten()', () => {
        it('should remove a specific handler', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler1 = vi.fn();
            const handler2 = vi.fn();

            emitter.listen('message', handler1);
            emitter.listen('message', handler2);

            emitter.unlisten('message', handler1);

            emitter.dispatch('message', 'test');

            expect(handler1).not.toHaveBeenCalled();
            expect(handler2).toHaveBeenCalledTimes(1);
        });

        it('should remove all listeners if only one handler exists', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            emitter.listen('message', handler);
            emitter.unlisten('message', handler);

            emitter.dispatch('message', 'test');

            expect(handler).not.toHaveBeenCalled();
        });

        it('should do nothing if event has no listeners', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            expect(() => {
                emitter.unlisten('message', handler);
            }).not.toThrow();
        });

        it('should do nothing if handler is not registered', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler1 = vi.fn();
            const handler2 = vi.fn();

            emitter.listen('message', handler1);

            expect(() => {
                emitter.unlisten('message', handler2);
            }).not.toThrow();

            emitter.dispatch('message', 'test');

            expect(handler1).toHaveBeenCalledTimes(1);
        });

        it('should handle unlistening during event dispatch', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler1 = vi.fn();
            const handler2 = vi.fn(() => {
                emitter.unlisten('message', handler1);
            });

            emitter.listen('message', handler1);
            emitter.listen('message', handler2);

            emitter.dispatch('message', 'test');

            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(1);

            // After unlisten, handler1 should not be called again
            emitter.dispatch('message', 'test2');

            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(2);
        });
    });

    describe('dispatch()', () => {
        it('should dispatch event to all registered handlers', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler1 = vi.fn();
            const handler2 = vi.fn();
            const handler3 = vi.fn();

            emitter.listen('message', handler1);
            emitter.listen('message', handler2);
            emitter.listen('message', handler3);

            emitter.dispatch('message', 'hello');

            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(1);
            expect(handler3).toHaveBeenCalledTimes(1);
        });

        it('should do nothing if event has no listeners', () => {
            const emitter = new EventEmitter<TestEvents>();

            expect(() => {
                emitter.dispatch('message', 'test');
            }).not.toThrow();
        });

        it('should catch and log errors thrown by handlers', () => {
            const emitter = new EventEmitter<TestEvents>();
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const handler1 = vi.fn(() => {
                throw new Error('Handler error');
            });
            const handler2 = vi.fn();

            emitter.listen('message', handler1);
            emitter.listen('message', handler2);

            emitter.dispatch('message', 'test');

            expect(errorSpy).toHaveBeenCalledWith(
                '[EventEmitter::dispatch]:',
                expect.any(Error),
            );
            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(1);

            errorSpy.mockRestore();
        });

        it('should continue dispatching to other handlers if one throws', () => {
            const emitter = new EventEmitter<TestEvents>();
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const handler1 = vi.fn();
            const handler2 = vi.fn(() => {
                throw new Error('Error');
            });
            const handler3 = vi.fn();

            emitter.listen('message', handler1);
            emitter.listen('message', handler2);
            emitter.listen('message', handler3);

            emitter.dispatch('message', 'test');

            expect(handler1).toHaveBeenCalledTimes(1);
            expect(handler2).toHaveBeenCalledTimes(1);
            expect(handler3).toHaveBeenCalledTimes(1);

            errorSpy.mockRestore();
        });

        it('should pass correct event object with name and payload', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            emitter.listen('data', handler);

            const payload = { value: 123 };
            emitter.dispatch('data', payload);

            expect(handler).toHaveBeenCalledWith({
                name: 'data',
                payload,
            });
        });
    });

    describe('multiple event types', () => {
        it('should handle different event types independently', () => {
            const emitter = new EventEmitter<TestEvents>();
            const messageHandler = vi.fn();
            const dataHandler = vi.fn();

            emitter.listen('message', messageHandler);
            emitter.listen('data', dataHandler);

            emitter.dispatch('message', 'hello');

            expect(messageHandler).toHaveBeenCalledTimes(1);
            expect(dataHandler).not.toHaveBeenCalled();

            emitter.dispatch('data', { value: 42 });

            expect(messageHandler).toHaveBeenCalledTimes(1);
            expect(dataHandler).toHaveBeenCalledTimes(1);
        });

        it('should allow the same handler function for different events', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            emitter.listen('message', handler);
            emitter.listen('empty', handler);

            emitter.dispatch('message', 'test');
            emitter.dispatch('empty', undefined);

            expect(handler).toHaveBeenCalledTimes(2);
            expect(handler).toHaveBeenNthCalledWith(1, {
                name: 'message',
                payload: 'test',
            });
            expect(handler).toHaveBeenNthCalledWith(2, {
                name: 'empty',
                payload: undefined,
            });
        });
    });

    describe('edge cases', () => {
        it('should handle rapid listen/unlisten cycles', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler = vi.fn();

            for (let i = 0; i < 10; i++) {
                emitter.listen('message', handler);
                emitter.unlisten('message', handler);
            }

            emitter.dispatch('message', 'test');

            expect(handler).not.toHaveBeenCalled();
        });

        it('should handle many listeners on the same event', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handlers = Array.from({ length: 100 }, () => vi.fn());

            for (const handler of handlers) {
                emitter.listen('message', handler);
            }

            emitter.dispatch('message', 'test');

            for (const handler of handlers) {
                expect(handler).toHaveBeenCalledTimes(1);
            }
        });

        it('should maintain separate listener lists for each event', () => {
            const emitter = new EventEmitter<TestEvents>();
            const handler1 = vi.fn();
            const handler2 = vi.fn();

            emitter.listen('message', handler1);
            emitter.listen('data', handler2);

            emitter.unlisten('message', handler1);

            emitter.dispatch('data', { value: 1 });

            expect(handler1).not.toHaveBeenCalled();
            expect(handler2).toHaveBeenCalledTimes(1);
        });
    });
});
