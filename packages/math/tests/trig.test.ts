import { describe, it, expect } from 'vitest';

import {
    cosDeg,
    acosDeg,
    sinDeg,
    asinDeg,
    tanDeg,
    atanDeg,
    atan2Deg,
    toRadians,
    toDegrees,
    normalizeAngle,
    normalizeAngleDeg,
    normalizeAngleSigned,
    normalizeAngleSignedDeg,
    angleDelta,
    angleDeltaDeg,
    lerpAngle,
    lerpAngleDeg,
    sinCos,
    sinCosDeg,
    isAngleBetween,
    isAngleBetweenDeg,
    clampAngle,
    clampAngleDeg,
} from '../dist/trig.js';

describe('trig', () => {
    describe('cosDeg', () => {
        it('calculates cosine of 0 degrees', () => {
            expect(cosDeg(0)).toBeCloseTo(1, 10);
        });

        it('calculates cosine of 90 degrees', () => {
            expect(cosDeg(90)).toBeCloseTo(0, 10);
        });

        it('calculates cosine of 180 degrees', () => {
            expect(cosDeg(180)).toBeCloseTo(-1, 10);
        });

        it('calculates cosine of 270 degrees', () => {
            expect(cosDeg(270)).toBeCloseTo(0, 10);
        });

        it('calculates cosine of 360 degrees', () => {
            expect(cosDeg(360)).toBeCloseTo(1, 10);
        });

        it('calculates cosine of 45 degrees', () => {
            expect(cosDeg(45)).toBeCloseTo(Math.SQRT2 / 2, 10);
        });

        it('calculates cosine of negative angles', () => {
            expect(cosDeg(-90)).toBeCloseTo(0, 10);
            expect(cosDeg(-180)).toBeCloseTo(-1, 10);
        });
    });

    describe('acosDeg', () => {
        it('calculates arccosine of 1', () => {
            expect(acosDeg(1)).toBeCloseTo(0, 10);
        });

        it('calculates arccosine of 0', () => {
            expect(acosDeg(0)).toBeCloseTo(90, 10);
        });

        it('calculates arccosine of -1', () => {
            expect(acosDeg(-1)).toBeCloseTo(180, 10);
        });

        it('calculates arccosine of 0.5', () => {
            expect(acosDeg(0.5)).toBeCloseTo(60, 10);
        });

        it('calculates arccosine of √2/2', () => {
            expect(acosDeg(Math.SQRT2 / 2)).toBeCloseTo(45, 10);
        });

        it('returns NaN for values outside [-1, 1]', () => {
            expect(acosDeg(1.5)).toBeNaN();
            expect(acosDeg(-1.5)).toBeNaN();
        });
    });

    describe('sinDeg', () => {
        it('calculates sine of 0 degrees', () => {
            expect(sinDeg(0)).toBeCloseTo(0, 10);
        });

        it('calculates sine of 90 degrees', () => {
            expect(sinDeg(90)).toBeCloseTo(1, 10);
        });

        it('calculates sine of 180 degrees', () => {
            expect(sinDeg(180)).toBeCloseTo(0, 10);
        });

        it('calculates sine of 270 degrees', () => {
            expect(sinDeg(270)).toBeCloseTo(-1, 10);
        });

        it('calculates sine of 360 degrees', () => {
            expect(sinDeg(360)).toBeCloseTo(0, 10);
        });

        it('calculates sine of 30 degrees', () => {
            expect(sinDeg(30)).toBeCloseTo(0.5, 10);
        });

        it('calculates sine of 45 degrees', () => {
            expect(sinDeg(45)).toBeCloseTo(Math.SQRT2 / 2, 10);
        });

        it('calculates sine of negative angles', () => {
            expect(sinDeg(-90)).toBeCloseTo(-1, 10);
            expect(sinDeg(-30)).toBeCloseTo(-0.5, 10);
        });
    });

    describe('asinDeg', () => {
        it('calculates arcsine of 0', () => {
            expect(asinDeg(0)).toBeCloseTo(0, 10);
        });

        it('calculates arcsine of 1', () => {
            expect(asinDeg(1)).toBeCloseTo(90, 10);
        });

        it('calculates arcsine of -1', () => {
            expect(asinDeg(-1)).toBeCloseTo(-90, 10);
        });

        it('calculates arcsine of 0.5', () => {
            expect(asinDeg(0.5)).toBeCloseTo(30, 10);
        });

        it('calculates arcsine of -0.5', () => {
            expect(asinDeg(-0.5)).toBeCloseTo(-30, 10);
        });

        it('calculates arcsine of √2/2', () => {
            expect(asinDeg(Math.SQRT2 / 2)).toBeCloseTo(45, 10);
        });

        it('returns NaN for values outside [-1, 1]', () => {
            expect(asinDeg(1.5)).toBeNaN();
            expect(asinDeg(-1.5)).toBeNaN();
        });
    });

    describe('tanDeg', () => {
        it('calculates tangent of 0 degrees', () => {
            expect(tanDeg(0)).toBeCloseTo(0, 10);
        });

        it('calculates tangent of 45 degrees', () => {
            expect(tanDeg(45)).toBeCloseTo(1, 10);
        });

        it('calculates tangent of 180 degrees', () => {
            expect(tanDeg(180)).toBeCloseTo(0, 10);
        });

        it('calculates tangent of -45 degrees', () => {
            expect(tanDeg(-45)).toBeCloseTo(-1, 10);
        });

        it('calculates tangent of 30 degrees', () => {
            expect(tanDeg(30)).toBeCloseTo(1 / Math.sqrt(3), 10);
        });

        it('calculates tangent of 60 degrees', () => {
            expect(tanDeg(60)).toBeCloseTo(Math.sqrt(3), 10);
        });

        it('approaches infinity at 90 degrees', () => {
            expect(Math.abs(tanDeg(90))).toBeGreaterThan(1e10);
        });

        it('approaches negative infinity at -90 degrees', () => {
            expect(tanDeg(-90)).toBeLessThan(-1e10);
        });
    });

    describe('atanDeg', () => {
        it('calculates arctangent of 0', () => {
            expect(atanDeg(0)).toBeCloseTo(0, 10);
        });

        it('calculates arctangent of 1', () => {
            expect(atanDeg(1)).toBeCloseTo(45, 10);
        });

        it('calculates arctangent of -1', () => {
            expect(atanDeg(-1)).toBeCloseTo(-45, 10);
        });

        it('calculates arctangent of √3', () => {
            expect(atanDeg(Math.sqrt(3))).toBeCloseTo(60, 10);
        });

        it('calculates arctangent of 1/√3', () => {
            expect(atanDeg(1 / Math.sqrt(3))).toBeCloseTo(30, 10);
        });

        it('calculates arctangent of large positive values', () => {
            expect(atanDeg(1e10)).toBeCloseTo(90, 5);
        });

        it('calculates arctangent of large negative values', () => {
            expect(atanDeg(-1e10)).toBeCloseTo(-90, 5);
        });
    });

    describe('atan2Deg', () => {
        it('calculates angle for point (1, 0) - positive x-axis', () => {
            expect(atan2Deg(0, 1)).toBeCloseTo(0, 10);
        });

        it('calculates angle for point (0, 1) - positive y-axis', () => {
            expect(atan2Deg(1, 0)).toBeCloseTo(90, 10);
        });

        it('calculates angle for point (-1, 0) - negative x-axis', () => {
            expect(atan2Deg(0, -1)).toBeCloseTo(180, 10);
        });

        it('calculates angle for point (0, -1) - negative y-axis', () => {
            expect(atan2Deg(-1, 0)).toBeCloseTo(-90, 10);
        });

        it('calculates angle for point (1, 1) - 45 degrees', () => {
            expect(atan2Deg(1, 1)).toBeCloseTo(45, 10);
        });

        it('calculates angle for point (1, -1) - -45 degrees', () => {
            expect(atan2Deg(-1, 1)).toBeCloseTo(-45, 10);
        });

        it('calculates angle for point (-1, 1) - 135 degrees', () => {
            expect(atan2Deg(1, -1)).toBeCloseTo(135, 10);
        });

        it('calculates angle for point (-1, -1) - -135 degrees', () => {
            expect(atan2Deg(-1, -1)).toBeCloseTo(-135, 10);
        });

        it('handles origin (0, 0)', () => {
            expect(atan2Deg(0, 0)).toBeCloseTo(0, 10);
        });

        it('handles various magnitudes correctly', () => {
            expect(atan2Deg(5, 5)).toBeCloseTo(45, 10);
            expect(atan2Deg(100, 100)).toBeCloseTo(45, 10);
            expect(atan2Deg(0.001, 0.001)).toBeCloseTo(45, 10);
        });
    });

    describe('inverse function consistency', () => {
        it('cos and acos are inverses within valid range', () => {
            expect(acosDeg(cosDeg(0))).toBeCloseTo(0, 10);
            expect(acosDeg(cosDeg(45))).toBeCloseTo(45, 10);
            expect(acosDeg(cosDeg(90))).toBeCloseTo(90, 10);
            expect(acosDeg(cosDeg(180))).toBeCloseTo(180, 10);
        });

        it('sin and asin are inverses within valid range', () => {
            expect(asinDeg(sinDeg(0))).toBeCloseTo(0, 10);
            expect(asinDeg(sinDeg(30))).toBeCloseTo(30, 10);
            expect(asinDeg(sinDeg(45))).toBeCloseTo(45, 10);
            expect(asinDeg(sinDeg(-45))).toBeCloseTo(-45, 10);
        });

        it('tan and atan are inverses within valid range', () => {
            expect(atanDeg(tanDeg(0))).toBeCloseTo(0, 10);
            expect(atanDeg(tanDeg(30))).toBeCloseTo(30, 10);
            expect(atanDeg(tanDeg(45))).toBeCloseTo(45, 10);
            expect(atanDeg(tanDeg(-45))).toBeCloseTo(-45, 10);
        });
    });

    describe('Pythagorean identity', () => {
        it('sin²(θ) + cos²(θ) = 1 for various angles', () => {
            const testAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 270, 360];

            for (const angle of testAngles) {
                const sin = sinDeg(angle);
                const cos = cosDeg(angle);
                expect(sin * sin + cos * cos).toBeCloseTo(1, 10);
            }
        });
    });

    describe('angle addition formulas', () => {
        it('sin(a + b) = sin(a)cos(b) + cos(a)sin(b)', () => {
            const a = 30;
            const b = 45;
            const sinSum = sinDeg(a + b);
            const formula = sinDeg(a) * cosDeg(b) + cosDeg(a) * sinDeg(b);

            expect(sinSum).toBeCloseTo(formula, 10);
        });

        it('cos(a + b) = cos(a)cos(b) - sin(a)sin(b)', () => {
            const a = 30;
            const b = 45;
            const cosSum = cosDeg(a + b);
            const formula = cosDeg(a) * cosDeg(b) - sinDeg(a) * sinDeg(b);

            expect(cosSum).toBeCloseTo(formula, 10);
        });
    });

    describe('toRadians / toDegrees', () => {
        it('converts degrees to radians', () => {
            expect(toRadians(0)).toBeCloseTo(0, 10);
            expect(toRadians(90)).toBeCloseTo(Math.PI / 2, 10);
            expect(toRadians(180)).toBeCloseTo(Math.PI, 10);
            expect(toRadians(360)).toBeCloseTo(Math.PI * 2, 10);
        });

        it('converts radians to degrees', () => {
            expect(toDegrees(0)).toBeCloseTo(0, 10);
            expect(toDegrees(Math.PI / 2)).toBeCloseTo(90, 10);
            expect(toDegrees(Math.PI)).toBeCloseTo(180, 10);
            expect(toDegrees(Math.PI * 2)).toBeCloseTo(360, 10);
        });

        it('are inverses of each other', () => {
            expect(toDegrees(toRadians(45))).toBeCloseTo(45, 10);
            expect(toRadians(toDegrees(Math.PI / 4))).toBeCloseTo(Math.PI / 4, 10);
        });
    });

    describe('normalizeAngle / normalizeAngleDeg', () => {
        it('normalizes angles to [0, 2π) in radians', () => {
            expect(normalizeAngle(0)).toBeCloseTo(0, 10);
            expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI, 10);
            expect(normalizeAngle(Math.PI * 2)).toBeCloseTo(0, 10);
            expect(normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI, 10);
            expect(normalizeAngle(-Math.PI / 2)).toBeCloseTo(Math.PI * 1.5, 10);
        });

        it('normalizes angles to [0, 360) in degrees', () => {
            expect(normalizeAngleDeg(0)).toBe(0);
            expect(normalizeAngleDeg(180)).toBe(180);
            expect(normalizeAngleDeg(360)).toBe(0);
            expect(normalizeAngleDeg(540)).toBe(180);
            expect(normalizeAngleDeg(-90)).toBe(270);
        });
    });

    describe('normalizeAngleSigned / normalizeAngleSignedDeg', () => {
        it('normalizes angles to [-π, π] in radians', () => {
            expect(normalizeAngleSigned(0)).toBeCloseTo(0, 10);
            expect(normalizeAngleSigned(Math.PI)).toBeCloseTo(Math.PI, 10);
            expect(normalizeAngleSigned(Math.PI * 1.5)).toBeCloseTo(-Math.PI / 2, 10);
            expect(normalizeAngleSigned(Math.PI * 2)).toBeCloseTo(0, 10);
            expect(normalizeAngleSigned(-Math.PI / 2)).toBeCloseTo(-Math.PI / 2, 10);
        });

        it('normalizes angles to [-180, 180] in degrees', () => {
            expect(normalizeAngleSignedDeg(0)).toBe(0);
            expect(normalizeAngleSignedDeg(180)).toBe(180);
            expect(normalizeAngleSignedDeg(270)).toBe(-90);
            expect(normalizeAngleSignedDeg(360)).toBe(0);
            expect(normalizeAngleSignedDeg(-90)).toBe(-90);
        });
    });

    describe('angleDelta / angleDeltaDeg', () => {
        it('calculates shortest angular distance in radians', () => {
            expect(angleDelta(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2, 10);
            expect(angleDelta(0, Math.PI * 1.75)).toBeCloseTo(-Math.PI / 4, 10);
            expect(angleDelta(Math.PI * 1.75, Math.PI / 4)).toBeCloseTo(Math.PI / 2, 10);
        });

        it('calculates shortest angular distance in degrees', () => {
            expect(angleDeltaDeg(0, 90)).toBe(90);
            expect(angleDeltaDeg(0, 270)).toBe(-90);
            expect(angleDeltaDeg(350, 10)).toBe(20);
            expect(angleDeltaDeg(10, 350)).toBe(-20);
        });

        it('handles wraparound correctly', () => {
            expect(angleDeltaDeg(350, 10)).toBe(20);
            expect(angleDeltaDeg(10, 350)).toBe(-20);
            expect(Math.abs(angleDeltaDeg(180, -180))).toBe(0);
        });
    });

    describe('lerpAngle / lerpAngleDeg', () => {
        it('interpolates angles taking shortest path in radians', () => {
            expect(lerpAngle(0, Math.PI / 2, 0)).toBeCloseTo(0, 10);
            expect(lerpAngle(0, Math.PI / 2, 0.5)).toBeCloseTo(Math.PI / 4, 10);
            expect(lerpAngle(0, Math.PI / 2, 1)).toBeCloseTo(Math.PI / 2, 10);
        });

        it('interpolates angles taking shortest path in degrees', () => {
            expect(lerpAngleDeg(0, 90, 0)).toBe(0);
            expect(lerpAngleDeg(0, 90, 0.5)).toBe(45);
            expect(lerpAngleDeg(0, 90, 1)).toBe(90);
        });

        it('handles wraparound correctly in degrees', () => {
            expect(lerpAngleDeg(350, 10, 0.5) % 360).toBe(0);
            expect(lerpAngleDeg(10, 350, 0.5) % 360).toBe(0);
            expect(lerpAngleDeg(270, 90, 0.5) % 360).toBe(0);
        });

        it('handles extrapolation', () => {
            expect(lerpAngleDeg(0, 90, 1.5)).toBe(135);
            expect(lerpAngleDeg(0, 90, -0.5)).toBe(-45);
        });
    });

    describe('sinCos / sinCosDeg', () => {
        it('returns both sin and cos in radians', () => {
            const [sin, cos] = sinCos(Math.PI / 4);
            expect(sin).toBeCloseTo(Math.SQRT2 / 2, 10);
            expect(cos).toBeCloseTo(Math.SQRT2 / 2, 10);
        });

        it('returns both sin and cos in degrees', () => {
            const [sin, cos] = sinCosDeg(45);
            expect(sin).toBeCloseTo(Math.SQRT2 / 2, 10);
            expect(cos).toBeCloseTo(Math.SQRT2 / 2, 10);
        });

        it('matches individual sin and cos calls', () => {
            const angle = Math.PI / 3;
            const [sin, cos] = sinCos(angle);
            expect(sin).toBeCloseTo(Math.sin(angle), 10);
            expect(cos).toBeCloseTo(Math.cos(angle), 10);
        });
    });

    describe('isAngleBetween / isAngleBetweenDeg', () => {
        it('checks if angle is within range in radians', () => {
            expect(isAngleBetween(Math.PI / 4, 0, Math.PI / 2)).toBe(true);
            expect(isAngleBetween(Math.PI, 0, Math.PI / 2)).toBe(false);
        });

        it('checks if angle is within range in degrees', () => {
            expect(isAngleBetweenDeg(45, 0, 90)).toBe(true);
            expect(isAngleBetweenDeg(180, 0, 90)).toBe(false);
        });

        it('handles wraparound ranges in degrees', () => {
            expect(isAngleBetweenDeg(350, 340, 10)).toBe(true);
            expect(isAngleBetweenDeg(0, 340, 10)).toBe(true);
            expect(isAngleBetweenDeg(5, 340, 10)).toBe(true);
            expect(isAngleBetweenDeg(180, 340, 10)).toBe(false);
        });

        it('handles boundary conditions', () => {
            expect(isAngleBetweenDeg(0, 0, 90)).toBe(true);
            expect(isAngleBetweenDeg(90, 0, 90)).toBe(true);
        });
    });

    describe('clampAngle / clampAngleDeg', () => {
        it('clamps angles to range in radians', () => {
            expect(clampAngle(Math.PI / 4, 0, Math.PI / 2)).toBeCloseTo(Math.PI / 4, 10);
            expect(clampAngle(-Math.PI / 4, 0, Math.PI / 2)).toBeCloseTo(0, 10);
            expect(clampAngle(Math.PI, 0, Math.PI / 2)).toBeCloseTo(Math.PI / 2, 10);
        });

        it('clamps angles to range in degrees', () => {
            expect(clampAngleDeg(45, 0, 90)).toBe(45);
            expect(clampAngleDeg(-45, 0, 90)).toBe(0);
            expect(clampAngleDeg(180, 0, 90)).toBe(90);
        });

        it('handles wraparound ranges in degrees', () => {
            expect(clampAngleDeg(350, 340, 10)).toBe(350);
            expect(clampAngleDeg(5, 340, 10)).toBe(5);
            expect(clampAngleDeg(180, 340, 10)).toBe(340);
            expect(clampAngleDeg(200, 340, 10)).toBe(340);
        });

        it('returns angle when within range', () => {
            expect(clampAngleDeg(45, 0, 90)).toBe(45);
            expect(clampAngleDeg(0, 0, 90)).toBe(0);
            expect(clampAngleDeg(90, 0, 90)).toBe(90);
        });
    });
});
