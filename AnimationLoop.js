"use strict";
class AnimationLoop {
    constructor(world, tickLengthMS = 17) {
        this.world = world;
        let _thisLoop = {};
        let _this = this;
        _thisLoop.tickLengthMS = tickLengthMS;

        this.run = function _run() {
            _thisLoop.currentTimeMS = window.performance.now();
            _animationLoop(_thisLoop.currentTimeMS);
        };

        this.stop = function _stop() {
            window.cancelAnimationFrame(_thisLoop.handle);
        };

        // currentTimeMS: number (provided by requestAnimationFrame on callbacks)
        //                This is the current time expressed in milliseconds
        function _animationLoop(currentTimeMS) {
            // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
            _thisLoop.handle = window.requestAnimationFrame(_animationLoop);
            // When is the next tick?
            let nextTickMS = _thisLoop.currentTimeMS + _thisLoop.tickLengthMS;
            let tickCount = 0;
            // Calculate how many ticks to update the world
            if (currentTimeMS >= nextTickMS) {
                let timeSinceLastTick = currentTimeMS - _thisLoop.currentTimeMS;
                tickCount = Math.floor(timeSinceLastTick / _thisLoop.tickLengthMS);
            }
            for (let tick = 0; tick < tickCount; tick++) {
                _thisLoop.currentTimeMS += _thisLoop.tickLengthMS;
                _this.world.update(_thisLoop.tickLengthMS);
            }
            _this.world.render();
        }

    }
};
