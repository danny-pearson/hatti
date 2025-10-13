import { describe, it, expect } from 'vitest';
import { Vec2Ops } from '../dist/index.js';

type Vector2Like = [number, number];

describe('Vec2Ops', () => {
    const v1: Vector2Like = [2, 3];
    const v2: Vector2Like = [4, 5];

    describe('add', () => {
        it('add', () => {
            expect(Vec2Ops.add(v1, v2)).toEqual([6, 8]);
        });

        it('addMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.addMut(out, v1, v2)).toBe(out);
            expect(out).toEqual([6, 8]);
        });

        it('addScalar', () => {
            expect(Vec2Ops.addScalar(v1, 2)).toEqual([4, 5]);
        });

        it('addScalarMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.addScalarMut(out, v1, 2)).toBe(out);
            expect(out).toEqual([4, 5]);
        });

        it('addScalarX', () => {
            expect(Vec2Ops.addScalarX(v1, 2)).toEqual([4, 3]);
        });

        it('addScalarXMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.addScalarXMut(out, v1, 2)).toBe(out);
            expect(out).toEqual([4, 0]);
        });

        it('addScalarY', () => {
            expect(Vec2Ops.addScalarY(v1, 2)).toEqual([2, 5]);
        });

        it('addScalarYMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.addScalarYMut(out, v1, 2)).toBe(out);
            expect(out).toEqual([0, 5]);
        });
    });

    describe('add edge cases', () => {
        it('handles zeros correctly', () => {
            expect(Vec2Ops.add([0, 0], [0, 0])).toEqual([0, 0]);
            expect(Vec2Ops.add([-0, 0], [0, -0])).toEqual([0, 0]);
        });

        it('handles negatives correctly', () => {
            expect(Vec2Ops.add([-1, -2], [2, 3])).toEqual([1, 1]);
        });

        it('handles small floating point values', () => {
            expect(Vec2Ops.add([1e-12, 1e-12], [1e-12, -1e-12])).toEqual([2e-12, 0]);
        });

        it('handles large floating point values', () => {
            expect(Vec2Ops.add([1e12, 1e12], [1e12, -1e12])).toEqual([2e12, 0]);
        });

        it('handles NaN and Infinity propagation', () => {
            expect(Vec2Ops.add([NaN, 1], [1, 2])).toEqual([NaN, 3]);
            expect(Vec2Ops.add([Infinity, 1], [1, 2])).toEqual([Infinity, 3]);
            expect(Vec2Ops.add([-Infinity, 5], [Infinity, 10])).toEqual([NaN, 15]);
        });

        it('add does not mutate inputs', () => {
            const a: Vector2Like = [1, 2];
            const b: Vector2Like = [3, 4];
            const result = Vec2Ops.add(a, b);

            expect(a).toEqual([1, 2]);
            expect(b).toEqual([3, 4]);
            expect(result).not.toBe(a);
            expect(result).not.toBe(b);
        });
    });

    describe('addMut edge cases', () => {
        it('addMut works when out === v1 or v2 (aliasing)', () => {
            const a: Vector2Like = [2, 3];
            const b: Vector2Like = [4, 5];

            Vec2Ops.addMut(a, a, b);

            expect(a).toEqual([6, 8]);

            const c: Vector2Like = [2, 3];

            Vec2Ops.addMut(b, c, b);

            expect(b).toEqual([6, 8]);
        });
    });

    describe('addScalar edge cases', () => {
        it('handles Infinity and NaN in scalar additions', () => {
            expect(Vec2Ops.addScalar([1, 2], Infinity)).toEqual([Infinity, Infinity]);
            expect(Vec2Ops.addScalar([1, 2], NaN)).toEqual([NaN, NaN]);
        });
    });

    describe('sub', () => {
        it('sub', () => {
            expect(Vec2Ops.sub(v2, v1)).toEqual([2, 2]);
        });

        it('subMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.subMut(out, v2, v1)).toBe(out);
            expect(out).toEqual([2, 2]);
        });

        it('subScalar', () => {
            expect(Vec2Ops.subScalar(v1, 1)).toEqual([1, 2]);
        });

        it('subScalarMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.subScalarMut(out, v1, 1)).toBe(out);
            expect(out).toEqual([1, 2]);
        });

        it('subScalarX', () => {
            expect(Vec2Ops.subScalarX(v1, 1)).toEqual([1, 3]);
        });

        it('subScalarXMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.subScalarXMut(out, v1, 1)).toBe(out);
            expect(out).toEqual([1, 0]);
        });

        it('subScalarY', () => {
            expect(Vec2Ops.subScalarY(v1, 1)).toEqual([2, 2]);
        });

        it('subScalarYMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.subScalarYMut(out, v1, 1)).toBe(out);
            expect(out).toEqual([0, 2]);
        });
    });

    describe('mul', () => {
        it('mul', () => {
            expect(Vec2Ops.mul(v1, v2)).toEqual([8, 15]);
            expect(Vec2Ops.mul([Infinity, 2], [2, -Infinity])).toEqual([Infinity, -Infinity]);
        });

        it('mulMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.mulMut(out, v1, v2)).toBe(out);
            expect(out).toEqual([8, 15]);
        });

        it('mulScalar', () => {
            expect(Vec2Ops.mulScalar(v1, 2)).toEqual([4, 6]);
        });

        it('mulScalarMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.mulScalarMut(out, v1, 2)).toBe(out);
            expect(out).toEqual([4, 6]);
        });

        it('mulScalarX', () => {
            expect(Vec2Ops.mulScalarX(v1, 2)).toEqual([4, 3]);
        });

        it('mulScalarXMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.mulScalarXMut(out, v1, 2)).toBe(out);
            expect(out).toEqual([4, 0]);
        });

        it('mulScalarY', () => {
            expect(Vec2Ops.mulScalarY(v1, 2)).toEqual([2, 6]);
        });

        it('mulScalarYMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.mulScalarYMut(out, v1, 2)).toBe(out);
            expect(out).toEqual([0, 6]);
        });
    });

    describe('div', () => {
        it('div', () => {
            expect(Vec2Ops.div([8, 9], [2, 3])).toEqual([4, 3]);
        });

        it('divMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.divMut(out, [8, 9], [2, 3])).toBe(out);
            expect(out).toEqual([4, 3]);
        });

        it('divScalar', () => {
            expect(Vec2Ops.divScalar([8, 9], 2)).toEqual([4, 4.5]);
        });

        it('divScalarMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.divScalarMut(out, [8, 9], 2)).toBe(out);
            expect(out).toEqual([4, 4.5]);
        });

        it('divScalarX', () => {
            expect(Vec2Ops.divScalarX([8, 9], 2)).toEqual([4, 9]);
        });

        it('divScalarXMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.divScalarXMut(out, [8, 9], 2)).toBe(out);
            expect(out).toEqual([4, 0]);
        });

        it('divScalarY', () => {
            expect(Vec2Ops.divScalarY([8, 9], 3)).toEqual([8, 3]);
        });

        it('divScalarYMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.divScalarYMut(out, [8, 9], 3)).toBe(out);
            expect(out).toEqual([0, 3]);
        });
    });

    describe('translate/scale', () => {
        it('translate', () => {
            expect(Vec2Ops.translate([1, 2], 3, 4)).toEqual([4, 6]);
        });

        it('translateMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.translateMut(out, [1, 2], 3, 4)).toBe(out);
            expect(out).toEqual([4, 6]);
        });

        it('scale', () => {
            expect(Vec2Ops.scale([2, 3], 4, 5)).toEqual([8, 15]);
        });

        it('scaleMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.scaleMut(out, [2, 3], 4, 5)).toBe(out);
            expect(out).toEqual([8, 15]);
        });
    });

    describe('negate', () => {
        it('negate', () => {
            expect(Vec2Ops.negate([1, -2])).toEqual([-1, 2]);
        });

        it('negateMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.negateMut(out, [1, -2])).toBe(out);
            expect(out).toEqual([-1, 2]);
        });
    });

    describe('lerp', () => {
        it('lerp', () => {
            expect(Vec2Ops.lerp([0, 0], [10, 10], 0.5)).toEqual([5, 5]);
        });

        it('lerpMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.lerpMut(out, [0, 0], [10, 10], 0.5)).toBe(out);
            expect(out).toEqual([5, 5]);
        });
    });

    describe('perpendicular', () => {
        it('perpendicular', () => {
            expect(Vec2Ops.perpendicular([1, 2])).toEqual([-2, 1]);
        });

        it('perpendicularMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.perpendicularMut(out, [1, 2])).toBe(out);
            expect(out).toEqual([-2, 1]);
        });
    });

    describe('ceil/floor/round/abs/sign', () => {
        it('ceil', () => {
            expect(Vec2Ops.ceil([1.2, -2.7])).toEqual([2, -2]);
        });

        it('ceilMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.ceilMut(out, [1.2, -2.7])).toBe(out);
            expect(out).toEqual([2, -2]);
        });

        it('floor', () => {
            expect(Vec2Ops.floor([1.8, -2.2])).toEqual([1, -3]);
        });

        it('floorMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.floorMut(out, [1.8, -2.2])).toBe(out);
            expect(out).toEqual([1, -3]);
        });

        it('round', () => {
            expect(Vec2Ops.round([1.5, -2.5])).toEqual([2, -2]);
        });

        it('roundMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.roundMut(out, [1.5, -2.5])).toBe(out);
            expect(out).toEqual([2, -2]);
        });

        it('abs', () => {
            expect(Vec2Ops.abs([-3, 4])).toEqual([3, 4]);
        });

        it('absMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.absMut(out, [-3, 4])).toBe(out);
            expect(out).toEqual([3, 4]);
        });

        it('sign', () => {
            expect(Vec2Ops.sign([-3, 4])).toEqual([-1, 1]);
        });

        it('signMut', () => {
            const out: Vector2Like = [0, 0];

            expect(Vec2Ops.signMut(out, [-3, 4])).toBe(out);
            expect(out).toEqual([-1, 1]);
        });
    });

    describe('normalize', () => {
        it('normalize', () => {
            const n = Vec2Ops.normalize([3, 4]);

            expect(n[0]).toBeCloseTo(0.6, 5);
            expect(n[1]).toBeCloseTo(0.8, 5);
        });

        it('normalizeMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.normalizeMut(out, [3, 4]);

            expect(out[0]).toBeCloseTo(0.6, 5);
            expect(out[1]).toBeCloseTo(0.8, 5);
        });

        it('normalize zero vector', () => {
            expect(Vec2Ops.normalize([0, 0])).toEqual([0, 0]);
        });

        it('normalizeMut zero vector', () => {
            const out: Vector2Like = [1, 1];

            Vec2Ops.normalizeMut(out, [0, 0]);

            expect(out).toEqual([0, 0]);
        });
    });

    describe('rotate', () => {
        it('rotate', () => {
            const v = Vec2Ops.rotate([1, 0], Math.PI / 2);

            expect(v[0]).toBeCloseTo(0, 5);
            expect(v[1]).toBeCloseTo(1, 5);
        });

        it('rotateMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.rotateMut(out, [1, 0], Math.PI / 2);

            expect(out[0]).toBeCloseTo(0, 5);
            expect(out[1]).toBeCloseTo(1, 5);
        });
    });

    describe('rotateAround', () => {
        it('rotateAround', () => {
            const v = Vec2Ops.rotateAround([2, 0], [1, 0], Math.PI);

            expect(v[0]).toBeCloseTo(0, 5);
            expect(v[1]).toBeCloseTo(0, 5);
        });

        it('rotateAroundMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.rotateAroundMut(out, [2, 0], [1, 0], Math.PI);

            expect(out[0]).toBeCloseTo(0, 5);
            expect(out[1]).toBeCloseTo(0, 5);
        });
    });

    describe('clamp/min/max', () => {
        it('clamp', () => {
            expect(Vec2Ops.clamp([5, 10], [0, 6], [4, 12])).toEqual([4, 10]);
        });

        it('clampMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.clampMut(out, [5, 10], [0, 6], [4, 12]);

            expect(out).toEqual([4, 10]);
        });

        it('clampScalar', () => {
            expect(Vec2Ops.clampScalar([5, 10], 0, 4)).toEqual([4, 4]);
        });

        it('clampScalarMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.clampScalarMut(out, [5, 10], 0, 4);

            expect(out).toEqual([4, 4]);
        });

        it('min', () => {
            expect(Vec2Ops.min([5, 10], [4, 12])).toEqual([4, 10]);
        });

        it('minMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.minMut(out, [5, 10], [4, 12]);

            expect(out).toEqual([4, 10]);
        });

        it('minScalar', () => {
            expect(Vec2Ops.minScalar([5, 10], 6)).toEqual([5, 6]);
        });

        it('minScalarMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.minScalarMut(out, [5, 10], 6);

            expect(out).toEqual([5, 6]);
        });

        it('max', () => {
            expect(Vec2Ops.max([5, 10], [6, 8])).toEqual([6, 10]);
        });

        it('maxMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.maxMut(out, [5, 10], [6, 8]);

            expect(out).toEqual([6, 10]);
        });

        it('maxScalar', () => {
            expect(Vec2Ops.maxScalar([5, 10], 6)).toEqual([6, 10]);
        });

        it('maxScalarMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.maxScalarMut(out, [5, 10], 6);

            expect(out).toEqual([6, 10]);
        });
    });

    describe('magnitude', () => {
        it('magnitude', () => {
            expect(Vec2Ops.magnitude([3, 4])).toBe(5);
        });

        it('magnitudeSafe', () => {
            expect(Vec2Ops.magnitudeSafe([3, 4])).toBe(5);
        });

        it('setMagnitude', () => {
            const v = Vec2Ops.setMagnitude([3, 4], 10);

            expect(Vec2Ops.magnitude(v)).toBeCloseTo(10, 5);
        });

        it('setMagnitudeMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.setMagnitudeMut(out, [3, 4], 10);

            expect(Vec2Ops.magnitude(out)).toBeCloseTo(10, 5);
        });

        it('clampMagnitude', () => {
            const v = Vec2Ops.clampMagnitude([3, 4], 2, 4);

            expect(Vec2Ops.magnitude(v)).toBeCloseTo(4, 5);
        });

        it('clampMagnitudeMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.clampMagnitudeMut(out, [3, 4], 2, 4);

            expect(Vec2Ops.magnitude(out)).toBeCloseTo(4, 5);
        });

        it('minMagnitude', () => {
            expect(Vec2Ops.magnitude(Vec2Ops.minMagnitude([1, 1], 3))).toBeCloseTo(3, 5);
        });

        it('minMagnitudeMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.minMagnitudeMut(out, [1, 1], 3);

            expect(Vec2Ops.magnitude(out)).toBeCloseTo(3, 5);
        });

        it('maxMagnitude', () => {
            expect(Vec2Ops.magnitude(Vec2Ops.maxMagnitude([10, 0], 5))).toBeCloseTo(5, 5);
        });

        it('maxMagnitudeMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.maxMagnitudeMut(out, [10, 0], 5);

            expect(Vec2Ops.magnitude(out)).toBeCloseTo(5, 5);
        });
    });

    describe('dist/direction', () => {
        it('dist', () => {
            expect(Vec2Ops.dist([3, 4], [0, 0])).toBe(5);
        });

        it('directionTo', () => {
            const dir = Vec2Ops.directionTo([0, 0], [1, 0]);

            expect(dir[0]).toBeCloseTo(1, 5);
            expect(dir[1]).toBeCloseTo(0, 5);
        });

        it('directionToMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.directionToMut(out, [0, 0], [1, 0]);

            expect(out[0]).toBeCloseTo(1, 5);
            expect(out[1]).toBeCloseTo(0, 5);
        });
    });

    describe('angles', () => {
        it('angleBetween', () => {
            expect(Vec2Ops.angleBetween([1, 0], [0, 1])).toBeCloseTo(Math.PI / 2, 5);
        });

        it('angleBetween for colinear vectors', () => {
            expect(Vec2Ops.angleBetween([1, 0], [2, 0])).toBeCloseTo(0, 5);
            expect(Vec2Ops.angleBetween([1, 0], [-1, 0])).toBeCloseTo(Math.PI, 5);
        });

        it('angleTo', () => {
            expect(Vec2Ops.angleTo([0, 0], [0, 1])).toBeCloseTo(Math.PI / 2, 5);
        });

        it('toAngle', () => {
            expect(Vec2Ops.toAngle([0, 1])).toBeCloseTo(Math.PI / 2, 5);
        });

        it('directionTo for identical points returns [0,0]', () => {
            expect(Vec2Ops.directionTo([1, 1], [1, 1])).toEqual([0, 0]);
        });

        it('fromAngle', () => {
            const v = Vec2Ops.fromAngle(Math.PI / 2, 2);

            expect(v[0]).toBeCloseTo(0, 5);
            expect(v[1]).toBeCloseTo(2, 5);
        });

        it('fromAngleMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.fromAngleMut(out, Math.PI / 2, 2);

            expect(out[0]).toBeCloseTo(0, 5);
            expect(out[1]).toBeCloseTo(2, 5);
        });

        it('random', () => {
            const v = Vec2Ops.random();

            expect(Array.isArray(v)).toBe(true);
            expect(v.length).toBe(2);
            expect(Math.abs(Vec2Ops.magnitude(v) - 1)).toBeLessThan(1e-10);
        });

        it('randomMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.randomMut(out);

            expect(out.length).toBe(2);
            expect(Math.abs(Vec2Ops.magnitude(out) - 1)).toBeLessThan(1e-10);
        });
    });

    describe('reflect/project', () => {
        it('reflect', () => {
            const v = Vec2Ops.reflect([1, 1], [0, 1]);

            expect(v[0]).toBeCloseTo(1, 5);
            expect(v[1]).toBeCloseTo(-1, 5);
        });

        it('reflectMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.reflectMut(out, [1, 1], [0, 1]);

            expect(out[0]).toBeCloseTo(1, 5);
            expect(out[1]).toBeCloseTo(-1, 5);
        });

        it('project', () => {
            const v = Vec2Ops.project([2, 2], [1, 0]);

            expect(v[0]).toBeCloseTo(2, 5);
            expect(v[1]).toBeCloseTo(0, 5);
        });

        it('projectMut', () => {
            const out: Vector2Like = [0, 0];

            Vec2Ops.projectMut(out, [2, 2], [1, 0]);

            expect(out[0]).toBeCloseTo(2, 5);
            expect(out[1]).toBeCloseTo(0, 5);
        });
    });

    describe('dot/cross', () => {
        it('dot', () => {
            expect(Vec2Ops.dot([1, 2], [3, 4])).toBe(11);
            expect(Vec2Ops.dot([0, 0], [1, 2])).toBe(0);
        });

        it('cross', () => {
            expect(Vec2Ops.cross([1, 2], [3, 4])).toBe(-2);
            expect(Vec2Ops.cross([0, 0], [1, 2])).toBe(0);
        });
    });

    describe('equal', () => {
        it('equal', () => {
            expect(Vec2Ops.equal([1, 2], [1, 2])).toBe(true);
            expect(Vec2Ops.equal([1, 2], [2, 1])).toBe(false);
        });

        it('equalApprox', () => {
            expect(Vec2Ops.equalApprox([1, 2], [1.0000001, 2.0000001])).toBe(true);
            expect(Vec2Ops.equalApprox([1, 2], [2, 1])).toBe(false);
        });
    });

    describe('isNormalized', () => {
        it('isNormalized', () => {
            expect(Vec2Ops.isNormalized([1, 0])).toBe(true);
            expect(Vec2Ops.isNormalized([2, 0])).toBe(false);
            expect(Vec2Ops.isNormalized([1, 0], 1e-12)).toBe(true);
            expect(Vec2Ops.isNormalized([0.999999, 0], 1e-6)).toBe(true);
        });
    });
});