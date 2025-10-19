import type { Mutable } from '@hatti/shared';

class Time {
    public static readonly startTime:     number = 0;

    public static readonly lastFrameTick: number = 0;

    public static readonly deltaTime:     number = 0;

    public static readonly frameCount:    number = 0;

    public static readonly fps:           number = 0;

    private static accumulator:           number = 0;

    private static fpsSampleCount:        number = 0;

    public static init(startTime: number): void {
        const self: Mutable<typeof Time> = Time;

        self.startTime = startTime;
        self.lastFrameTick = startTime;
    }

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

    public static get elapsedTime(): number {
        return (performance.now() - Time.startTime) / 1000;
    }
}

export default Time;
