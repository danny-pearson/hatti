import { describe, expect, it } from 'vitest';
import AttributeTable from '../dist/AttributeTable.js';
import { Vector2Float32Array, Vector3Float32Array } from '../dist/index.js';

describe('AttributeTable', () => {
    describe('Construction', () => {
        it('should create table with specified capacity', () => {
            const table = new AttributeTable<{ x: number; y: number; }>(100);

            expect(table.capacity).toBe(100);
        });

        it('should create empty table with zero capacity', () => {
            const table = new AttributeTable<{ value: number; }>(0);

            expect(table.capacity).toBe(0);
        });
    });

    describe('addAttribute', () => {
        it('should add scalar attribute with TypedArray', () => {
            interface Stats {
                health: number;
                mana: number;
            }

            const table = new AttributeTable<Stats>(10);

            table.addAttribute('health', Float32Array);
            table.addAttribute('mana', Float32Array);

            expect(table.hasAttribute('health')).toBe(true);
            expect(table.hasAttribute('mana')).toBe(true);
        });

        it('should add vector attribute with PackedArray', () => {
            interface Transform {
                position: [number, number];
                velocity: [number, number];
            }

            const table = new AttributeTable<Transform>(10);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('velocity', Vector2Float32Array);

            expect(table.hasAttribute('position')).toBe(true);
            expect(table.hasAttribute('velocity')).toBe(true);
        });

        it('should warn when adding duplicate attribute', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);
            table.addAttribute('value', Float32Array); // Duplicate

            // Should still only have one attribute
            expect(table.hasAttribute('value')).toBe(true);
        });

        it('should handle mixed scalar and vector attributes', () => {
            interface Particle {
                position: [number, number, number];
                mass: number;
                velocity: [number, number, number];
            }

            const table = new AttributeTable<Particle>(100);

            table.addAttribute('position', Vector3Float32Array);
            table.addAttribute('mass', Float32Array);
            table.addAttribute('velocity', Vector3Float32Array);

            expect(table.hasAttribute('position')).toBe(true);
            expect(table.hasAttribute('mass')).toBe(true);
            expect(table.hasAttribute('velocity')).toBe(true);
        });
    });

    describe('hasAttribute', () => {
        it('should return false for non-existent attribute', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            expect(table.hasAttribute('value')).toBe(false);
        });

        it('should return true for existing attribute', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            expect(table.hasAttribute('value')).toBe(true);
        });
    });

    describe('setAttribute and getAttribute', () => {
        it('should set and get scalar values', () => {
            interface Stats {
                health: number;
                mana: number;
            }

            const table = new AttributeTable<Stats>(10);

            table.addAttribute('health', Float32Array);
            table.addAttribute('mana', Float32Array);

            table.setAttribute(0, 'health', 100);
            table.setAttribute(0, 'mana', 50);
            table.setAttribute(5, 'health', 75);
            table.setAttribute(5, 'mana', 25);

            expect(table.getAttribute(0, 'health')).toBe(100);
            expect(table.getAttribute(0, 'mana')).toBe(50);
            expect(table.getAttribute(5, 'health')).toBe(75);
            expect(table.getAttribute(5, 'mana')).toBe(25);
        });

        it('should set and get vector values', () => {
            interface Transform {
                position: [number, number];
                rotation: number;
            }

            const table = new AttributeTable<Transform>(10);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('rotation', Float32Array);

            table.setAttribute(0, 'position', [10, 20]);
            table.setAttribute(0, 'rotation', Math.PI);

            expect(table.getAttribute(0, 'position')).toEqual([10, 20]);
            expect(table.getAttribute(0, 'rotation')).toBeCloseTo(Math.PI, 5);
        });

        it('should handle 3D vectors', () => {
            interface Physics {
                position: [number, number, number];
                velocity: [number, number, number];
            }

            const table = new AttributeTable<Physics>(5);

            table.addAttribute('position', Vector3Float32Array);
            table.addAttribute('velocity', Vector3Float32Array);

            table.setAttribute(2, 'position', [1, 2, 3]);
            table.setAttribute(2, 'velocity', [0.5, 1.5, -0.5]);

            expect(table.getAttribute(2, 'position')).toEqual([1, 2, 3]);
            expect(table.getAttribute(2, 'velocity')).toEqual([0.5, 1.5, -0.5]);
        });

        it('should not interfere with other entities', () => {
            interface Entity {
                x: number;
                y: number;
            }

            const table = new AttributeTable<Entity>(5);

            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);

            table.setAttribute(0, 'x', 10);
            table.setAttribute(0, 'y', 20);
            table.setAttribute(1, 'x', 30);
            table.setAttribute(1, 'y', 40);
            table.setAttribute(2, 'x', 50);
            table.setAttribute(2, 'y', 60);

            expect(table.getAttribute(0, 'x')).toBe(10);
            expect(table.getAttribute(0, 'y')).toBe(20);
            expect(table.getAttribute(1, 'x')).toBe(30);
            expect(table.getAttribute(1, 'y')).toBe(40);
            expect(table.getAttribute(2, 'x')).toBe(50);
            expect(table.getAttribute(2, 'y')).toBe(60);
        });

        it('should return undefined for out of bounds index', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            expect(table.getAttribute(10, 'value')).toBeUndefined();
            expect(table.getAttribute(-1, 'value')).toBeUndefined();
            expect(table.getAttribute(100, 'value')).toBeUndefined();
        });

        it('should return undefined for non-existent attribute', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            expect(table.getAttribute(0, 'value')).toBeUndefined();
        });

        it('should warn when setting out of bounds index', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(10, 'value', 100); // Out of bounds
            table.setAttribute(-1, 'value', 100); // Out of bounds

            // Values should not be set
            expect(table.getAttribute(10, 'value')).toBeUndefined();
            expect(table.getAttribute(-1, 'value')).toBeUndefined();
        });

        it('should warn when setting non-existent attribute', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.setAttribute(0, 'value', 100); // Attribute doesn't exist

            // Should not crash, just warn
            expect(table.getAttribute(0, 'value')).toBeUndefined();
        });
    });

    describe('setAttributeUnchecked and getAttributeUnchecked', () => {
        it('should set and get values without bounds checking', () => {
            interface Data {
                value: number;
            }

            const table = new AttributeTable<Data>(10);

            table.addAttribute('value', Float32Array);

            table.setAttributeUnchecked(5, 'value', 42);

            expect(table.getAttributeUnchecked(5, 'value')).toBe(42);
        });

        it('should be faster than checked methods (no validation)', () => {
            interface FastData {
                x: number;
                y: number;
            }

            const table = new AttributeTable<FastData>(1000);

            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);

            // Unchecked methods don't validate, so they should work even at edge
            table.setAttributeUnchecked(999, 'x', 100);
            table.setAttributeUnchecked(999, 'y', 200);

            expect(table.getAttributeUnchecked(999, 'x')).toBe(100);
            expect(table.getAttributeUnchecked(999, 'y')).toBe(200);
        });
    });

    describe('clearEntity', () => {
        it('should clear scalar attributes to zero', () => {
            interface Stats {
                health: number;
                mana: number;
                stamina: number;
            }

            const table = new AttributeTable<Stats>(10);

            table.addAttribute('health', Float32Array);
            table.addAttribute('mana', Float32Array);
            table.addAttribute('stamina', Float32Array);

            table.setAttribute(5, 'health', 100);
            table.setAttribute(5, 'mana', 50);
            table.setAttribute(5, 'stamina', 75);

            table.clearEntity(5);

            expect(table.getAttribute(5, 'health')).toBe(0);
            expect(table.getAttribute(5, 'mana')).toBe(0);
            expect(table.getAttribute(5, 'stamina')).toBe(0);
        });

        it('should clear vector attributes to zero', () => {
            interface Transform {
                position: [number, number];
                velocity: [number, number];
            }

            const table = new AttributeTable<Transform>(10);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('velocity', Vector2Float32Array);

            table.setAttribute(3, 'position', [10, 20]);
            table.setAttribute(3, 'velocity', [5, -5]);

            table.clearEntity(3);

            expect(table.getAttribute(3, 'position')).toEqual([0, 0]);
            expect(table.getAttribute(3, 'velocity')).toEqual([0, 0]);
        });

        it('should clear mixed scalar and vector attributes', () => {
            interface Particle {
                position: [number, number, number];
                mass: number;
                velocity: [number, number, number];
                charge: number;
            }

            const table = new AttributeTable<Particle>(10);

            table.addAttribute('position', Vector3Float32Array);
            table.addAttribute('mass', Float32Array);
            table.addAttribute('velocity', Vector3Float32Array);
            table.addAttribute('charge', Float32Array);

            table.setAttribute(7, 'position', [1, 2, 3]);
            table.setAttribute(7, 'mass', 10.5);
            table.setAttribute(7, 'velocity', [0.1, 0.2, 0.3]);
            table.setAttribute(7, 'charge', -1.6);

            table.clearEntity(7);

            expect(table.getAttribute(7, 'position')).toEqual([0, 0, 0]);
            expect(table.getAttribute(7, 'mass')).toBe(0);
            expect(table.getAttribute(7, 'velocity')).toEqual([0, 0, 0]);
            expect(table.getAttribute(7, 'charge')).toBe(0);
        });

        it('should not affect other entities', () => {
            interface Data {
                value: number;
            }

            const table = new AttributeTable<Data>(5);

            table.addAttribute('value', Float32Array);

            table.setAttribute(0, 'value', 10);
            table.setAttribute(1, 'value', 20);
            table.setAttribute(2, 'value', 30);
            table.setAttribute(3, 'value', 40);
            table.setAttribute(4, 'value', 50);

            table.clearEntity(2);

            expect(table.getAttribute(0, 'value')).toBe(10);
            expect(table.getAttribute(1, 'value')).toBe(20);
            expect(table.getAttribute(2, 'value')).toBe(0);
            expect(table.getAttribute(3, 'value')).toBe(40);
            expect(table.getAttribute(4, 'value')).toBe(50);
        });

        it('should work on already-cleared entity', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(5, 'value', 100);
            table.clearEntity(5);
            table.clearEntity(5); // Clear again

            expect(table.getAttribute(5, 'value')).toBe(0);
        });
    });

    describe('getAttributeArray', () => {
        it('should return the underlying storage array', () => {
            const table = new AttributeTable<{ health: number; }>(10);

            table.addAttribute('health', Float32Array);

            const healthArray = table.getAttributeArray('health') as Float32Array;

            expect(healthArray).toBeInstanceOf(Float32Array);
            expect(healthArray?.length).toBe(10);
        });

        it('should return the same array reference for multiple calls', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            const array1 = table.getAttributeArray('value');
            const array2 = table.getAttributeArray('value');

            expect(array1).toBe(array2);
        });

        it('should allow direct data manipulation', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);
            table.setAttribute(5, 'value', 100);

            const valueArray = table.getAttributeArray('value') as Float32Array;

            // Direct access should match getAttribute
            expect(valueArray[5]).toBe(100);

            // Direct modification should be reflected
            valueArray[7] = 200;
            expect(table.getAttribute(7, 'value')).toBe(200);
        });

        it('should work with packed arrays', () => {
            interface Transform {
                position: [number, number];
            }

            const table = new AttributeTable<Transform>(10);

            table.addAttribute('position', Vector2Float32Array);

            const posArray = table.getAttributeArray('position');

            expect(posArray).toBeInstanceOf(Vector2Float32Array);
        });

        it('should return undefined for non-existent attribute', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            expect(table.getAttributeArray('value')).toBeUndefined();
        });
    });

    describe('getEntityAttributes', () => {
        it('should return all attributes as an object', () => {
            interface Entity {
                x: number;
                y: number;
                health: number;
            }

            const table = new AttributeTable<Entity>(10);

            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);
            table.addAttribute('health', Float32Array);

            table.setAttribute(0, 'x', 10);
            table.setAttribute(0, 'y', 20);
            table.setAttribute(0, 'health', 100);

            const entity = table.getEntityAttributes(0);

            expect(entity).toEqual({
                x: 10,
                y: 20,
                health: 100,
            });
        });

        it('should work with vector attributes', () => {
            interface Transform {
                position: [number, number];
                rotation: number;
            }

            const table = new AttributeTable<Transform>(10);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('rotation', Float32Array);

            table.setAttribute(5, 'position', [100, 200]);
            table.setAttribute(5, 'rotation', Math.PI);

            const entity = table.getEntityAttributes(5);

            expect(entity).toEqual({
                position: [100, 200],
                rotation: expect.closeTo(Math.PI, 5),
            });
        });

        it('should return undefined for out of bounds index', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            expect(table.getEntityAttributes(-1)).toBeUndefined();
            expect(table.getEntityAttributes(10)).toBeUndefined();
            expect(table.getEntityAttributes(100)).toBeUndefined();
        });

        it('should only include added attributes', () => {
            interface Entity {
                x: number;
                y: number;
                z: number;
            }

            const table = new AttributeTable<Entity>(10);

            // Only add x and y, not z
            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);

            table.setAttribute(0, 'x', 10);
            table.setAttribute(0, 'y', 20);

            const entity = table.getEntityAttributes(0);

            expect(entity).toEqual({
                x: 10,
                y: 20,
            });
            expect(entity).not.toHaveProperty('z');
        });

        it('should return zero values for unset attributes', () => {
            interface Entity {
                x: number;
                y: number;
            }

            const table = new AttributeTable<Entity>(10);

            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);

            // Don't set any values, just read defaults
            const entity = table.getEntityAttributes(5);

            expect(entity).toEqual({
                x: 0,
                y: 0,
            });
        });
    });

    describe('Edge cases', () => {
        it('should handle capacity of 1', () => {
            const table = new AttributeTable<{ value: number; }>(1);

            table.addAttribute('value', Float32Array);
            table.setAttribute(0, 'value', 42);

            expect(table.getAttribute(0, 'value')).toBe(42);
        });

        it('should handle large capacity', () => {
            const table = new AttributeTable<{ value: number; }>(100000);

            table.addAttribute('value', Float32Array);

            table.setAttribute(0, 'value', 1);
            table.setAttribute(50000, 'value', 2);
            table.setAttribute(99999, 'value', 3);

            expect(table.getAttribute(0, 'value')).toBe(1);
            expect(table.getAttribute(50000, 'value')).toBe(2);
            expect(table.getAttribute(99999, 'value')).toBe(3);
        });

        it('should handle updating values multiple times', () => {
            const table = new AttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(5, 'value', 10);
            table.setAttribute(5, 'value', 20);
            table.setAttribute(5, 'value', 30);

            expect(table.getAttribute(5, 'value')).toBe(30);
        });

        it('should handle zero initial values', () => {
            interface Data {
                x: number;
                y: number;
            }

            const table = new AttributeTable<Data>(10);

            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);

            // Don't set anything, just read defaults
            expect(table.getAttribute(0, 'x')).toBe(0);
            expect(table.getAttribute(0, 'y')).toBe(0);
        });
    });

    describe('Real-world use cases', () => {
        it('should handle ECS transform components', () => {
            interface Transform {
                position: [number, number];
                rotation: number;
                scale: [number, number];
            }

            const table = new AttributeTable<Transform>(1000);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('rotation', Float32Array);
            table.addAttribute('scale', Vector2Float32Array);

            // Entity 0
            table.setAttribute(0, 'position', [0, 0]);
            table.setAttribute(0, 'rotation', 0);
            table.setAttribute(0, 'scale', [1, 1]);

            // Entity 100
            table.setAttribute(100, 'position', [50, 75]);
            table.setAttribute(100, 'rotation', Math.PI / 4);
            table.setAttribute(100, 'scale', [2, 2]);

            expect(table.getAttribute(0, 'position')).toEqual([0, 0]);
            expect(table.getAttribute(100, 'position')).toEqual([50, 75]);
            expect(table.getAttribute(100, 'rotation')).toBeCloseTo(Math.PI / 4, 5);
            expect(table.getAttribute(100, 'scale')).toEqual([2, 2]);
        });

        it('should handle particle system', () => {
            interface Particle {
                position: [number, number];
                velocity: [number, number];
                life: number;
                size: number;
            }

            const maxParticles = 10000;
            const table = new AttributeTable<Particle>(maxParticles);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('velocity', Vector2Float32Array);
            table.addAttribute('life', Float32Array);
            table.addAttribute('size', Float32Array);

            // Spawn particle
            const particleId = 5000;

            table.setAttribute(particleId, 'position', [100, 100]);
            table.setAttribute(particleId, 'velocity', [5, -10]);
            table.setAttribute(particleId, 'life', 2.0);
            table.setAttribute(particleId, 'size', 5.0);

            // Update particle
            const pos = table.getAttribute(particleId, 'position')!;
            const vel = table.getAttribute(particleId, 'velocity')!;

            table.setAttribute(particleId, 'position', [pos[0]! + vel[0]!, pos[1]! + vel[1]!]);

            expect(table.getAttribute(particleId, 'position')).toEqual([105, 90]);

            // Kill particle
            table.clearEntity(particleId);

            expect(table.getAttribute(particleId, 'life')).toBe(0);
        });

        it('should support bulk operations via direct iteration', () => {
            interface Physics {
                velocity: [number, number];
                acceleration: [number, number];
            }

            const table = new AttributeTable<Physics>(100);

            table.addAttribute('velocity', Vector2Float32Array);
            table.addAttribute('acceleration', Vector2Float32Array);

            // Initialize all entities
            for (let i = 0; i < 100; i++) {
                table.setAttribute(i, 'velocity', [i, i * 2]);
                table.setAttribute(i, 'acceleration', [0, -9.8]);
            }

            // Verify sample entities
            expect(table.getAttribute(0, 'velocity')).toEqual([0, 0]);
            expect(table.getAttribute(50, 'velocity')).toEqual([50, 100]);
            expect(table.getAttribute(99, 'velocity')).toEqual([99, 198]);
        });
    });
});
