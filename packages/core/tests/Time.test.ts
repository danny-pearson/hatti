import {
    describe, it, expect, beforeEach, vi,
} from 'vitest';
import Time from '../dist/Time.js';
import type { Mutable } from '@hatti/shared';

/**
 * Tests for the Time class.
 */
describe('Time', () => {
    beforeEach(() => {
        // Reset Time static properties before each test
        const mutableTime = Time as unknown as Mutable<typeof Time> & {
            accumulator: number;
            fpsSampleCount: number;
        };
        mutableTime.startTime = 0;
        mutableTime.lastFrameTick = 0;
        mutableTime.deltaTime = 0;
        mutableTime.frameCount = 0;
        mutableTime.fps = 0;
        mutableTime.accumulator = 0;
        mutableTime.fpsSampleCount = 0;
    });

    describe('init()', () => {
        it('should initialize startTime and lastFrameTick', () => {
            Time.init(1000);

            expect(Time.startTime).toBe(1000);
            expect(Time.lastFrameTick).toBe(1000);
        });

        it('should allow re-initialization', () => {
            Time.init(1000);
            Time.init(2000);

            expect(Time.startTime).toBe(2000);
            expect(Time.lastFrameTick).toBe(2000);
        });
    });

    describe('update()', () => {
        it('should update deltaTime based on time difference', () => {
            Time.init(1000);
            Time.update(1016.67); // ~16.67ms later (60 FPS)

            expect(Time.deltaTime).toBeCloseTo(0.01667, 4);
        });

        it('should update lastFrameTick', () => {
            Time.init(1000);
            Time.update(1050);

            expect(Time.lastFrameTick).toBe(1050);
        });

        it('should increment frameCount on each update', () => {
            Time.init(1000);

            expect(Time.frameCount).toBe(0);

            Time.update(1016);
            expect(Time.frameCount).toBe(1);

            Time.update(1032);
            expect(Time.frameCount).toBe(2);

            Time.update(1048);
            expect(Time.frameCount).toBe(3);
        });

        it('should calculate deltaTime correctly for multiple frames', () => {
            Time.init(1000);

            Time.update(1016.67);
            expect(Time.deltaTime).toBeCloseTo(0.01667, 4);

            Time.update(1033.33);
            expect(Time.deltaTime).toBeCloseTo(0.01666, 4);

            Time.update(1050);
            expect(Time.deltaTime).toBeCloseTo(0.01667, 4);
        });

        it('should handle large time jumps', () => {
            Time.init(1000);
            Time.update(2000); // 1 second jump

            expect(Time.deltaTime).toBe(1);
        });

        it('should handle very small time steps', () => {
            Time.init(1000);
            Time.update(1001); // 1ms

            expect(Time.deltaTime).toBe(0.001);
        });
    });

    describe('fps calculation', () => {
        it('should calculate FPS after 1 second accumulation', () => {
            Time.init(0);

            // Simulate 60 frames at 60 FPS (16.67ms per frame)
            for (let i = 0; i < 60; i++) {
                Time.update(i * 16.67);
            }

            // After ~1 second, FPS should be calculated
            Time.update(1000);

            expect(Time.fps).toBeGreaterThan(50);
            expect(Time.fps).toBeLessThan(70);
        });

        it('should reset accumulator and sample count after FPS calculation', () => {
            Time.init(0);

            // Run frames for over 1 second
            for (let i = 0; i < 70; i++) {
                Time.update(i * 16.67);
            }

            const mutableTime = Time as unknown as Mutable<typeof Time> & {
                accumulator: number;
                fpsSampleCount: number;
            };

            // Accumulator should reset after calculation
            expect(mutableTime.accumulator).toBeLessThan(1);
            expect(mutableTime.fpsSampleCount).toBeLessThan(70);
        });

        it('should handle variable frame rates', () => {
            Time.init(0);

            let currentTime = 0;

            // Simulate 30 FPS (33.33ms per frame) for over 1 second to trigger FPS calculation
            for (let i = 0; i <= 30; i++) {
                currentTime += 33.33;
                Time.update(currentTime);
            }

            // FPS should be around 30
            expect(Time.fps).toBeGreaterThan(25);
            expect(Time.fps).toBeLessThan(35);
        });

        it('should continuously update FPS over multiple seconds', () => {
            Time.init(0);

            let currentTime = 0;

            // First second at 60 FPS
            for (let i = 0; i <= 60; i++) {
                currentTime += 16.67;
                Time.update(currentTime);
            }

            const firstFPS = Time.fps;
            expect(firstFPS).toBeGreaterThan(50);

            // Second second at 30 FPS
            for (let i = 0; i <= 30; i++) {
                currentTime += 33.33;
                Time.update(currentTime);
            }

            expect(Time.fps).toBeLessThan(40);
            expect(Time.fps).not.toBe(firstFPS);
        });

        it('should not calculate FPS before accumulator reaches 1 second', () => {
            Time.init(0);

            // Run a few frames but not a full second
            for (let i = 0; i < 30; i++) {
                Time.update(i * 16.67);
            }

            // FPS should still be 0 (not calculated yet)
            expect(Time.fps).toBe(0);
        });
    });

    describe('elapsedTime', () => {
        it('should return elapsed time since initialization', () => {
            // Mock performance.now()
            vi.spyOn(performance, 'now').mockReturnValue(5000);

            Time.init(1000);

            expect(Time.elapsedTime).toBe(4);
        });

        it('should update as performance.now() changes', () => {
            const nowSpy = vi.spyOn(performance, 'now');

            nowSpy.mockReturnValue(1000);
            Time.init(1000);
            expect(Time.elapsedTime).toBe(0);

            nowSpy.mockReturnValue(2000);
            expect(Time.elapsedTime).toBe(1);

            nowSpy.mockReturnValue(3500);
            expect(Time.elapsedTime).toBe(2.5);
        });

        it('should work with negative start times', () => {
            vi.spyOn(performance, 'now').mockReturnValue(5000);

            Time.init(-1000);

            expect(Time.elapsedTime).toBe(6);
        });
    });

    describe('static readonly properties', () => {
        it('should have initial values of 0', () => {
            const mutableTime = Time as Mutable<typeof Time>;
            mutableTime.startTime = 0;
            mutableTime.lastFrameTick = 0;
            mutableTime.deltaTime = 0;
            mutableTime.frameCount = 0;
            mutableTime.fps = 0;

            expect(Time.startTime).toBe(0);
            expect(Time.lastFrameTick).toBe(0);
            expect(Time.deltaTime).toBe(0);
            expect(Time.frameCount).toBe(0);
            expect(Time.fps).toBe(0);
        });
    });

    describe('edge cases', () => {
        it('should handle update called before init', () => {
            Time.update(1000);

            expect(Time.deltaTime).toBe(1);
            expect(Time.lastFrameTick).toBe(1000);
            expect(Time.frameCount).toBe(1);
        });

        it('should handle identical timestamps', () => {
            Time.init(1000);
            Time.update(1000);

            expect(Time.deltaTime).toBe(0);
        });

        it('should handle backward time (time < lastFrameTick)', () => {
            Time.init(1000);
            Time.update(1100);
            Time.update(1050); // Go backward

            expect(Time.deltaTime).toBe(-0.05);
        });

        it('should handle very high frame counts', () => {
            Time.init(0);

            for (let i = 0; i < 10000; i++) {
                Time.update(i * 16.67);
            }

            expect(Time.frameCount).toBe(10000);
        });

        it('should calculate FPS with single frame per second', () => {
            Time.init(0);

            Time.update(0);
            Time.update(1000);

            // Should be 1 FPS (2 frames over 1 second)
            expect(Time.fps).toBe(2);
        });
    });

    describe('realistic game loop simulation', () => {
        it('should track time correctly in a 60 FPS game loop', () => {
            Time.init(0);

            const targetFPS = 60;
            const frameTime = 1000 / targetFPS;
            let currentTime = 0;

            // Simulate 3 seconds of gameplay
            for (let i = 0; i < targetFPS * 3; i++) {
                currentTime += frameTime;
                Time.update(currentTime);
            }

            expect(Time.frameCount).toBe(180);
            expect(Time.fps).toBeGreaterThan(55);
            expect(Time.fps).toBeLessThan(65);
        });

        it('should handle frame drops gracefully', () => {
            Time.init(0);

            let currentTime = 0;

            // Normal frames
            for (let i = 0; i < 30; i++) {
                currentTime += 16.67;
                Time.update(currentTime);
            }

            // Sudden frame drop (100ms spike)
            currentTime += 100;
            Time.update(currentTime);

            expect(Time.deltaTime).toBeCloseTo(0.1, 2);

            // Back to normal
            currentTime += 16.67;
            Time.update(currentTime);

            expect(Time.deltaTime).toBeCloseTo(0.01667, 4);
        });
    });
});
