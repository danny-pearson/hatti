import { describe, expect, it } from 'vitest';
import { Mat3Ops } from '../dist/index.js';

describe('Mat3Ops', () => {
    describe('identity', () => {
        it('should create an identity matrix', () => {
            const m = Mat3Ops.identity();

            expect(m).toEqual([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ]);
        });

        it('should create identity matrix (mutating)', () => {
            const m = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.identityMut(m);

            expect(result).toBe(m);
            expect(m).toEqual([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ]);
        });
    });

    describe('translation', () => {
        it('should create a translation matrix', () => {
            const m = Mat3Ops.translation(5, 10);

            expect(m).toEqual([
                1, 0, 0,
                0, 1, 0,
                5, 10, 1,
            ]);
        });

        it('should create translation matrix (mutating)', () => {
            const m = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.translationMut(m, 5, 10);

            expect(result).toBe(m);
            expect(m).toEqual([
                1, 0, 0,
                0, 1, 0,
                5, 10, 1,
            ]);
        });
    });

    describe('scaling', () => {
        it('should create a scaling matrix', () => {
            const m = Mat3Ops.scaling(2, 3);

            expect(m).toEqual([
                2, 0, 0,
                0, 3, 0,
                0, 0, 1,
            ]);
        });

        it('should create scaling matrix (mutating)', () => {
            const m = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.scalingMut(m, 2, 3);

            expect(result).toBe(m);
            expect(m).toEqual([
                2, 0, 0,
                0, 3, 0,
                0, 0, 1,
            ]);
        });
    });

    describe('rotation', () => {
        it('should create a rotation matrix for 90 degrees', () => {
            const m = Mat3Ops.rotation(Math.PI / 2);

            expect(m[0]).toBeCloseTo(0, 10);
            expect(m[1]).toBeCloseTo(1, 10);
            expect(m[2]).toBeCloseTo(0, 10);
            expect(m[3]).toBeCloseTo(-1, 10);
            expect(m[4]).toBeCloseTo(0, 10);
            expect(m[5]).toBeCloseTo(0, 10);
            expect(m[6]).toBeCloseTo(0, 10);
            expect(m[7]).toBeCloseTo(0, 10);
            expect(m[8]).toBeCloseTo(1, 10);
        });

        it('should create rotation matrix (mutating)', () => {
            const m = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.rotationMut(m, Math.PI / 2);

            expect(result).toBe(m);
            expect(m[0]).toBeCloseTo(0, 10);
            expect(m[1]).toBeCloseTo(1, 10);
            expect(m[3]).toBeCloseTo(-1, 10);
            expect(m[4]).toBeCloseTo(0, 10);
        });
    });

    describe('multiply', () => {
        it('should multiply two matrices', () => {
            const m1 = Mat3Ops.translation(5, 10);
            const m2 = Mat3Ops.scaling(2, 3);
            const result = Mat3Ops.multiply(m1, m2);

            expect(result).toEqual([
                2, 0, 0,
                0, 3, 0,
                10, 30, 1,
            ]);
        });

        it('should multiply identity by any matrix to get the same matrix', () => {
            const m = Mat3Ops.translation(5, 10);
            const identity = Mat3Ops.identity();
            const result = Mat3Ops.multiply(identity, m);

            expect(result).toEqual(m);
        });

        it('should multiply matrices (mutating)', () => {
            const out = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const m1 = Mat3Ops.translation(5, 10);
            const m2 = Mat3Ops.scaling(2, 3);
            const result = Mat3Ops.multiplyMut(out, m1, m2);

            expect(result).toBe(out);
            expect(out).toEqual([
                2, 0, 0,
                0, 3, 0,
                10, 30, 1,
            ]);
        });
    });

    describe('transpose', () => {
        it('should transpose a matrix', () => {
            const m = [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ] as any;
            const result = Mat3Ops.transpose(m);

            expect(result).toEqual([
                1, 4, 7,
                2, 5, 8,
                3, 6, 9,
            ]);
        });

        it('should transpose identity to get identity', () => {
            const m = Mat3Ops.identity();
            const result = Mat3Ops.transpose(m);

            expect(result).toEqual(m);
        });

        it('should transpose matrix (mutating)', () => {
            const m = [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ] as any;
            const result = Mat3Ops.transposeMut(m, m);

            expect(result).toBe(m);
            expect(m).toEqual([
                1, 4, 7,
                2, 5, 8,
                3, 6, 9,
            ]);
        });
    });

    describe('determinant', () => {
        it('should calculate determinant of identity as 1', () => {
            const m = Mat3Ops.identity();
            const det = Mat3Ops.determinant(m);

            expect(det).toBe(1);
        });

        it('should calculate determinant of scaling matrix', () => {
            const m = Mat3Ops.scaling(2, 3);
            const det = Mat3Ops.determinant(m);

            expect(det).toBe(6);
        });

        it('should calculate determinant of singular matrix as 0', () => {
            const m = [
                1, 2, 3,
                2, 4, 6,
                1, 2, 3,
            ] as any;
            const det = Mat3Ops.determinant(m);

            expect(det).toBe(0);
        });

        it('should calculate determinant of arbitrary matrix', () => {
            const m = [
                1, 2, 3,
                0, 1, 4,
                5, 6, 0,
            ] as any;
            const det = Mat3Ops.determinant(m);

            expect(det).toBe(1);
        });
    });

    describe('invert', () => {
        it('should invert identity to get identity', () => {
            const m = Mat3Ops.identity();
            const inv = Mat3Ops.invert(m);

            expect(inv).not.toBeNull();
            expect(inv).toEqual(m);
        });

        it('should return null for singular matrix', () => {
            const m = [
                1, 2, 3,
                2, 4, 6,
                1, 2, 3,
            ] as any;
            const inv = Mat3Ops.invert(m);

            expect(inv).toBeNull();
        });

        it('should invert scaling matrix', () => {
            const m = Mat3Ops.scaling(2, 4);
            const inv = Mat3Ops.invert(m);

            expect(inv).not.toBeNull();
            expect(inv![0]).toBeCloseTo(0.5, 10);
            expect(inv![4]).toBeCloseTo(0.25, 10);
        });

        it('should multiply matrix by its inverse to get identity', () => {
            const m = Mat3Ops.translation(5, 10);
            const inv = Mat3Ops.invert(m);

            expect(inv).not.toBeNull();

            const result = Mat3Ops.multiply(m, inv!);

            for (let i = 0; i < 9; i++) {
                const expected = i % 4 === 0 ? 1 : 0;
                expect(result[i]).toBeCloseTo(expected, 10);
            }
        });

        it('should invert matrix (mutating)', () => {
            const m = Mat3Ops.scaling(2, 4);
            const out = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.invertMut(out, m);

            expect(result).toBe(out);
            expect(out[0]).toBeCloseTo(0.5, 10);
            expect(out[4]).toBeCloseTo(0.25, 10);
        });

        it('should return null for singular matrix (mutating)', () => {
            const m = [
                1, 2, 3,
                2, 4, 6,
                1, 2, 3,
            ] as any;
            const out = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.invertMut(out, m);

            expect(result).toBeNull();
        });
    });

    describe('translate', () => {
        it('should apply translation to matrix', () => {
            const m = Mat3Ops.scaling(2, 3);
            const result = Mat3Ops.translate(m, 5, 10);

            expect(result[6]).toBe(5);
            expect(result[7]).toBe(10);
        });

        it('should apply translation (mutating)', () => {
            const m = Mat3Ops.scaling(2, 3);
            const out = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.translateMut(out, m, 5, 10);

            expect(result).toBe(out);
            expect(out[6]).toBe(10);
            expect(out[7]).toBe(30);
        });
    });

    describe('scale', () => {
        it('should apply scale to matrix', () => {
            const m = Mat3Ops.translation(5, 10);
            const result = Mat3Ops.scale(m, 2, 3);

            expect(result[0]).toBe(2);
            expect(result[4]).toBe(3);
        });

        it('should apply scale (mutating)', () => {
            const m = Mat3Ops.translation(5, 10);
            const out = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.scaleMut(out, m, 2, 3);

            expect(result).toBe(out);
            expect(out[0]).toBe(2);
            expect(out[4]).toBe(3);
        });
    });

    describe('rotate', () => {
        it('should apply rotation to matrix', () => {
            const m = Mat3Ops.identity();
            const result = Mat3Ops.rotate(m, Math.PI / 2);

            expect(result[0]).toBeCloseTo(0, 10);
            expect(result[1]).toBeCloseTo(1, 10);
            expect(result[3]).toBeCloseTo(-1, 10);
            expect(result[4]).toBeCloseTo(0, 10);
        });

        it('should apply rotation (mutating)', () => {
            const m = Mat3Ops.identity();
            const out = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.rotateMut(out, m, Math.PI / 2);

            expect(result).toBe(out);
            expect(out[0]).toBeCloseTo(0, 10);
            expect(out[1]).toBeCloseTo(1, 10);
        });
    });

    describe('copy', () => {
        it('should copy a matrix', () => {
            const m = Mat3Ops.translation(5, 10);
            const copy = Mat3Ops.copy(m);

            expect(copy).toEqual(m);
            expect(copy).not.toBe(m);
        });

        it('should copy matrix (mutating)', () => {
            const m = Mat3Ops.translation(5, 10);
            const out = [0, 0, 0, 0, 0, 0, 0, 0, 0] as any;
            const result = Mat3Ops.copyMut(out, m);

            expect(result).toBe(out);
            expect(out).toEqual(m);
        });
    });

    describe('equal', () => {
        it('should return true for equal matrices', () => {
            const m1 = Mat3Ops.translation(5, 10);
            const m2 = Mat3Ops.translation(5, 10);

            expect(Mat3Ops.equal(m1, m2)).toBe(true);
        });

        it('should return false for different matrices', () => {
            const m1 = Mat3Ops.translation(5, 10);
            const m2 = Mat3Ops.translation(6, 10);

            expect(Mat3Ops.equal(m1, m2)).toBe(false);
        });
    });

    describe('equalApprox', () => {
        it('should return true for approximately equal matrices', () => {
            const m1 = Mat3Ops.translation(5.0000001, 10);
            const m2 = Mat3Ops.translation(5, 10);

            expect(Mat3Ops.equalApprox(m1, m2)).toBe(true);
        });

        it('should return false for significantly different matrices', () => {
            const m1 = Mat3Ops.translation(5.01, 10);
            const m2 = Mat3Ops.translation(5, 10);

            expect(Mat3Ops.equalApprox(m1, m2)).toBe(false);
        });

        it('should respect custom epsilon', () => {
            const m1 = Mat3Ops.translation(5.01, 10);
            const m2 = Mat3Ops.translation(5, 10);

            expect(Mat3Ops.equalApprox(m1, m2, 0.1)).toBe(true);
        });
    });

    describe('toFloat32Array', () => {
        it('should convert to Float32Array in column-major order', () => {
            const m = [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9,
            ] as any;
            const arr = Mat3Ops.toFloat32Array(m);

            expect(arr).toBeInstanceOf(Float32Array);
            expect(arr).toEqual(new Float32Array([
                1, 4, 7,
                2, 5, 8,
                3, 6, 9,
            ]));
        });
    });

    describe('toCanvasTransform', () => {
        it('should convert to canvas transform format', () => {
            const m = Mat3Ops.translation(5, 10);
            const transform = Mat3Ops.toCanvasTransform(m);

            expect(transform).toEqual([1, 0, 0, 1, 5, 10]);
        });

        it('should convert scaled and translated matrix', () => {
            const m = Mat3Ops.multiply(
                Mat3Ops.translation(5, 10),
                Mat3Ops.scaling(2, 3),
            );
            const transform = Mat3Ops.toCanvasTransform(m);

            expect(transform).toEqual([2, 0, 0, 3, 10, 30]);
        });
    });

    describe('transformation composition', () => {
        it('should compose translate, rotate, scale correctly', () => {
            const translate = Mat3Ops.translation(10, 20);
            const rotate = Mat3Ops.rotation(Math.PI / 4);
            const scale = Mat3Ops.scaling(2, 2);

            const composed = Mat3Ops.multiply(
                Mat3Ops.multiply(translate, rotate),
                scale,
            );

            // Verify the matrix has the expected structure
            // (scale factors in diagonal, non-zero translation)
            expect(composed[0]).not.toBe(0);
            expect(composed[4]).not.toBe(0);
            expect(composed[6]).not.toBe(0);
            expect(composed[7]).not.toBe(0);
        });
    });
});
