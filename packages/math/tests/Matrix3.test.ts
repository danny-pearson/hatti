import { describe, expect, it } from 'vitest';
import { Matrix3 } from '../dist/index.js';

describe('Matrix3', () => {
    describe('constructor', () => {
        it('should create identity matrix by default', () => {
            const m = new Matrix3();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ]);
        });

        it('should create matrix from array', () => {
            const m = new Matrix3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ]);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ]);
        });

        it('should create identity if array is wrong length', () => {
            const m = new Matrix3([1, 2, 3] as any);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ]);
        });
    });

    describe('static factory methods', () => {
        it('should create identity matrix', () => {
            const m = Matrix3.identity();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ]);
        });

        it('should create translation matrix', () => {
            const m = Matrix3.translation(5, 10);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0,
                0, 1, 0,
                5, 10, 1,
            ]);
        });

        it('should create scaling matrix', () => {
            const m = Matrix3.scaling(2, 3);
            const elements = m.getElements();

            expect(elements).toEqual([
                2, 0, 0,
                0, 3, 0,
                0, 0, 1,
            ]);
        });

        it('should create rotation matrix', () => {
            const m = Matrix3.rotation(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[1]).toBeCloseTo(1, 10);
            expect(elements[3]).toBeCloseTo(-1, 10);
            expect(elements[4]).toBeCloseTo(0, 10);
        });

        it('should multiply two matrices', () => {
            const m1 = Matrix3.translation(5, 10);
            const m2 = Matrix3.scaling(2, 3);
            const result = Matrix3.multiply(m1, m2);
            const elements = result.getElements();

            expect(elements).toEqual([
                2, 0, 0,
                0, 3, 0,
                10, 30, 1,
            ]);
        });
    });

    describe('toIdentity', () => {
        it('should set matrix to identity', () => {
            const m = Matrix3.translation(5, 10);
            m.toIdentity();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.toIdentity();

            expect(result).toBe(m);
        });
    });

    describe('toTranslation', () => {
        it('should set matrix to translation', () => {
            const m = new Matrix3();
            m.toTranslation(5, 10);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0,
                0, 1, 0,
                5, 10, 1,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.toTranslation(5, 10);

            expect(result).toBe(m);
        });
    });

    describe('toScaling', () => {
        it('should set matrix to scaling', () => {
            const m = new Matrix3();
            m.toScaling(2, 3);
            const elements = m.getElements();

            expect(elements).toEqual([
                2, 0, 0,
                0, 3, 0,
                0, 0, 1,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.toScaling(2, 3);

            expect(result).toBe(m);
        });
    });

    describe('toRotation', () => {
        it('should set matrix to rotation', () => {
            const m = new Matrix3();
            m.toRotation(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[1]).toBeCloseTo(1, 10);
            expect(elements[3]).toBeCloseTo(-1, 10);
            expect(elements[4]).toBeCloseTo(0, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.toRotation(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('multiply', () => {
        it('should multiply this matrix by another', () => {
            const m = Matrix3.translation(5, 10);
            m.multiply(Matrix3.scaling(2, 3));
            const elements = m.getElements();

            expect(elements).toEqual([
                2, 0, 0,
                0, 3, 0,
                10, 30, 1,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.multiply(Matrix3.identity());

            expect(result).toBe(m);
        });
    });

    describe('translate', () => {
        it('should apply translation', () => {
            const m = Matrix3.scaling(2, 3);
            m.translate(5, 10);
            const elements = m.getElements();

            expect(elements[6]).toBe(5);
            expect(elements[7]).toBe(10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.translate(5, 10);

            expect(result).toBe(m);
        });
    });

    describe('scale', () => {
        it('should apply scale', () => {
            const m = Matrix3.translation(5, 10);
            m.scale(2, 3);
            const elements = m.getElements();

            expect(elements[0]).toBe(2);
            expect(elements[4]).toBe(3);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.scale(2, 3);

            expect(result).toBe(m);
        });
    });

    describe('rotate', () => {
        it('should apply rotation', () => {
            const m = Matrix3.identity();
            m.rotate(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[1]).toBeCloseTo(1, 10);
            expect(elements[3]).toBeCloseTo(-1, 10);
            expect(elements[4]).toBeCloseTo(0, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.rotate(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('transpose', () => {
        it('should transpose the matrix', () => {
            const m = new Matrix3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ]);
            m.transpose();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 4, 7,
                2, 5, 8,
                3, 6, 9,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.transpose();

            expect(result).toBe(m);
        });
    });

    describe('invert', () => {
        it('should invert the matrix', () => {
            const m = Matrix3.scaling(2, 4);
            const result = m.invert();
            const elements = m.getElements();

            expect(result).toBe(m);
            expect(elements[0]).toBeCloseTo(0.5, 10);
            expect(elements[4]).toBeCloseTo(0.25, 10);
        });

        it('should return null for singular matrix', () => {
            const m = new Matrix3([
                1, 2, 3,
                2, 4, 6,
                1, 2, 3,
            ]);
            const result = m.invert();

            expect(result).toBeNull();
        });

        it('should return this for non-singular matrix', () => {
            const m = Matrix3.translation(5, 10);
            const result = m.invert();

            expect(result).toBe(m);
        });
    });

    describe('determinant', () => {
        it('should calculate determinant of identity as 1', () => {
            const m = Matrix3.identity();
            const det = m.determinant();

            expect(det).toBe(1);
        });

        it('should calculate determinant of scaling matrix', () => {
            const m = Matrix3.scaling(2, 3);
            const det = m.determinant();

            expect(det).toBe(6);
        });

        it('should calculate determinant of singular matrix as 0', () => {
            const m = new Matrix3([
                1, 2, 3,
                2, 4, 6,
                1, 2, 3,
            ]);
            const det = m.determinant();

            expect(det).toBe(0);
        });
    });

    describe('clampScale', () => {
        it('should clamp scale values', () => {
            const m = Matrix3.scaling(5, 10);
            m.clampScale(1, 4);
            const elements = m.getElements();

            expect(elements[0]).toBe(4);
            expect(elements[4]).toBe(4);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.clampScale(1, 4);

            expect(result).toBe(m);
        });
    });

    describe('toCanvasTransform', () => {
        it('should convert to canvas transform format', () => {
            const m = Matrix3.translation(5, 10);
            const transform = m.toCanvasTransform();

            expect(transform).toEqual([1, 0, 0, 1, 5, 10]);
        });
    });

    describe('toArray', () => {
        it('should convert to array in column-major order', () => {
            const m = new Matrix3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ]);
            const arr = m.toArray();

            expect(arr).toEqual([
                1, 4, 7,
                2, 5, 8,
                3, 6, 9,
            ]);
        });
    });

    describe('toFloat32Array', () => {
        it('should convert to Float32Array in column-major order', () => {
            const m = new Matrix3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ]);
            const arr = m.toFloat32Array();

            expect(arr).toBeInstanceOf(Float32Array);
            expect(arr).toEqual(new Float32Array([
                1, 4, 7,
                2, 5, 8,
                3, 6, 9,
            ]));
        });
    });

    describe('get', () => {
        it('should get element at row and column', () => {
            const m = new Matrix3([
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ]);

            expect(m.get(0, 0)).toBe(1);
            expect(m.get(0, 1)).toBe(2);
            expect(m.get(1, 2)).toBe(6);
            expect(m.get(2, 1)).toBe(8);
        });

        it('should throw for out of bounds indices', () => {
            const m = new Matrix3();

            expect(() => m.get(-1, 0)).toThrow();
            expect(() => m.get(0, 3)).toThrow();
            expect(() => m.get(3, 0)).toThrow();
        });
    });

    describe('set', () => {
        it('should set element at row and column', () => {
            const m = new Matrix3();

            m.set(0, 1, 5);
            m.set(2, 2, 10);

            expect(m.get(0, 1)).toBe(5);
            expect(m.get(2, 2)).toBe(10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix3();
            const result = m.set(0, 0, 5);

            expect(result).toBe(m);
        });

        it('should throw for out of bounds indices', () => {
            const m = new Matrix3();

            expect(() => m.set(-1, 0, 5)).toThrow();
            expect(() => m.set(0, 3, 5)).toThrow();
            expect(() => m.set(3, 0, 5)).toThrow();
        });
    });

    describe('copy', () => {
        it('should copy values from another matrix', () => {
            const m1 = Matrix3.translation(5, 10);
            const m2 = new Matrix3();
            m2.copy(m1);

            expect(m2.getElements()).toEqual(m1.getElements());
        });

        it('should return this for chaining', () => {
            const m1 = new Matrix3();
            const m2 = new Matrix3();
            const result = m2.copy(m1);

            expect(result).toBe(m2);
        });
    });

    describe('clone', () => {
        it('should create a new matrix with same values', () => {
            const m1 = Matrix3.translation(5, 10);
            const m2 = m1.clone();

            expect(m2.getElements()).toEqual(m1.getElements());
            expect(m2).not.toBe(m1);
        });
    });

    describe('chaining', () => {
        it('should support method chaining', () => {
            const m = new Matrix3();
            const result = m
                .toIdentity()
                .translate(5, 10)
                .scale(2, 3)
                .rotate(Math.PI / 4);

            expect(result).toBe(m);
        });
    });
});
