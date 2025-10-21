import { describe, expect, it } from 'vitest';
import StructuredBuffer from '../dist/StructuredBuffer.js';

describe('StructuredBuffer', () => {
    describe('Basic construction and field access', () => {
        it('should create buffer with correct stride from field sizes', () => {
            type ParticleStruct = {
                x: number;
                y: number;
                vx: number;
                vy: number;
            };

            const record = {
                x: 1, y: 1, vx: 1, vy: 1,
            };
            const buffer = new StructuredBuffer<ParticleStruct, Float32Array>(
                record,
                Float32Array,
                10,
            );

            expect(buffer.stride).toBe(4);
            expect(buffer.count).toBe(10);
            expect(buffer.data.length).toBe(40);
        });

        it('should calculate stride automatically from mixed scalar and vector fields', () => {
            type MixedStruct = {
                position: [number, number];
                velocity: [number, number];
                mass: number;
            };

            const record = {
                position: 2, velocity: 2, mass: 1,
            };
            const buffer = new StructuredBuffer<MixedStruct, Float32Array>(
                record,
                Float32Array,
                5,
            );

            expect(buffer.stride).toBe(5); // 2 + 2 + 1
            expect(buffer.count).toBe(5);
            expect(buffer.data.length).toBe(25);
        });
    });

    describe('Scalar field access', () => {
        it('should get and set scalar fields', () => {
            type SimpleStruct = {
                id: number;
                mass: number;
                health: number;
            };

            const record = {
                id: 1, mass: 1, health: 1,
            };
            const buffer = new StructuredBuffer<SimpleStruct, Float32Array>(
                record,
                Float32Array,
                3,
            );

            buffer.setField(0, 'id', 100);
            buffer.setField(0, 'mass', 5.5);
            buffer.setField(0, 'health', 75);

            expect(buffer.getField(0, 'id')).toBe(100);
            expect(buffer.getField(0, 'mass')).toBe(5.5);
            expect(buffer.getField(0, 'health')).toBe(75);
        });

        it('should not interfere with other entity scalar fields', () => {
            type ScalarStruct = {
                a: number;
                b: number;
            };

            const record = { a: 1, b: 1 };
            const buffer = new StructuredBuffer<ScalarStruct, Float32Array>(
                record,
                Float32Array,
                3,
            );

            buffer.setField(0, 'a', 10);
            buffer.setField(0, 'b', 20);
            buffer.setField(1, 'a', 30);
            buffer.setField(1, 'b', 40);
            buffer.setField(2, 'a', 50);
            buffer.setField(2, 'b', 60);

            expect(buffer.getField(0, 'a')).toBe(10);
            expect(buffer.getField(0, 'b')).toBe(20);
            expect(buffer.getField(1, 'a')).toBe(30);
            expect(buffer.getField(1, 'b')).toBe(40);
            expect(buffer.getField(2, 'a')).toBe(50);
            expect(buffer.getField(2, 'b')).toBe(60);
        });
    });

    describe('Vector field access', () => {
        it('should get and set vector fields', () => {
            type VectorStruct = {
                position: [number, number];
                velocity: [number, number];
            };

            const record = { position: 2, velocity: 2 };
            const buffer = new StructuredBuffer<VectorStruct, Float32Array>(
                record,
                Float32Array,
                2,
            );

            buffer.setField(0, 'position', [10, 20]);
            buffer.setField(0, 'velocity', [1, 2]);

            expect(buffer.getField(0, 'position')).toEqual([10, 20]);
            expect(buffer.getField(0, 'velocity')).toEqual([1, 2]);
        });

        it('should handle 3D vectors', () => {
            type Vector3Struct = {
                position: [number, number, number];
                normal: [number, number, number];
            };

            const record = { position: 3, normal: 3 };
            const buffer = new StructuredBuffer<Vector3Struct, Float32Array>(
                record,
                Float32Array,
                2,
            );

            buffer.setField(0, 'position', [1, 2, 3]);
            buffer.setField(0, 'normal', [0, 1, 0]);

            expect(buffer.getField(0, 'position')).toEqual([1, 2, 3]);
            expect(buffer.getField(0, 'normal')).toEqual([0, 1, 0]);
        });

        it('should handle 4-component vectors (RGBA)', () => {
            type ColorStruct = {
                color: [number, number, number, number];
                emission: [number, number, number, number];
            };

            const record = { color: 4, emission: 4 };
            const buffer = new StructuredBuffer<ColorStruct, Uint8Array>(
                record,
                Uint8Array,
                2,
            );

            buffer.setField(0, 'color', [255, 128, 64, 255]);
            buffer.setField(0, 'emission', [0, 0, 0, 0]);

            expect(buffer.getField(0, 'color')).toEqual([255, 128, 64, 255]);
            expect(buffer.getField(0, 'emission')).toEqual([0, 0, 0, 0]);
        });
    });

    describe('Mixed scalar and vector fields', () => {
        it('should handle complex structs with mixed field types', () => {
            type ParticleStruct = {
                position: [number, number];
                velocity: [number, number];
                color: [number, number, number, number];
                mass: number;
            };

            const record = {
                position: 2, velocity: 2, color: 4, mass: 1,
            };
            const buffer = new StructuredBuffer<ParticleStruct, Float32Array>(
                record,
                Float32Array,
                10,
            );

            buffer.setField(5, 'position', [100, 200]);
            buffer.setField(5, 'velocity', [5, 10]);
            buffer.setField(5, 'color', [1, 0.5, 0.25, 1]);
            buffer.setField(5, 'mass', 2.5);

            expect(buffer.getField(5, 'position')).toEqual([100, 200]);
            expect(buffer.getField(5, 'velocity')).toEqual([5, 10]);
            expect(buffer.getField(5, 'color')).toEqual([1, 0.5, 0.25, 1]);
            expect(buffer.getField(5, 'mass')).toBe(2.5);
        });

        it('should maintain field independence across entities', () => {
            type EntityStruct = {
                position: [number, number];
                health: number;
            };

            const record = { position: 2, health: 1 };
            const buffer = new StructuredBuffer<EntityStruct, Float32Array>(
                record,
                Float32Array,
                3,
            );

            // Set all fields for entity 0
            buffer.setField(0, 'position', [10, 20]);
            buffer.setField(0, 'health', 100);

            // Set only position for entity 1
            buffer.setField(1, 'position', [30, 40]);

            // Set only health for entity 2
            buffer.setField(2, 'health', 50);

            // Verify entity 0 unchanged
            expect(buffer.getField(0, 'position')).toEqual([10, 20]);
            expect(buffer.getField(0, 'health')).toBe(100);

            // Verify entity 1 has only position set
            expect(buffer.getField(1, 'position')).toEqual([30, 40]);
            expect(buffer.getField(1, 'health')).toBe(0); // Default value

            // Verify entity 2 has only health set
            expect(buffer.getField(2, 'position')).toEqual([0, 0]); // Default value
            expect(buffer.getField(2, 'health')).toBe(50);
        });
    });

    describe('Field offset calculation', () => {
        it('should calculate offsets correctly for sequential fields', () => {
            type SequentialStruct = {
                a: number;
                b: number;
                c: number;
            };

            const record = {
                a: 1, b: 1, c: 1,
            };
            const buffer = new StructuredBuffer<SequentialStruct, Float32Array>(
                record,
                Float32Array,
                2,
            );

            buffer.setField(0, 'a', 1);
            buffer.setField(0, 'b', 2);
            buffer.setField(0, 'c', 3);

            // Verify data layout in underlying buffer
            expect(buffer.data[0]).toBe(1); // a at offset 0
            expect(buffer.data[1]).toBe(2); // b at offset 1
            expect(buffer.data[2]).toBe(3); // c at offset 2
        });

        it('should calculate offsets correctly for mixed field sizes', () => {
            type MixedOffsetStruct = {
                scalar1: number;
                vec2: [number, number];
                scalar2: number;
                vec3: [number, number, number];
            };

            const record = {
                scalar1: 1, vec2: 2, scalar2: 1, vec3: 3,
            };
            const buffer = new StructuredBuffer<MixedOffsetStruct, Float32Array>(
                record,
                Float32Array,
                1,
            );

            buffer.setField(0, 'scalar1', 1);
            buffer.setField(0, 'vec2', [2, 3]);
            buffer.setField(0, 'scalar2', 4);
            buffer.setField(0, 'vec3', [5, 6, 7]);

            // Verify contiguous layout
            expect(buffer.data[0]).toBe(1); // scalar1 at offset 0
            expect(buffer.data[1]).toBe(2); // vec2[0] at offset 1
            expect(buffer.data[2]).toBe(3); // vec2[1] at offset 2
            expect(buffer.data[3]).toBe(4); // scalar2 at offset 3
            expect(buffer.data[4]).toBe(5); // vec3[0] at offset 4
            expect(buffer.data[5]).toBe(6); // vec3[1] at offset 5
            expect(buffer.data[6]).toBe(7); // vec3[2] at offset 6
        });
    });

    describe('Multiple entities', () => {
        it('should handle multiple entities without interference', () => {
            type TransformStruct = {
                position: [number, number];
                rotation: number;
                scale: [number, number];
            };

            const record = {
                position: 2, rotation: 1, scale: 2,
            };
            const buffer = new StructuredBuffer<TransformStruct, Float32Array>(
                record,
                Float32Array,
                5,
            );

            // Set data for multiple entities
            for (let i = 0; i < 5; i++) {
                buffer.setField(i, 'position', [i * 10, i * 20]);
                buffer.setField(i, 'rotation', i * 45);
                buffer.setField(i, 'scale', [i + 1, i + 1]);
            }

            // Verify all entities
            for (let i = 0; i < 5; i++) {
                expect(buffer.getField(i, 'position')).toEqual([i * 10, i * 20]);
                expect(buffer.getField(i, 'rotation')).toBe(i * 45);
                expect(buffer.getField(i, 'scale')).toEqual([i + 1, i + 1]);
            }
        });

        it('should handle partial updates correctly', () => {
            type StateStruct = {
                x: number;
                y: number;
            };

            const record = { x: 1, y: 1 };
            const buffer = new StructuredBuffer<StateStruct, Float32Array>(
                record,
                Float32Array,
                3,
            );

            // Initial state
            buffer.setField(0, 'x', 1);
            buffer.setField(0, 'y', 2);
            buffer.setField(1, 'x', 3);
            buffer.setField(1, 'y', 4);
            buffer.setField(2, 'x', 5);
            buffer.setField(2, 'y', 6);

            // Update only entity 1's x value
            buffer.setField(1, 'x', 99);

            // Verify surrounding data unchanged
            expect(buffer.getField(0, 'x')).toBe(1);
            expect(buffer.getField(0, 'y')).toBe(2);
            expect(buffer.getField(1, 'x')).toBe(99);
            expect(buffer.getField(1, 'y')).toBe(4);
            expect(buffer.getField(2, 'x')).toBe(5);
            expect(buffer.getField(2, 'y')).toBe(6);
        });
    });

    describe('TypedArray types', () => {
        it('should work with Float32Array', () => {
            type FloatStruct = {
                value: number;
            };

            const record = { value: 1 };
            const buffer = new StructuredBuffer<FloatStruct, Float32Array>(
                record,
                Float32Array,
                2,
            );

            buffer.setField(0, 'value', 3.14159);
            expect(buffer.getField(0, 'value')).toBeCloseTo(3.14159, 5);
        });

        it('should work with Uint32Array', () => {
            type UintStruct = {
                id: number;
            };

            const record = { id: 1 };
            const buffer = new StructuredBuffer<UintStruct, Uint32Array>(
                record,
                Uint32Array,
                2,
            );

            buffer.setField(0, 'id', 4294967295); // Max uint32
            expect(buffer.getField(0, 'id')).toBe(4294967295);
        });

        it('should work with Uint8Array', () => {
            type ByteStruct = {
                r: number;
                g: number;
                b: number;
                a: number;
            };

            const record = {
                r: 1, g: 1, b: 1, a: 1,
            };
            const buffer = new StructuredBuffer<ByteStruct, Uint8Array>(
                record,
                Uint8Array,
                2,
            );

            buffer.setField(0, 'r', 255);
            buffer.setField(0, 'g', 128);
            buffer.setField(0, 'b', 64);
            buffer.setField(0, 'a', 255);

            expect(buffer.getField(0, 'r')).toBe(255);
            expect(buffer.getField(0, 'g')).toBe(128);
            expect(buffer.getField(0, 'b')).toBe(64);
            expect(buffer.getField(0, 'a')).toBe(255);
        });
    });

    describe('Edge cases', () => {
        it('should handle zero-capacity buffers', () => {
            type EmptyStruct = {
                value: number;
            };

            const record = { value: 1 };
            const buffer = new StructuredBuffer<EmptyStruct, Float32Array>(
                record,
                Float32Array,
                0,
            );

            expect(buffer.count).toBe(0);
            expect(buffer.stride).toBe(1);
            expect(buffer.data.length).toBe(0);
        });

        it('should handle single-field structs', () => {
            type SingleFieldStruct = {
                value: number;
            };

            const record = { value: 1 };
            const buffer = new StructuredBuffer<SingleFieldStruct, Float32Array>(
                record,
                Float32Array,
                5,
            );

            buffer.setField(2, 'value', 42);
            expect(buffer.getField(2, 'value')).toBe(42);
        });

        it('should handle large strides', () => {
            type LargeStruct = {
                mat4: number[]; // 16 elements
                extra: number;
            };

            const record = { mat4: 16, extra: 1 };
            const buffer = new StructuredBuffer<LargeStruct, Float32Array>(
                record,
                Float32Array,
                2,
            );

            const identity = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];

            buffer.setField(0, 'mat4', identity);
            buffer.setField(0, 'extra', 99);

            expect(buffer.stride).toBe(17);
            expect(buffer.getField(0, 'mat4')).toEqual(identity);
            expect(buffer.getField(0, 'extra')).toBe(99);
        });

        it('should handle accessing last entity', () => {
            type SimpleStruct = {
                value: number;
            };

            const record = { value: 1 };
            const count = 100;
            const buffer = new StructuredBuffer<SimpleStruct, Float32Array>(
                record,
                Float32Array,
                count,
            );

            buffer.setField(count - 1, 'value', 999);
            expect(buffer.getField(count - 1, 'value')).toBe(999);
        });
    });

    describe('Inheritance from PackedBuffer', () => {
        it('should provide access to base class properties', () => {
            type BaseStruct = {
                x: number;
                y: number;
            };

            const record = { x: 1, y: 1 };
            const buffer = new StructuredBuffer<BaseStruct, Float32Array>(
                record,
                Float32Array,
                5,
            );

            expect(buffer.stride).toBe(2);
            expect(buffer.count).toBe(5);
            expect(buffer.data).toBeInstanceOf(Float32Array);
            expect(buffer.data.length).toBe(10);
        });

        it('should work with base class at/set methods', () => {
            type VecStruct = {
                a: number;
                b: number;
            };

            const record = { a: 1, b: 1 };
            const buffer = new StructuredBuffer<VecStruct, Float32Array>(
                record,
                Float32Array,
                3,
            );

            // Use base class set (by index, not field name)
            buffer.set([10, 20], 0);
            buffer.set([30, 40], 1);

            // Use base class get
            expect(buffer.at(0)).toEqual([10, 20]);
            expect(buffer.at(1)).toEqual([30, 40]);

            // Verify getField still works
            expect(buffer.getField(0, 'a')).toBe(10);
            expect(buffer.getField(0, 'b')).toBe(20);
        });

        it('should support iteration from base class', () => {
            type IterStruct = {
                x: number;
                y: number;
            };

            const record = { x: 1, y: 1 };
            const buffer = new StructuredBuffer<IterStruct, Float32Array>(
                record,
                Float32Array,
                3,
            );

            buffer.setField(0, 'x', 1);
            buffer.setField(0, 'y', 2);
            buffer.setField(1, 'x', 3);
            buffer.setField(1, 'y', 4);
            buffer.setField(2, 'x', 5);
            buffer.setField(2, 'y', 6);

            const results = [...buffer];

            expect(results).toEqual([
                [1, 2],
                [3, 4],
                [5, 6],
            ]);
        });
    });

    describe('Real-world use cases', () => {
        it('should handle particle system data', () => {
            type Particle = {
                position: [number, number];
                velocity: [number, number];
                color: [number, number, number, number];
                life: number;
            };

            const record = {
                position: 2,
                velocity: 2,
                color: 4,
                life: 1,
            };

            const buffer = new StructuredBuffer<Particle, Float32Array>(
                record,
                Float32Array,
                1000,
            );

            // Set particle 500
            buffer.setField(500, 'position', [100, 200]);
            buffer.setField(500, 'velocity', [5, -10]);
            buffer.setField(500, 'color', [1, 0, 0, 0.8]);
            buffer.setField(500, 'life', 2.5);

            expect(buffer.stride).toBe(9); // 2 + 2 + 4 + 1
            expect(buffer.getField(500, 'position')).toEqual([100, 200]);
            expect(buffer.getField(500, 'velocity')).toEqual([5, -10]);

            const color = buffer.getField(500, 'color');
            expect(color[0]).toBe(1);
            expect(color[1]).toBe(0);
            expect(color[2]).toBe(0);
            expect(color[3]).toBeCloseTo(0.8, 5); // Float32 precision

            expect(buffer.getField(500, 'life')).toBe(2.5);
        });

        it('should handle GPU instance data', () => {
            type InstanceData = {
                position: [number, number];
                scale: [number, number];
                rotation: number;
                color: number; // Packed uint32
            };

            const record = {
                position: 2,
                scale: 2,
                rotation: 1,
                color: 1,
            };

            const buffer = new StructuredBuffer<InstanceData, Float32Array>(
                record,
                Float32Array,
                10000,
            );

            expect(buffer.stride).toBe(6);
            expect(buffer.data.length).toBe(60000);

            // Data is ready for GPU upload
            buffer.setField(0, 'position', [0, 0]);
            buffer.setField(0, 'scale', [1, 1]);
            buffer.setField(0, 'rotation', 0);
            buffer.setField(0, 'color', 0xFFFFFFFF);

            // Can pass buffer.data directly to WebGL
            expect(buffer.data).toBeInstanceOf(Float32Array);
        });
    });
});
