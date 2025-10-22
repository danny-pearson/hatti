import type { Mutable } from '@hatti/shared';

/**
 * Static class for tracking game loop timing information.
 *
 * Provides access to delta time, frame count, FPS, and elapsed time.
 * Must be initialized and updated each frame by the game loop.
 */
class Time {
    /** Time when the game loop started (milliseconds) */
    public static readonly startTime: number = 0;

    /** Timestamp of the last frame (milliseconds) */
    public static readonly lastFrameTick: number = 0;

    /** Time elapsed since last frame (seconds) */
    public static readonly deltaTime: number = 0;

    /** Total number of frames rendered since start */
    public static readonly frameCount: number = 0;

    /** Current frames per second (updated every second) */
    public static readonly fps: number = 0;

    private static accumulator: number = 0;

    private static fpsSampleCount: number = 0;

    /**
     * Initializes the Time system with the starting timestamp.
     *
     * @param startTime - Timestamp when the game loop starts (milliseconds)
     */
    public static init(startTime: number): void {
        const self: Mutable<typeof Time> = Time;

        self.startTime = startTime;
        self.lastFrameTick = startTime;
    }

    /**
     * Updates timing information for the current frame.
     *
     * Should be called once per frame with the current timestamp.
     * Calculates delta time, increments frame count, and updates FPS.
     *
     * @param time - Current timestamp (milliseconds)
     */
    public static update(time: number): void {
        const self: Mutable<typeof Time> = Time;

        const delta = (time - self.lastFrameTick) / 1000;

        self.deltaTime     = delta;
        self.lastFrameTick = time;
        self.frameCount++;

        this.accumulator += delta;
        this.fpsSampleCount++;

        if (this.accumulator >= 1) {
            self.fps = Math.round(this.fpsSampleCount / this.accumulator);

            this.accumulator    = 0;
            this.fpsSampleCount = 0;

            // console.log(self.fps);
        }
    }

    /**
     * Gets the total time elapsed since the game loop started.
     *
     * @returns Elapsed time in seconds
     */
    public static get elapsedTime(): number {
        return (performance.now() - Time.startTime) / 1000;
    }
}

export default Time;
