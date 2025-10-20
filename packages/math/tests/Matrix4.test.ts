import { describe, expect, it } from 'vitest';
import { Matrix4 } from '../dist/index.js';

describe('Matrix4', () => {
    describe('constructor', () => {
        it('should create identity matrix by default', () => {
            const m = new Matrix4();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        });

        it('should create matrix from array', () => {
            const m = new Matrix4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ]);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ]);
        });

        it('should create identity if array is wrong length', () => {
            const m = new Matrix4([1, 2, 3] as any);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        });
    });

    describe('static factory methods', () => {
        it('should create identity matrix', () => {
            const m = Matrix4.identity();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        });

        it('should create translation matrix', () => {
            const m = Matrix4.translation(5, 10, 15);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                5, 10, 15, 1,
            ]);
        });

        it('should create scaling matrix', () => {
            const m = Matrix4.scaling(2, 3, 4);
            const elements = m.getElements();

            expect(elements).toEqual([
                2, 0, 0, 0,
                0, 3, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 1,
            ]);
        });

        it('should create X rotation matrix', () => {
            const m = Matrix4.rotationX(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(1, 10);
            expect(elements[5]).toBeCloseTo(0, 10);
            expect(elements[6]).toBeCloseTo(1, 10);
            expect(elements[9]).toBeCloseTo(-1, 10);
            expect(elements[10]).toBeCloseTo(0, 10);
        });

        it('should create Y rotation matrix', () => {
            const m = Matrix4.rotationY(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[2]).toBeCloseTo(-1, 10);
            expect(elements[5]).toBeCloseTo(1, 10);
            expect(elements[8]).toBeCloseTo(1, 10);
            expect(elements[10]).toBeCloseTo(0, 10);
        });

        it('should create Z rotation matrix', () => {
            const m = Matrix4.rotationZ(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[1]).toBeCloseTo(1, 10);
            expect(elements[4]).toBeCloseTo(-1, 10);
            expect(elements[5]).toBeCloseTo(0, 10);
        });

        it('should create projection matrix', () => {
            const m = Matrix4.projection(16 / 9, 90, 0.1, 100);
            const elements = m.getElements();

            expect(elements[0]).toBeGreaterThan(0);
            expect(elements[5]).toBeGreaterThan(0);
            expect(elements[10]).toBeGreaterThan(0);
            expect(elements[11]).toBe(1);
        });

        it('should create ortho matrix', () => {
            const m = Matrix4.ortho(-1, 1, -1, 1, 0.1, 100);
            const elements = m.getElements();

            expect(elements[0]).toBe(1);
            expect(elements[5]).toBe(1);
            expect(elements[15]).toBe(1);
        });

        it('should multiply two matrices', () => {
            const m1 = Matrix4.translation(5, 10, 15);
            const m2 = Matrix4.scaling(2, 3, 4);
            const result = Matrix4.multiply(m1, m2);
            const elements = result.getElements();

            expect(elements[0]).toBe(2);
            expect(elements[5]).toBe(3);
            expect(elements[10]).toBe(4);
            expect(elements[12]).toBe(10);
            expect(elements[13]).toBe(30);
            expect(elements[14]).toBe(60);
        });
    });

    describe('toIdentity', () => {
        it('should set matrix to identity', () => {
            const m = Matrix4.translation(5, 10, 15);
            m.toIdentity();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.toIdentity();

            expect(result).toBe(m);
        });
    });

    describe('toTranslation', () => {
        it('should set matrix to translation', () => {
            const m = new Matrix4();
            m.toTranslation(5, 10, 15);
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                5, 10, 15, 1,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.toTranslation(5, 10, 15);

            expect(result).toBe(m);
        });
    });

    describe('toScaling', () => {
        it('should set matrix to scaling', () => {
            const m = new Matrix4();
            m.toScaling(2, 3, 4);
            const elements = m.getElements();

            expect(elements).toEqual([
                2, 0, 0, 0,
                0, 3, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 1,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.toScaling(2, 3, 4);

            expect(result).toBe(m);
        });
    });

    describe('toRotationX', () => {
        it('should set matrix to X rotation', () => {
            const m = new Matrix4();
            m.toRotationX(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(1, 10);
            expect(elements[5]).toBeCloseTo(0, 10);
            expect(elements[6]).toBeCloseTo(1, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.toRotationX(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('toRotationY', () => {
        it('should set matrix to Y rotation', () => {
            const m = new Matrix4();
            m.toRotationY(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[5]).toBeCloseTo(1, 10);
            expect(elements[10]).toBeCloseTo(0, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.toRotationY(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('toRotationZ', () => {
        it('should set matrix to Z rotation', () => {
            const m = new Matrix4();
            m.toRotationZ(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[1]).toBeCloseTo(1, 10);
            expect(elements[4]).toBeCloseTo(-1, 10);
            expect(elements[5]).toBeCloseTo(0, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.toRotationZ(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('multiply', () => {
        it('should multiply this matrix by another', () => {
            const m = Matrix4.translation(5, 10, 15);
            m.multiply(Matrix4.scaling(2, 3, 4));
            const elements = m.getElements();

            expect(elements[0]).toBe(2);
            expect(elements[5]).toBe(3);
            expect(elements[10]).toBe(4);
            expect(elements[12]).toBe(10);
            expect(elements[13]).toBe(30);
            expect(elements[14]).toBe(60);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.multiply(Matrix4.identity());

            expect(result).toBe(m);
        });
    });

    describe('translate', () => {
        it('should apply translation', () => {
            const m = Matrix4.scaling(2, 3, 4);
            m.translate(5, 10, 15);
            const elements = m.getElements();

            expect(elements[12]).toBe(5);
            expect(elements[13]).toBe(10);
            expect(elements[14]).toBe(15);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.translate(5, 10, 15);

            expect(result).toBe(m);
        });
    });

    describe('scale', () => {
        it('should apply scale', () => {
            const m = Matrix4.translation(5, 10, 15);
            m.scale(2, 3, 4);
            const elements = m.getElements();

            expect(elements[0]).toBe(2);
            expect(elements[5]).toBe(3);
            expect(elements[10]).toBe(4);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.scale(2, 3, 4);

            expect(result).toBe(m);
        });
    });

    describe('rotateX', () => {
        it('should apply X rotation', () => {
            const m = Matrix4.identity();
            m.rotateX(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(1, 10);
            expect(elements[5]).toBeCloseTo(0, 10);
            expect(elements[6]).toBeCloseTo(1, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.rotateX(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('rotateY', () => {
        it('should apply Y rotation', () => {
            const m = Matrix4.identity();
            m.rotateY(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[5]).toBeCloseTo(1, 10);
            expect(elements[10]).toBeCloseTo(0, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.rotateY(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('rotateZ', () => {
        it('should apply Z rotation', () => {
            const m = Matrix4.identity();
            m.rotateZ(Math.PI / 2);
            const elements = m.getElements();

            expect(elements[0]).toBeCloseTo(0, 10);
            expect(elements[1]).toBeCloseTo(1, 10);
            expect(elements[4]).toBeCloseTo(-1, 10);
            expect(elements[5]).toBeCloseTo(0, 10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.rotateZ(Math.PI / 2);

            expect(result).toBe(m);
        });
    });

    describe('transpose', () => {
        it('should transpose the matrix', () => {
            const m = new Matrix4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ]);
            m.transpose();
            const elements = m.getElements();

            expect(elements).toEqual([
                1, 5, 9, 13,
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16,
            ]);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.transpose();

            expect(result).toBe(m);
        });
    });

    describe('invert', () => {
        it('should invert the matrix', () => {
            const m = Matrix4.scaling(2, 4, 8);
            const result = m.invert();
            const elements = m.getElements();

            expect(result).toBe(m);
            expect(elements[0]).toBeCloseTo(0.5, 10);
            expect(elements[5]).toBeCloseTo(0.25, 10);
            expect(elements[10]).toBeCloseTo(0.125, 10);
        });

        it('should return null for singular matrix', () => {
            const m = new Matrix4([
                1, 2, 3, 4,
                2, 4, 6, 8,
                1, 2, 3, 4,
                0, 0, 0, 0,
            ]);
            const result = m.invert();

            expect(result).toBeNull();
        });

        it('should return this for non-singular matrix', () => {
            const m = Matrix4.translation(5, 10, 15);
            const result = m.invert();

            expect(result).toBe(m);
        });
    });

    describe('determinant', () => {
        it('should calculate determinant of identity as 1', () => {
            const m = Matrix4.identity();
            const det = m.determinant();

            expect(det).toBe(1);
        });

        it('should calculate determinant of scaling matrix', () => {
            const m = Matrix4.scaling(2, 3, 4);
            const det = m.determinant();

            expect(det).toBe(24);
        });

        it('should calculate determinant of singular matrix as 0', () => {
            const m = new Matrix4([
                1, 2, 3, 4,
                2, 4, 6, 8,
                1, 2, 3, 4,
                0, 0, 0, 0,
            ]);
            const det = m.determinant();

            expect(det).toBe(0);
        });
    });

    describe('toFloat32Array', () => {
        it('should convert to Float32Array in column-major order', () => {
            const m = new Matrix4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ]);
            const arr = m.toFloat32Array();

            expect(arr).toBeInstanceOf(Float32Array);
            expect(arr).toEqual(new Float32Array([
                1, 5, 9, 13,
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16,
            ]));
        });
    });

    describe('get', () => {
        it('should get element at row and column', () => {
            const m = new Matrix4([
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ]);

            expect(m.get(0, 0)).toBe(1);
            expect(m.get(0, 1)).toBe(2);
            expect(m.get(1, 2)).toBe(7);
            expect(m.get(3, 3)).toBe(16);
        });

        it('should throw for out of bounds indices', () => {
            const m = new Matrix4();

            expect(() => m.get(-1, 0)).toThrow();
            expect(() => m.get(0, 4)).toThrow();
            expect(() => m.get(4, 0)).toThrow();
        });
    });

    describe('set', () => {
        it('should set element at row and column', () => {
            const m = new Matrix4();

            m.set(0, 1, 5);
            m.set(3, 3, 10);

            expect(m.get(0, 1)).toBe(5);
            expect(m.get(3, 3)).toBe(10);
        });

        it('should return this for chaining', () => {
            const m = new Matrix4();
            const result = m.set(0, 0, 5);

            expect(result).toBe(m);
        });

        it('should throw for out of bounds indices', () => {
            const m = new Matrix4();

            expect(() => m.set(-1, 0, 5)).toThrow();
            expect(() => m.set(0, 4, 5)).toThrow();
            expect(() => m.set(4, 0, 5)).toThrow();
        });
    });

    describe('copy', () => {
        it('should copy values from another matrix', () => {
            const m1 = Matrix4.translation(5, 10, 15);
            const m2 = new Matrix4();
            m2.copy(m1);

            expect(m2.getElements()).toEqual(m1.getElements());
        });

        it('should return this for chaining', () => {
            const m1 = new Matrix4();
            const m2 = new Matrix4();
            const result = m2.copy(m1);

            expect(result).toBe(m2);
        });
    });

    describe('clone', () => {
        it('should create a new matrix with same values', () => {
            const m1 = Matrix4.translation(5, 10, 15);
            const m2 = m1.clone();

            expect(m2.getElements()).toEqual(m1.getElements());
            expect(m2).not.toBe(m1);
        });
    });

    describe('chaining', () => {
        it('should support method chaining', () => {
            const m = new Matrix4();
            const result = m
                .toIdentity()
                .translate(5, 10, 15)
                .scale(2, 3, 4)
                .rotateZ(Math.PI / 4);

            expect(result).toBe(m);
        });
    });
});
