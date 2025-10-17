import { describe, it, expect, vi } from 'vitest';
import {
    forEachKey,
    forEachValue,
    forEachEntry,
    mapEachValue,
    mapEachEntry,
    filterEachKey,
} from '../dist/iteration.js';

describe('iteration utilities', () => {
    const testObj = {
        a: 1,
        b: 2,
        c: 3,
    };

    describe('forEachKey', () => {
        it('should iterate over each own enumerable key', () => {
            const keys: string[] = [];

            forEachKey(testObj, (key) => {
                keys.push(key as string);
            });

            expect(keys).toEqual(['a', 'b', 'c']);
        });

        it('should provide correct index for each iteration', () => {
            const indices: number[] = [];

            forEachKey(testObj, (_, index) => {
                indices.push(index);
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        it('should provide the original object as third parameter', () => {
            let receivedObj: any = null;

            forEachKey(testObj, (_, __, obj) => {
                receivedObj = obj;
            });

            expect(receivedObj).toBe(testObj);
        });

        it('should not iterate over inherited properties', () => {
            const proto = { inherited: 'value' };
            const obj = Object.create(proto);
            obj.own = 'property';

            const keys: string[] = [];

            forEachKey(obj, (key) => {
                keys.push(key as string);
            });

            expect(keys).toEqual(['own']);
        });

        it('should handle empty objects', () => {
            const callback = vi.fn();

            forEachKey({}, callback);

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('forEachValue', () => {
        it('should iterate over each own enumerable value', () => {
            const values: number[] = [];

            forEachValue(testObj, (value) => {
                values.push(value as number);
            });

            expect(values).toEqual([1, 2, 3]);
        });

        it('should provide correct index for each iteration', () => {
            const indices: number[] = [];

            forEachValue(testObj, (_, index) => {
                indices.push(index);
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        it('should provide the original object as third parameter', () => {
            let receivedObj: any = null;

            forEachValue(testObj, (_, __, obj) => {
                receivedObj = obj;
            });

            expect(receivedObj).toBe(testObj);
        });

        it('should handle empty objects', () => {
            const callback = vi.fn();

            forEachValue({}, callback);

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('forEachEntry', () => {
        it('should iterate over each own enumerable entry', () => {
            const entries: [string, number][] = [];

            forEachEntry(testObj, (entry) => {
                entries.push(entry as [string, number]);
            });

            expect(entries).toEqual([
                ['a', 1],
                ['b', 2],
                ['c', 3],
            ]);
        });

        it('should provide correct index for each iteration', () => {
            const indices: number[] = [];

            forEachEntry(testObj, (_, index) => {
                indices.push(index);
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        it('should provide the original object as third parameter', () => {
            let receivedObj: any = null;

            forEachEntry(testObj, (_, __, obj) => {
                receivedObj = obj;
            });

            expect(receivedObj).toBe(testObj);
        });

        it('should handle empty objects', () => {
            const callback = vi.fn();

            forEachEntry({}, callback);

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('mapEachValue', () => {
        it('should map each value and return a new object', () => {
            const result = mapEachValue(testObj, (value) => (value as number) * 2);

            expect(result).toEqual({
                a: 2,
                b: 4,
                c: 6,
            });
        });

        it('should not modify the original object', () => {
            const original = { ...testObj };

            mapEachValue(testObj, (value) => (value as number) * 2);

            expect(testObj).toEqual(original);
        });

        it('should provide correct index for each iteration', () => {
            const indices: number[] = [];

            mapEachValue(testObj, (_, index) => {
                indices.push(index);
                return 0;
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        it('should provide the original object as third parameter', () => {
            let receivedObj: any = null;

            mapEachValue(testObj, (_, __, obj) => {
                receivedObj = obj;
                return 0;
            });

            expect(receivedObj).toBe(testObj);
        });

        it('should handle empty objects', () => {
            const result = mapEachValue({}, () => 0);

            expect(result).toEqual({});
        });

        it('should allow transforming to different value types', () => {
            const result = mapEachValue(testObj, (value) => `value: ${value}`);

            expect(result).toEqual({
                a: 'value: 1',
                b: 'value: 2',
                c: 'value: 3',
            });
        });
    });

    describe('mapEachEntry', () => {
        it('should map each entry to a new key-value pair', () => {
            const result = mapEachEntry(testObj, ([key, value]) => [
                `${key}_new`,
                (value as number) * 2,
            ]);

            expect(result).toEqual({
                a_new: 2,
                b_new: 4,
                c_new: 6,
            });
        });

        it('should not modify the original object', () => {
            const original = { ...testObj };

            mapEachEntry(testObj, ([key, value]) => [key, value]);

            expect(testObj).toEqual(original);
        });

        it('should provide correct index for each iteration', () => {
            const indices: number[] = [];

            mapEachEntry(testObj, ([key, value], index) => {
                indices.push(index);
                return [key, value];
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        it('should provide the original object as third parameter', () => {
            let receivedObj: any = null;

            mapEachEntry(testObj, ([key, value], _, obj) => {
                receivedObj = obj;
                return [key, value];
            });

            expect(receivedObj).toBe(testObj);
        });

        it('should handle empty objects', () => {
            const result = mapEachEntry({}, ([key, value]) => [key, value]);

            expect(result).toEqual({});
        });

        it('should allow remapping keys', () => {
            const result = mapEachEntry(testObj, ([key, value]) => [
                key.toUpperCase(),
                value,
            ]);

            expect(result).toEqual({
                A: 1,
                B: 2,
                C: 3,
            });
        });
    });

    describe('filterEachKey', () => {
        it('should filter entries by key predicate', () => {
            const result = filterEachKey(testObj, (key) => key !== 'b');

            expect(result).toEqual({
                a: 1,
                c: 3,
            });
        });

        it('should not modify the original object', () => {
            const original = { ...testObj };

            filterEachKey(testObj, () => true);

            expect(testObj).toEqual(original);
        });

        it('should provide correct index for each iteration', () => {
            const indices: number[] = [];

            filterEachKey(testObj, (_, index) => {
                indices.push(index);
                return true;
            });

            expect(indices).toEqual([0, 1, 2]);
        });

        it('should provide the original object as third parameter', () => {
            let receivedObj: any = null;

            filterEachKey(testObj, (_, __, obj) => {
                receivedObj = obj;
                return true;
            });

            expect(receivedObj).toBe(testObj);
        });

        it('should handle empty objects', () => {
            const result = filterEachKey({}, () => true);

            expect(result).toEqual({});
        });

        it('should return empty object when all keys are filtered out', () => {
            const result = filterEachKey(testObj, () => false);

            expect(result).toEqual({});
        });

        it('should return all entries when predicate always returns true', () => {
            const result = filterEachKey(testObj, () => true);

            expect(result).toEqual(testObj);
        });

        it('should work with complex predicates', () => {
            const obj = {
                name: 'John',
                age: 30,
                city: 'NYC',
                country: 'USA',
            };

            const result = filterEachKey(obj, (key) => (key as string).startsWith('c'));

            expect(result).toEqual({
                city: 'NYC',
                country: 'USA',
            });
        });
    });

    describe('integration tests', () => {
        it('should allow chaining map and filter operations', () => {
            const obj = {
                a: 1,
                b: 2,
                c: 3,
                d: 4,
            };

            // First map to double values
            const mapped = mapEachValue(obj, (value) => (value as number) * 2);

            // Then filter to keep only even original values (now doubled)
            const filtered = filterEachKey(mapped, (key) => {
                const originalValue = obj[key as keyof typeof obj];
                return originalValue % 2 === 0;
            });

            expect(filtered).toEqual({
                b: 4,
                d: 8,
            });
        });

        it('should work with complex object types', () => {
            interface User {
                name: string;
                age: number;
                active: boolean;
            }

            const users: Record<string, User> = {
                user1: { name: 'Alice', age: 25, active: true },
                user2: { name: 'Bob', age: 30, active: false },
                user3: { name: 'Charlie', age: 35, active: true },
            };

            const activeUserNames: string[] = [];

            forEachEntry(users, ([key, user]) => {
                if (user.active) {
                    activeUserNames.push(user.name);
                }
            });

            expect(activeUserNames).toEqual(['Alice', 'Charlie']);
        });
    });
});
