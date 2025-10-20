import { describe, expect, it } from 'vitest';
import { Mat4Ops } from '../dist/index.js';

describe('Mat4Ops', () => {
    describe('identity', () => {
        it('should create an identity matrix', () => {
            const m = Mat4Ops.identity();

            expect(m).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        });

        it('should create identity matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.identityMut(m);

            expect(result).toBe(m);
            expect(m).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        });
    });

    describe('translation', () => {
        it('should create a translation matrix', () => {
            const m = Mat4Ops.translation(5, 10, 15);

            expect(m).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                5, 10, 15, 1,
            ]);
        });

        it('should create translation matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.translationMut(m, 5, 10, 15);

            expect(result).toBe(m);
            expect(m).toEqual([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                5, 10, 15, 1,
            ]);
        });
    });

    describe('scaling', () => {
        it('should create a scaling matrix', () => {
            const m = Mat4Ops.scaling(2, 3, 4);

            expect(m).toEqual([
                2, 0, 0, 0,
                0, 3, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 1,
            ]);
        });

        it('should create scaling matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.scalingMut(m, 2, 3, 4);

            expect(result).toBe(m);
            expect(m).toEqual([
                2, 0, 0, 0,
                0, 3, 0, 0,
                0, 0, 4, 0,
                0, 0, 0, 1,
            ]);
        });
    });

    describe('rotationX', () => {
        it('should create a rotation matrix around X axis', () => {
            const m = Mat4Ops.rotationX(Math.PI / 2);

            expect(m[0]).toBeCloseTo(1, 10);
            expect(m[5]).toBeCloseTo(0, 10);
            expect(m[6]).toBeCloseTo(1, 10);
            expect(m[9]).toBeCloseTo(-1, 10);
            expect(m[10]).toBeCloseTo(0, 10);
        });

        it('should create rotation matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.rotationXMut(m, Math.PI / 2);

            expect(result).toBe(m);
            expect(m[0]).toBeCloseTo(1, 10);
            expect(m[5]).toBeCloseTo(0, 10);
            expect(m[6]).toBeCloseTo(1, 10);
        });
    });

    describe('rotationY', () => {
        it('should create a rotation matrix around Y axis', () => {
            const m = Mat4Ops.rotationY(Math.PI / 2);

            expect(m[0]).toBeCloseTo(0, 10);
            expect(m[2]).toBeCloseTo(-1, 10);
            expect(m[5]).toBeCloseTo(1, 10);
            expect(m[8]).toBeCloseTo(1, 10);
            expect(m[10]).toBeCloseTo(0, 10);
        });

        it('should create rotation matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.rotationYMut(m, Math.PI / 2);

            expect(result).toBe(m);
            expect(m[0]).toBeCloseTo(0, 10);
            expect(m[5]).toBeCloseTo(1, 10);
        });
    });

    describe('rotationZ', () => {
        it('should create a rotation matrix around Z axis', () => {
            const m = Mat4Ops.rotationZ(Math.PI / 2);

            expect(m[0]).toBeCloseTo(0, 10);
            expect(m[1]).toBeCloseTo(1, 10);
            expect(m[4]).toBeCloseTo(-1, 10);
            expect(m[5]).toBeCloseTo(0, 10);
            expect(m[10]).toBeCloseTo(1, 10);
        });

        it('should create rotation matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.rotationZMut(m, Math.PI / 2);

            expect(result).toBe(m);
            expect(m[0]).toBeCloseTo(0, 10);
            expect(m[1]).toBeCloseTo(1, 10);
        });
    });

    describe('projection', () => {
        it('should create a perspective projection matrix', () => {
            const m = Mat4Ops.projection(16 / 9, 90, 0.1, 100);

            expect(m[0]).toBeGreaterThan(0);
            expect(m[5]).toBeGreaterThan(0);
            expect(m[10]).toBeGreaterThan(0);
            expect(m[11]).toBe(1);
            expect(m[14]).toBeLessThan(0);
        });

        it('should create projection matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.projectionMut(m, 16 / 9, 90, 0.1, 100);

            expect(result).toBe(m);
            expect(m[0]).toBeGreaterThan(0);
            expect(m[5]).toBeGreaterThan(0);
        });
    });

    describe('ortho', () => {
        it('should create an orthographic projection matrix', () => {
            const m = Mat4Ops.ortho(-1, 1, -1, 1, 0.1, 100);

            expect(m[0]).toBe(1);
            expect(m[5]).toBe(1);
            expect(m[10]).toBeCloseTo(-0.02002002002002002, 10);
            expect(m[14]).toBeCloseTo(-1.002002002002002, 10);
            expect(m[15]).toBe(1);
        });

        it('should create ortho matrix (mutating)', () => {
            const m = new Array(16).fill(0) as any;
            const result = Mat4Ops.orthoMut(m, -1, 1, -1, 1, 0.1, 100);

            expect(result).toBe(m);
            expect(m[0]).toBe(1);
            expect(m[5]).toBe(1);
        });
    });

    describe('multiply', () => {
        it('should multiply two matrices', () => {
            const m1 = Mat4Ops.translation(5, 10, 15);
            const m2 = Mat4Ops.scaling(2, 3, 4);
            const result = Mat4Ops.multiply(m1, m2);

            expect(result[0]).toBe(2);
            expect(result[5]).toBe(3);
            expect(result[10]).toBe(4);
            expect(result[12]).toBe(10);
            expect(result[13]).toBe(30);
            expect(result[14]).toBe(60);
        });

        it('should multiply identity by any matrix to get the same matrix', () => {
            const m = Mat4Ops.translation(5, 10, 15);
            const identity = Mat4Ops.identity();
            const result = Mat4Ops.multiply(identity, m);

            expect(result).toEqual(m);
        });

        it('should multiply matrices (mutating)', () => {
            const out = new Array(16).fill(0) as any;
            const m1 = Mat4Ops.translation(5, 10, 15);
            const m2 = Mat4Ops.scaling(2, 3, 4);
            const result = Mat4Ops.multiplyMut(out, m1, m2);

            expect(result).toBe(out);
            expect(out[0]).toBe(2);
            expect(out[5]).toBe(3);
            expect(out[10]).toBe(4);
        });
    });

    describe('transpose', () => {
        it('should transpose a matrix', () => {
            const m = [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ] as any;
            const result = Mat4Ops.transpose(m);

            expect(result).toEqual([
                1, 5, 9, 13,
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16,
            ]);
        });

        it('should transpose identity to get identity', () => {
            const m = Mat4Ops.identity();
            const result = Mat4Ops.transpose(m);

            expect(result).toEqual(m);
        });

        it('should transpose matrix (mutating)', () => {
            const m = [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ] as any;
            const result = Mat4Ops.transposeMut(m, m);

            expect(result).toBe(m);
            expect(m).toEqual([
                1, 5, 9, 13,
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16,
            ]);
        });
    });

    describe('determinant', () => {
        it('should calculate determinant of identity as 1', () => {
            const m = Mat4Ops.identity();
            const det = Mat4Ops.determinant(m);

            expect(det).toBe(1);
        });

        it('should calculate determinant of scaling matrix', () => {
            const m = Mat4Ops.scaling(2, 3, 4);
            const det = Mat4Ops.determinant(m);

            expect(det).toBe(24);
        });

        it('should calculate determinant of singular matrix as 0', () => {
            const m = [
                1, 2, 3, 4,
                2, 4, 6, 8,
                1, 2, 3, 4,
                0, 0, 0, 0,
            ] as any;
            const det = Mat4Ops.determinant(m);

            expect(det).toBe(0);
        });
    });

    describe('invert', () => {
        it('should invert identity to get identity', () => {
            const m = Mat4Ops.identity();
            const inv = Mat4Ops.invert(m);

            expect(inv).not.toBeNull();
            expect(inv).toEqual(m);
        });

        it('should return null for singular matrix', () => {
            const m = [
                1, 2, 3, 4,
                2, 4, 6, 8,
                1, 2, 3, 4,
                0, 0, 0, 0,
            ] as any;
            const inv = Mat4Ops.invert(m);

            expect(inv).toBeNull();
        });

        it('should invert scaling matrix', () => {
            const m = Mat4Ops.scaling(2, 4, 8);
            const inv = Mat4Ops.invert(m);

            expect(inv).not.toBeNull();
            expect(inv![0]).toBeCloseTo(0.5, 10);
            expect(inv![5]).toBeCloseTo(0.25, 10);
            expect(inv![10]).toBeCloseTo(0.125, 10);
        });

        it('should multiply matrix by its inverse to get identity', () => {
            const m = Mat4Ops.translation(5, 10, 15);
            const inv = Mat4Ops.invert(m);

            expect(inv).not.toBeNull();

            const result = Mat4Ops.multiply(m, inv!);

            for (let i = 0; i < 16; i++) {
                const expected = (i % 5 === 0) ? 1 : 0;
                expect(result[i]).toBeCloseTo(expected, 10);
            }
        });

        it('should invert matrix (mutating)', () => {
            const m = Mat4Ops.scaling(2, 4, 8);
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.invertMut(out, m);

            expect(result).toBe(out);
            expect(out[0]).toBeCloseTo(0.5, 10);
            expect(out[5]).toBeCloseTo(0.25, 10);
            expect(out[10]).toBeCloseTo(0.125, 10);
        });

        it('should return null for singular matrix (mutating)', () => {
            const m = [
                1, 2, 3, 4,
                2, 4, 6, 8,
                1, 2, 3, 4,
                0, 0, 0, 0,
            ] as any;
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.invertMut(out, m);

            expect(result).toBeNull();
        });
    });

    describe('translate', () => {
        it('should apply translation to matrix', () => {
            const m = Mat4Ops.scaling(2, 3, 4);
            const result = Mat4Ops.translate(m, 5, 10, 15);

            expect(result[12]).toBe(5);
            expect(result[13]).toBe(10);
            expect(result[14]).toBe(15);
        });

        it('should apply translation (mutating)', () => {
            const m = Mat4Ops.scaling(2, 3, 4);
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.translateMut(out, m, 5, 10, 15);

            expect(result).toBe(out);
            expect(out[12]).toBe(10);
            expect(out[13]).toBe(30);
            expect(out[14]).toBe(60);
        });
    });

    describe('scale', () => {
        it('should apply scale to matrix', () => {
            const m = Mat4Ops.translation(5, 10, 15);
            const result = Mat4Ops.scale(m, 2, 3, 4);

            expect(result[0]).toBe(2);
            expect(result[5]).toBe(3);
            expect(result[10]).toBe(4);
        });

        it('should apply scale (mutating)', () => {
            const m = Mat4Ops.translation(5, 10, 15);
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.scaleMut(out, m, 2, 3, 4);

            expect(result).toBe(out);
            expect(out[0]).toBe(2);
            expect(out[5]).toBe(3);
            expect(out[10]).toBe(4);
        });
    });

    describe('rotateX', () => {
        it('should apply X rotation to matrix', () => {
            const m = Mat4Ops.identity();
            const result = Mat4Ops.rotateX(m, Math.PI / 2);

            expect(result[0]).toBeCloseTo(1, 10);
            expect(result[5]).toBeCloseTo(0, 10);
            expect(result[6]).toBeCloseTo(1, 10);
        });

        it('should apply X rotation (mutating)', () => {
            const m = Mat4Ops.identity();
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.rotateXMut(out, m, Math.PI / 2);

            expect(result).toBe(out);
            expect(out[0]).toBeCloseTo(1, 10);
            expect(out[5]).toBeCloseTo(0, 10);
        });
    });

    describe('rotateY', () => {
        it('should apply Y rotation to matrix', () => {
            const m = Mat4Ops.identity();
            const result = Mat4Ops.rotateY(m, Math.PI / 2);

            expect(result[0]).toBeCloseTo(0, 10);
            expect(result[5]).toBeCloseTo(1, 10);
            expect(result[10]).toBeCloseTo(0, 10);
        });

        it('should apply Y rotation (mutating)', () => {
            const m = Mat4Ops.identity();
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.rotateYMut(out, m, Math.PI / 2);

            expect(result).toBe(out);
            expect(out[0]).toBeCloseTo(0, 10);
            expect(out[5]).toBeCloseTo(1, 10);
        });
    });

    describe('rotateZ', () => {
        it('should apply Z rotation to matrix', () => {
            const m = Mat4Ops.identity();
            const result = Mat4Ops.rotateZ(m, Math.PI / 2);

            expect(result[0]).toBeCloseTo(0, 10);
            expect(result[1]).toBeCloseTo(1, 10);
            expect(result[10]).toBeCloseTo(1, 10);
        });

        it('should apply Z rotation (mutating)', () => {
            const m = Mat4Ops.identity();
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.rotateZMut(out, m, Math.PI / 2);

            expect(result).toBe(out);
            expect(out[0]).toBeCloseTo(0, 10);
            expect(out[1]).toBeCloseTo(1, 10);
        });
    });

    describe('copy', () => {
        it('should copy a matrix', () => {
            const m = Mat4Ops.translation(5, 10, 15);
            const copy = Mat4Ops.copy(m);

            expect(copy).toEqual(m);
            expect(copy).not.toBe(m);
        });

        it('should copy matrix (mutating)', () => {
            const m = Mat4Ops.translation(5, 10, 15);
            const out = new Array(16).fill(0) as any;
            const result = Mat4Ops.copyMut(out, m);

            expect(result).toBe(out);
            expect(out).toEqual(m);
        });
    });

    describe('equal', () => {
        it('should return true for equal matrices', () => {
            const m1 = Mat4Ops.translation(5, 10, 15);
            const m2 = Mat4Ops.translation(5, 10, 15);

            expect(Mat4Ops.equal(m1, m2)).toBe(true);
        });

        it('should return false for different matrices', () => {
            const m1 = Mat4Ops.translation(5, 10, 15);
            const m2 = Mat4Ops.translation(6, 10, 15);

            expect(Mat4Ops.equal(m1, m2)).toBe(false);
        });
    });

    describe('equalApprox', () => {
        it('should return true for approximately equal matrices', () => {
            const m1 = Mat4Ops.translation(5.0000001, 10, 15);
            const m2 = Mat4Ops.translation(5, 10, 15);

            expect(Mat4Ops.equalApprox(m1, m2)).toBe(true);
        });

        it('should return false for significantly different matrices', () => {
            const m1 = Mat4Ops.translation(5.01, 10, 15);
            const m2 = Mat4Ops.translation(5, 10, 15);

            expect(Mat4Ops.equalApprox(m1, m2)).toBe(false);
        });

        it('should respect custom epsilon', () => {
            const m1 = Mat4Ops.translation(5.01, 10, 15);
            const m2 = Mat4Ops.translation(5, 10, 15);

            expect(Mat4Ops.equalApprox(m1, m2, 0.1)).toBe(true);
        });
    });

    describe('toFloat32Array', () => {
        it('should convert to Float32Array in column-major order', () => {
            const m = [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16,
            ] as any;
            const arr = Mat4Ops.toFloat32Array(m);

            expect(arr).toBeInstanceOf(Float32Array);
            expect(arr).toEqual(new Float32Array([
                1, 5, 9, 13,
                2, 6, 10, 14,
                3, 7, 11, 15,
                4, 8, 12, 16,
            ]));
        });
    });

    describe('transformation composition', () => {
        it('should compose translate, rotate, scale correctly', () => {
            const translate = Mat4Ops.translation(10, 20, 30);
            const rotate = Mat4Ops.rotationZ(Math.PI / 4);
            const scale = Mat4Ops.scaling(2, 2, 2);

            const composed = Mat4Ops.multiply(
                Mat4Ops.multiply(translate, rotate),
                scale,
            );

            // Verify the matrix has the expected structure
            // (scale factors in diagonal, non-zero translation)
            expect(composed[0]).not.toBe(0);
            expect(composed[5]).not.toBe(0);
            expect(composed[10]).not.toBe(0);
            expect(composed[12]).not.toBe(0);
            expect(composed[13]).not.toBe(0);
            expect(composed[14]).not.toBe(0);
        });
    });
});
