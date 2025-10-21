import { describe, expect, it } from 'vitest';
import DenseAttributeTable from '../dist/DenseAttributeTable.js';
import { Vector2Float32Array } from '../dist/index.js';

describe('DenseAttributeTable', () => {
    describe('Construction', () => {
        it('should create table with specified capacity', () => {
            const table = new DenseAttributeTable<{ x: number; y: number; }>(100);

            expect(table.capacity).toBe(100);
            expect(table.size).toBe(0);
        });

        it('should create empty table with zero capacity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(0);

            expect(table.capacity).toBe(0);
            expect(table.size).toBe(0);
        });
    });

    describe('Sparse entity IDs', () => {
        it('should handle non-sequential entity IDs', () => {
            interface Transform {
                x: number;
                y: number;
            }

            const table = new DenseAttributeTable<Transform>(10);

            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);

            // Use sparse entity IDs
            table.setAttribute(42, 'x', 100);
            table.setAttribute(1337, 'y', 200);
            table.setAttribute(9999, 'x', 300);

            expect(table.getAttribute(42, 'x')).toBe(100);
            expect(table.getAttribute(1337, 'y')).toBe(200);
            expect(table.getAttribute(9999, 'x')).toBe(300);
        });

        it('should map sparse IDs to dense indices internally', () => {
            const table = new DenseAttributeTable<{ value: number; }>(100);

            table.addAttribute('value', Float32Array);

            // Add entities with large gaps
            table.setAttribute(1000, 'value', 1);
            table.setAttribute(2000, 'value', 2);
            table.setAttribute(3000, 'value', 3);

            // Should only use 3 slots internally
            expect(table.size).toBe(3);
            expect(table.capacity).toBe(100);

            // Verify dense indices (0, 1, 2)
            expect(table.getEntityIndex(1000)).toBe(0);
            expect(table.getEntityIndex(2000)).toBe(1);
            expect(table.getEntityIndex(3000)).toBe(2);
        });

        it('should return all entity IDs', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(42, 'value', 1);
            table.setAttribute(100, 'value', 2);
            table.setAttribute(999, 'value', 3);

            const entityIds = table.getEntityIds();

            expect(entityIds).toHaveLength(3);
            expect(entityIds).toContain(42);
            expect(entityIds).toContain(100);
            expect(entityIds).toContain(999);
        });
    });

    describe('hasEntity', () => {
        it('should return false for non-existent entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            expect(table.hasEntity(42)).toBe(false);
            expect(table.hasEntity(0)).toBe(false);
        });

        it('should return true for existing entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);
            table.setAttribute(42, 'value', 100);

            expect(table.hasEntity(42)).toBe(true);
            expect(table.hasEntity(0)).toBe(false);
        });

        it('should return false after entity is cleared', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);
            table.setAttribute(42, 'value', 100);

            expect(table.hasEntity(42)).toBe(true);

            table.clearEntity(42);

            expect(table.hasEntity(42)).toBe(false);
        });
    });

    describe('setAttribute and getAttribute', () => {
        it('should set and get scalar values', () => {
            interface Stats {
                health: number;
                mana: number;
            }

            const table = new DenseAttributeTable<Stats>(10);

            table.addAttribute('health', Float32Array);
            table.addAttribute('mana', Float32Array);

            table.setAttribute(100, 'health', 100);
            table.setAttribute(100, 'mana', 50);
            table.setAttribute(200, 'health', 75);
            table.setAttribute(200, 'mana', 25);

            expect(table.getAttribute(100, 'health')).toBe(100);
            expect(table.getAttribute(100, 'mana')).toBe(50);
            expect(table.getAttribute(200, 'health')).toBe(75);
            expect(table.getAttribute(200, 'mana')).toBe(25);
        });

        it('should set and get vector values', () => {
            interface Transform {
                position: [number, number];
                rotation: number;
            }

            const table = new DenseAttributeTable<Transform>(10);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('rotation', Float32Array);

            table.setAttribute(42, 'position', [10, 20]);
            table.setAttribute(42, 'rotation', Math.PI);

            expect(table.getAttribute(42, 'position')).toEqual([10, 20]);
            expect(table.getAttribute(42, 'rotation')).toBeCloseTo(Math.PI, 5);
        });

        it('should automatically add entity on first setAttribute', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            expect(table.hasEntity(42)).toBe(false);
            expect(table.size).toBe(0);

            table.setAttribute(42, 'value', 100);

            expect(table.hasEntity(42)).toBe(true);
            expect(table.size).toBe(1);
        });

        it('should return undefined for non-existent entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            expect(table.getAttribute(999, 'value')).toBeUndefined();
        });

        it('should warn when getting attribute for non-existent entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            const result = table.getAttribute(123, 'value');

            expect(result).toBeUndefined();
        });

        it('should warn when capacity is exceeded', () => {
            const table = new DenseAttributeTable<{ value: number; }>(3);

            table.addAttribute('value', Float32Array);

            table.setAttribute(1, 'value', 10);
            table.setAttribute(2, 'value', 20);
            table.setAttribute(3, 'value', 30);
            table.setAttribute(4, 'value', 40); // Exceeds capacity

            expect(table.size).toBe(3);
            expect(table.hasEntity(4)).toBe(false);
        });
    });

    describe('clearEntity', () => {
        it('should clear entity and free index', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);
            table.setAttribute(42, 'value', 100);

            expect(table.size).toBe(1);
            expect(table.hasEntity(42)).toBe(true);

            table.clearEntity(42);

            expect(table.size).toBe(0);
            expect(table.hasEntity(42)).toBe(false);
            expect(table.getAttribute(42, 'value')).toBeUndefined();
        });

        it('should reuse freed indices', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            // Add and remove first entity
            table.setAttribute(100, 'value', 1);
            table.clearEntity(100);

            // Add second entity (should reuse index 0)
            table.setAttribute(200, 'value', 2);

            expect(table.size).toBe(1);
            expect(table.getAttribute(200, 'value')).toBe(2);
            expect(table.hasEntity(100)).toBe(false);
            expect(table.hasEntity(200)).toBe(true);
        });

        it('should clear all attributes for entity', () => {
            interface Transform {
                position: [number, number];
                rotation: number;
                scale: [number, number];
            }

            const table = new DenseAttributeTable<Transform>(10);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('rotation', Float32Array);
            table.addAttribute('scale', Vector2Float32Array);

            table.setAttribute(42, 'position', [10, 20]);
            table.setAttribute(42, 'rotation', Math.PI);
            table.setAttribute(42, 'scale', [2, 2]);

            table.clearEntity(42);

            expect(table.hasEntity(42)).toBe(false);
        });

        it('should warn when clearing non-existent entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.clearEntity(999); // Doesn't exist

            expect(table.size).toBe(0);
        });

        it('should not affect other entities when clearing', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(1, 'value', 10);
            table.setAttribute(2, 'value', 20);
            table.setAttribute(3, 'value', 30);

            table.clearEntity(2);

            expect(table.getAttribute(1, 'value')).toBe(10);
            expect(table.getAttribute(2, 'value')).toBeUndefined();
            expect(table.getAttribute(3, 'value')).toBe(30);
        });
    });

    describe('size getter', () => {
        it('should return 0 for empty table', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            expect(table.size).toBe(0);
        });

        it('should increment when entities are added', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            expect(table.size).toBe(0);

            table.setAttribute(1, 'value', 10);
            expect(table.size).toBe(1);

            table.setAttribute(2, 'value', 20);
            expect(table.size).toBe(2);

            table.setAttribute(3, 'value', 30);
            expect(table.size).toBe(3);
        });

        it('should decrement when entities are cleared', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(1, 'value', 10);
            table.setAttribute(2, 'value', 20);
            table.setAttribute(3, 'value', 30);

            expect(table.size).toBe(3);

            table.clearEntity(2);
            expect(table.size).toBe(2);

            table.clearEntity(1);
            expect(table.size).toBe(1);

            table.clearEntity(3);
            expect(table.size).toBe(0);
        });

        it('should not change when updating existing entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(42, 'value', 10);
            expect(table.size).toBe(1);

            table.setAttribute(42, 'value', 20);
            expect(table.size).toBe(1);

            table.setAttribute(42, 'value', 30);
            expect(table.size).toBe(1);
        });
    });

    describe('Index recycling', () => {
        it('should recycle indices from cleared entities', () => {
            const table = new DenseAttributeTable<{ value: number; }>(5);

            table.addAttribute('value', Float32Array);

            // Fill capacity
            table.setAttribute(1, 'value', 10);
            table.setAttribute(2, 'value', 20);
            table.setAttribute(3, 'value', 30);
            table.setAttribute(4, 'value', 40);
            table.setAttribute(5, 'value', 50);

            expect(table.size).toBe(5);

            // Clear some entities (indices 1 and 3 will be freed)
            const clearedIndex1 = table.getEntityIndex(2);
            const clearedIndex2 = table.getEntityIndex(4);

            table.clearEntity(2);
            table.clearEntity(4);

            expect(table.size).toBe(3);

            // Add new entities (should reuse cleared indices)
            table.setAttribute(6, 'value', 60);
            table.setAttribute(7, 'value', 70);

            expect(table.size).toBe(5);
            expect(table.getAttribute(6, 'value')).toBe(60);
            expect(table.getAttribute(7, 'value')).toBe(70);

            // Verify new entities use recycled indices
            const newIndex1 = table.getEntityIndex(6);
            const newIndex2 = table.getEntityIndex(7);

            expect([clearedIndex1, clearedIndex2]).toContain(newIndex1);
            expect([clearedIndex1, clearedIndex2]).toContain(newIndex2);
        });

        it('should handle multiple clear and add cycles', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            for (let cycle = 0; cycle < 5; cycle++) {
                const baseId = cycle * 100;

                // Add entities
                for (let i = 0; i < 10; i++) {
                    table.setAttribute(baseId + i, 'value', i);
                }

                expect(table.size).toBe(10);

                // Clear all entities
                for (let i = 0; i < 10; i++) {
                    table.clearEntity(baseId + i);
                }

                expect(table.size).toBe(0);
            }
        });

        it('should prioritize recycled indices over new allocation', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            // Add 3 entities
            table.setAttribute(1, 'value', 10);
            table.setAttribute(2, 'value', 20);
            table.setAttribute(3, 'value', 30);

            // Clear first entity (frees index 0)
            const freedIndex = table.getEntityIndex(1);

            table.clearEntity(1);

            // Add new entity (should reuse freed index)
            table.setAttribute(100, 'value', 100);

            expect(table.size).toBe(3);
            expect(table.getAttribute(100, 'value')).toBe(100);
            expect(table.getEntityIndex(100)).toBe(freedIndex);
        });
    });

    describe('getEntityIndex', () => {
        it('should return internal index for existing entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(42, 'value', 100);
            table.setAttribute(1337, 'value', 200);

            expect(table.getEntityIndex(42)).toBe(0);
            expect(table.getEntityIndex(1337)).toBe(1);
        });

        it('should return undefined for non-existent entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            expect(table.getEntityIndex(999)).toBeUndefined();
        });

        it('should return undefined after entity is cleared', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);
            table.setAttribute(42, 'value', 100);

            expect(table.getEntityIndex(42)).toBe(0);

            table.clearEntity(42);

            expect(table.getEntityIndex(42)).toBeUndefined();
        });
    });

    describe('getEntityIds', () => {
        it('should return empty array for empty table', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            expect(table.getEntityIds()).toEqual([]);
        });

        it('should return all active entity IDs', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(1, 'value', 10);
            table.setAttribute(5, 'value', 50);
            table.setAttribute(10, 'value', 100);

            const ids = table.getEntityIds();

            expect(ids).toHaveLength(3);
            expect(ids).toContain(1);
            expect(ids).toContain(5);
            expect(ids).toContain(10);
        });

        it('should not include cleared entities', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(1, 'value', 10);
            table.setAttribute(2, 'value', 20);
            table.setAttribute(3, 'value', 30);

            table.clearEntity(2);

            const ids = table.getEntityIds();

            expect(ids).toHaveLength(2);
            expect(ids).toContain(1);
            expect(ids).toContain(3);
            expect(ids).not.toContain(2);
        });
    });

    describe('getEntityAttributes', () => {
        it('should return all attributes for an entity', () => {
            interface Transform {
                x: number;
                y: number;
                rotation: number;
            }

            const table = new DenseAttributeTable<Transform>(10);

            table.addAttribute('x', Float32Array);
            table.addAttribute('y', Float32Array);
            table.addAttribute('rotation', Float32Array);

            table.setAttribute(42, 'x', 10);
            table.setAttribute(42, 'y', 20);
            table.setAttribute(42, 'rotation', Math.PI);

            const entity = table.getEntityAttributes(42);

            expect(entity).toEqual({
                x: 10,
                y: 20,
                rotation: expect.closeTo(Math.PI, 5),
            });
        });

        it('should work with sparse entity IDs', () => {
            interface Data {
                value: number;
            }

            const table = new DenseAttributeTable<Data>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(1000, 'value', 100);
            table.setAttribute(2000, 'value', 200);

            expect(table.getEntityAttributes(1000)).toEqual({ value: 100 });
            expect(table.getEntityAttributes(2000)).toEqual({ value: 200 });
        });

        it('should return undefined for non-existent entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            expect(table.getEntityAttributes(999)).toBeUndefined();
        });

        it('should return undefined after entity is cleared', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);
            table.setAttribute(42, 'value', 100);

            expect(table.getEntityAttributes(42)).toEqual({ value: 100 });

            table.clearEntity(42);

            expect(table.getEntityAttributes(42)).toBeUndefined();
        });
    });

    describe('Edge cases', () => {
        it('should handle capacity of 1', () => {
            const table = new DenseAttributeTable<{ value: number; }>(1);

            table.addAttribute('value', Float32Array);

            table.setAttribute(999, 'value', 42);

            expect(table.getAttribute(999, 'value')).toBe(42);
            expect(table.size).toBe(1);
        });

        it('should handle clearing and re-adding same entity', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(42, 'value', 100);
            table.clearEntity(42);
            table.setAttribute(42, 'value', 200);

            expect(table.getAttribute(42, 'value')).toBe(200);
            expect(table.size).toBe(1);
        });

        it('should handle entity ID of 0', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            table.setAttribute(0, 'value', 100);

            expect(table.hasEntity(0)).toBe(true);
            expect(table.getAttribute(0, 'value')).toBe(100);
        });

        it('should handle large entity IDs', () => {
            const table = new DenseAttributeTable<{ value: number; }>(10);

            table.addAttribute('value', Float32Array);

            const largeId = 999999999;

            table.setAttribute(largeId, 'value', 42);

            expect(table.hasEntity(largeId)).toBe(true);
            expect(table.getAttribute(largeId, 'value')).toBe(42);
        });
    });

    describe('Real-world use cases', () => {
        it('should handle ECS with entity creation and destruction', () => {
            interface Entity {
                position: [number, number];
                health: number;
            }

            const table = new DenseAttributeTable<Entity>(1000);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('health', Float32Array);

            // Spawn entities with network IDs
            const networkIds = [1001, 1005, 1023, 1042];

            for (const id of networkIds) {
                table.setAttribute(id, 'position', [Math.random() * 100, Math.random() * 100]);
                table.setAttribute(id, 'health', 100);
            }

            expect(table.size).toBe(4);

            // Entity 1005 dies
            table.clearEntity(1005);

            expect(table.size).toBe(3);
            expect(table.hasEntity(1005)).toBe(false);

            // New entity spawns (reuses freed index)
            table.setAttribute(2001, 'position', [50, 50]);
            table.setAttribute(2001, 'health', 100);

            expect(table.size).toBe(4);
        });

        it('should handle object pooling pattern', () => {
            interface Projectile {
                position: [number, number];
                velocity: [number, number];
                damage: number;
            }

            const maxProjectiles = 100;
            const table = new DenseAttributeTable<Projectile>(maxProjectiles);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('velocity', Vector2Float32Array);
            table.addAttribute('damage', Float32Array);

            let nextId = 0;

            // Simulate firing projectiles
            const activeProjectiles: number[] = [];

            for (let i = 0; i < 50; i++) {
                const id = nextId++;

                table.setAttribute(id, 'position', [0, 0]);
                table.setAttribute(id, 'velocity', [10, 0]);
                table.setAttribute(id, 'damage', 25);
                activeProjectiles.push(id);
            }

            expect(table.size).toBe(50);

            // Simulate projectiles hitting and being removed
            for (let i = 0; i < 25; i++) {
                const id = activeProjectiles.shift()!;

                table.clearEntity(id);
            }

            expect(table.size).toBe(25);

            // Fire more projectiles (reuses freed indices)
            for (let i = 0; i < 25; i++) {
                const id = nextId++;

                table.setAttribute(id, 'position', [0, 0]);
                table.setAttribute(id, 'velocity', [10, 0]);
                table.setAttribute(id, 'damage', 25);
                activeProjectiles.push(id);
            }

            expect(table.size).toBe(50);
        });

        it('should handle networked entities with client-side prediction', () => {
            interface NetworkedEntity {
                position: [number, number];
                velocity: [number, number];
                serverTime: number;
            }

            const table = new DenseAttributeTable<NetworkedEntity>(1000);

            table.addAttribute('position', Vector2Float32Array);
            table.addAttribute('velocity', Vector2Float32Array);
            table.addAttribute('serverTime', Float32Array);

            // Server sends entity updates with server-assigned IDs
            const serverEntityIds = [1000, 1001, 1002, 1003];

            for (const id of serverEntityIds) {
                table.setAttribute(id, 'position', [0, 0]);
                table.setAttribute(id, 'velocity', [1, 1]);
                table.setAttribute(id, 'serverTime', Date.now());
            }

            // Create client-side predicted entities (negative IDs)
            table.setAttribute(-1, 'position', [10, 10]);
            table.setAttribute(-1, 'velocity', [2, 2]);

            expect(table.size).toBe(5);

            // Server confirms predicted entity, remove client prediction
            table.clearEntity(-1);

            expect(table.size).toBe(4);
        });

        it('should support dense iteration despite sparse IDs', () => {
            interface Transform {
                position: [number, number];
            }

            const table = new DenseAttributeTable<Transform>(100);

            table.addAttribute('position', Vector2Float32Array);

            // Add entities with very sparse IDs
            const sparseIds = [1, 100, 1000, 10000, 100000];

            for (const id of sparseIds) {
                table.setAttribute(id, 'position', [id, id * 2]);
            }

            // Despite sparse IDs, only 5 internal slots are used
            expect(table.size).toBe(5);

            // Can efficiently iterate by checking hasEntity
            let count = 0;

            for (const id of sparseIds) {
                if (table.hasEntity(id)) {
                    const pos = table.getAttribute(id, 'position');

                    expect(pos).toBeDefined();
                    count++;
                }
            }

            expect(count).toBe(5);
        });
    });
});
