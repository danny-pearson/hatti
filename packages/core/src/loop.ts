import { getMainSurface } from './Core.js';
import Time from './Time.js';

/**
 * Starts the main game loop using requestAnimationFrame.
 *
 * Automatically initializes and updates the Time system, saves and restores
 * canvas context state, and calls the provided callback function each frame.
 *
 * @param callbackFn - Function to call each frame with the current timestamp
 */
export default (callbackFn: CallableFunction) => {
    const tick = (time: number) => {
        if (Time.frameCount === 0) {
            Time.init(time);
        }

        Time.update(time);

        const mainSurface = getMainSurface();

        mainSurface?.context.save();

        callbackFn(time);

        mainSurface?.context.restore();

        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};