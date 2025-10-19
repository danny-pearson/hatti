import { getMainSurface } from './Core.js';
import Time from './Time.js';

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