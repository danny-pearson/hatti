import { describe, it, expect } from 'vitest';
import Vector2 from '../dist/Vector2.js';

describe('Vector2', () => {
    it('constructor sets x and y', () => {
        const v = new Vector2(1, 2);

        expect(v.x).toBe(1);
        expect(v.y).toBe(2);

        const v2 = new Vector2();

        expect(v2.x).toBe(0);
        expect(v2.y).toBe(0);
    });

    describe('static methods', () => {
        it('add', () => {
            const v = Vector2.add(new Vector2(1, 2), new Vector2(3, 4));

            expect(v.x).toBe(4);
            expect(v.y).toBe(6);
        });

        it('sub', () => {
            const v = Vector2.sub(new Vector2(5, 7), new Vector2(2, 3));

            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('multiply', () => {
            const v = Vector2.multiply(new Vector2(2, 3), new Vector2(4, 5));

            expect(v.x).toBe(8);
            expect(v.y).toBe(15);
        });

        it('divide', () => {
            const v = Vector2.divide(new Vector2(8, 9), new Vector2(2, 3));

            expect(v.x).toBe(4);
            expect(v.y).toBe(3);
        });

        it('lerp', () => {
            const v = Vector2.lerp(new Vector2(0, 0), new Vector2(10, 10), 0.5);

            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
        });

        it('fromAngle', () => {
            const v = Vector2.fromAngle(Math.PI / 2, 2);

            expect(v.x).toBeCloseTo(0, 5);
            expect(v.y).toBeCloseTo(2, 5);
        });

        it('perpendicular', () => {
            const v = Vector2.perpendicular(new Vector2(1, 2));

            expect(v.x).toBe(-2);
            expect(v.y).toBe(1);
        });

        it('random returns unit vector', () => {
            const v = Vector2.random();

            expect(v).toBeInstanceOf(Vector2);
            expect(Math.abs(v.magnitude() - 1)).toBeLessThan(1e-10);
        });

        it('isNormalized', () => {
            expect(Vector2.isNormalized(new Vector2(1, 0))).toBe(true);
            expect(Vector2.isNormalized(new Vector2(2, 0))).toBe(false);
        });
    });

    describe('setters', () => {
        it('set', () => {
            const v = new Vector2();

            v.set(5, 6);
            expect(v.x).toBe(5);
            expect(v.y).toBe(6);

            v.set(7);
            expect(v.x).toBe(7);
            expect(v.y).toBe(7);
        });

        it('setX and setY', () => {
            const v = new Vector2();

            v.setX(3);
            expect(v.x).toBe(3);

            v.setY(4);
            expect(v.y).toBe(4);
        });
    });

    describe('arithmetic', () => {
        it('add', () => {
            const v = new Vector2(1, 2);

            v.add(new Vector2(3, 4));

            expect(v.x).toBe(4);
            expect(v.y).toBe(6);
        });

        it('addScalar', () => {
            const v = new Vector2(1, 2);

            v.addScalar(5);

            expect(v.x).toBe(6);
            expect(v.y).toBe(7);
        });

        it('addScalarX/Y', () => {
            const v = new Vector2(1, 2);

            v.addScalarX(3);
            expect(v.x).toBe(4);

            v.addScalarY(2);
            expect(v.y).toBe(4);
        });

        it('sub', () => {
            const v = new Vector2(5, 7);

            v.sub(new Vector2(2, 3));

            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });

        it('subScalar', () => {
            const v = new Vector2(5, 7);

            v.subScalar(2);

            expect(v.x).toBe(3);
            expect(v.y).toBe(5);
        });

        it('subScalarX/Y', () => {
            const v = new Vector2(5, 7);

            v.subScalarX(2);
            expect(v.x).toBe(3);

            v.subScalarY(3);
            expect(v.y).toBe(4);
        });

        it('multiply', () => {
            const v = new Vector2(2, 3);

            v.multiply(new Vector2(4, 5));

            expect(v.x).toBe(8);
            expect(v.y).toBe(15);
        });

        it('multiplyScalar', () => {
            const v = new Vector2(2, 3);

            v.multiplyScalar(2);

            expect(v.x).toBe(4);
            expect(v.y).toBe(6);
        });

        it('multiplyScalarX/Y', () => {
            const v = new Vector2(2, 3);

            v.multiplyScalarX(4);
            expect(v.x).toBe(8);

            v.multiplyScalarY(5);
            expect(v.y).toBe(15);
        });

        it('divide', () => {
            const v = new Vector2(8, 9);

            v.divide(new Vector2(2, 3));

            expect(v.x).toBe(4);
            expect(v.y).toBe(3);
        });

        it('divideScalar', () => {
            const v = new Vector2(8, 9);

            v.divideScalar(2);

            expect(v.x).toBe(4);
            expect(v.y).toBe(4.5);
        });

        it('divideScalarX', () => {
            const v = new Vector2(8, 9);

            v.divideScalarX(2);

            expect(v.x).toBe(4);
            expect(v.y).toBe(9);
        });

        it('divideScalarY', () => {
            const v = new Vector2(8, 9);

            v.divideScalarY(3);

            expect(v.x).toBe(8);
            expect(v.y).toBe(3);
        });

        it('divideScalarY with negative', () => {
            const v = new Vector2(5, -15);

            v.divideScalarY(-3);

            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
        });

        it('divideScalarY with zero', () => {
            const v = new Vector2(1, 5);

            v.divideScalarY(0);

            expect(v.x).toBe(1);
            expect(v.y).toBe(Infinity);
        });

        it('divideScalarY with fraction', () => {
            const v = new Vector2(7, 2);

            v.divideScalarY(0.5);

            expect(v.x).toBe(7);
            expect(v.y).toBe(4);
        });

        it('translate', () => {
            const v = new Vector2(1, 2);

            v.translate(3, 4);

            expect(v.x).toBe(4);
            expect(v.y).toBe(6);
        });

        it('scale', () => {
            const v = new Vector2(2, 3);

            v.scale(4, 5);

            expect(v.x).toBe(8);
            expect(v.y).toBe(15);
        });

        it('negate', () => {
            const v = new Vector2(1, -2);

            v.negate();

            expect(v.x).toBe(-1);
            expect(v.y).toBe(2);
        });
    });

    describe('rounding', () => {
        it('ceil', () => {
            const v = new Vector2(1.2, -2.7);

            v.ceil();

            expect(v.x).toBe(2);
            expect(v.y).toBe(-2);
        });

        it('floor', () => {
            const v = new Vector2(1.8, -2.2);

            v.floor();

            expect(v.x).toBe(1);
            expect(v.y).toBe(-3);
        });

        it('round', () => {
            const v = new Vector2(1.5, -2.5);

            v.round();

            expect(v.x).toBe(2);
            expect(v.y).toBe(-2);
        });
    });

    describe('geometry', () => {
        it('rotate', () => {
            const v = new Vector2(1, 0);

            v.rotate(Math.PI / 2);

            expect(v.x).toBeCloseTo(0, 5);
            expect(v.y).toBeCloseTo(1, 5);
        });

        it('rotateAround', () => {
            const v = new Vector2(2, 0);

            v.rotateAround(new Vector2(1, 0), Math.PI);

            expect(v.x).toBeCloseTo(0, 5);
            expect(v.y).toBeCloseTo(0, 5);
        });

        it('lerp (instance)', () => {
            const v = new Vector2(0, 0);

            v.lerp(new Vector2(10, 10), 0.5);

            expect(v.x).toBe(5);
            expect(v.y).toBe(5);
        });

        it('abs', () => {
            const v = new Vector2(-3, 4);

            v.abs();

            expect(v.x).toBe(3);
            expect(v.y).toBe(4);
        });
    });

    describe('clamp/min/max', () => {
        it('clamp', () => {
            const v = new Vector2(5, 10);

            v.clamp(new Vector2(0, 6), new Vector2(4, 12));

            expect(v.x).toBe(4);
            expect(v.y).toBe(10);
        });

        it('min', () => {
            const v = new Vector2(5, 10);

            v.min(new Vector2(4, 12));

            expect(v.x).toBe(4);
            expect(v.y).toBe(10);
        });

        it('max', () => {
            const v = new Vector2(5, 10);

            v.max(new Vector2(6, 8));

            expect(v.x).toBe(6);
            expect(v.y).toBe(10);
        });
    });

    describe('magnitude and normalization', () => {
        it('clampMagnitude', () => {
            const v = new Vector2(3, 4);

            v.clampMagnitude(2, 4);

            expect(v.magnitude()).toBeCloseTo(4, 5);
        });

        it('minMagnitude', () => {
            const v = new Vector2(1, 1);

            v.minMagnitude(3);

            expect(v.magnitude()).toBeCloseTo(3, 5);
        });

        it('maxMagnitude', () => {
            const v = new Vector2(10, 0);

            v.maxMagnitude(5);

            expect(v.magnitude()).toBeCloseTo(5, 5);
        });

        it('magnitude', () => {
            const v = new Vector2(3, 4);

            expect(v.magnitude()).toBe(5);
        });

        it('setMagnitude', () => {
            const v = new Vector2(3, 4);

            v.setMagnitude(10);

            expect(v.magnitude()).toBeCloseTo(10, 5);
        });

        it('normalize', () => {
            const v = new Vector2(3, 4);

            v.normalize();

            expect(v.magnitude()).toBeCloseTo(1, 5);
        });
    });

    describe('distance and direction', () => {
        it('dist with vector', () => {
            const v = new Vector2(3, 4);

            expect(v.dist(new Vector2(0, 0))).toBe(5);
        });

        it('dist with numbers', () => {
            const v = new Vector2(3, 4);

            expect(v.dist(0, 0)).toBe(5);
        });

        it('directionFrom', () => {
            const v1 = new Vector2(1, 0);
            const v2 = new Vector2(0, 0);

            const dir = v1.directionFrom(v2);

            expect(dir.x).toBeCloseTo(1, 5);
            expect(dir.y).toBeCloseTo(0, 5);
        });

        it('directionTo', () => {
            const v1 = new Vector2(1, 0);
            const v2 = new Vector2(0, 0);

            const dir = v1.directionTo(v2);

            expect(dir.x).toBeCloseTo(-1, 5);
            expect(dir.y).toBeCloseTo(0, 5);
        });
    });

    describe('random/angle', () => {
        it('toRandom', () => {
            const v = new Vector2(0, 0);

            v.toRandom();

            expect(v.magnitude()).toBeCloseTo(1, 5);
        });

        it('angleBetween', () => {
            const v1 = new Vector2(1, 0);
            const v2 = new Vector2(0, 1);

            expect(v1.angleBetween(v2)).toBeCloseTo(Math.PI / 2, 5);
        });

        it('angleTo', () => {
            const v1 = new Vector2(0, 0);
            const v2 = new Vector2(0, 1);

            expect(v1.angleTo(v2)).toBeCloseTo(Math.PI / 2, 5);
        });

        it('toAngle', () => {
            const v = new Vector2(0, 1);

            expect(v.toAngle()).toBeCloseTo(Math.PI / 2, 5);
        });
    });

    describe('dot/cross', () => {
        it('dot', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);

            expect(v1.dot(v2)).toBe(11);
        });

        it('cross', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(3, 4);

            expect(v1.cross(v2)).toBe(-2);
        });
    });

    describe('clone/equalTo', () => {
        it('clone', () => {
            const v = new Vector2(1, 2);

            const c = v.clone();
            expect(c).not.toBe(v);
            expect(c.x).toBe(1);
            expect(c.y).toBe(2);
        });

        it('equalTo', () => {
            const v1 = new Vector2(1, 2);
            const v2 = new Vector2(1, 2);
            const v3 = new Vector2(2, 1);

            expect(v1.equalTo(v2)).toBe(true);
            expect(v1.equalTo(v3)).toBe(false);
        });
    });

    describe('reflect/project', () => {
        it('reflect', () => {
            const v = new Vector2(1, 1);
            const n = new Vector2(0, 1).normalize();

            const r = v.reflect(n);

            expect(r.x).toBeCloseTo(1, 5);
            expect(r.y).toBeCloseTo(-1, 5);
        });

        it('project', () => {
            const v = new Vector2(2, 2);
            const n = new Vector2(1, 0).normalize();

            const p = v.project(n);

            expect(p.x).toBeCloseTo(2, 5);
            expect(p.y).toBeCloseTo(0, 5);
        });
    });

    describe('isNormalized (instance)', () => {
        it('isNormalized', () => {
            const v = new Vector2(1, 0);
            expect(v.isNormalized()).toBe(true);

            const v2 = new Vector2(2, 0);
            expect(v2.isNormalized()).toBe(false);
        });
    });
});