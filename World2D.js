"use strict";
class World2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.objects = new Map();
        this.dc = new Matrix2D();

        // elapsedTimeMS: number, the number of milleseconds since the last call
        this.update = function _update(elapsedTimeMS) {
            this.objects.forEach((object) => {
                object.update(elapsedTimeMS);
            });
        };

        this.render = function _render() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.objects.forEach((object) => {
                object.render(this.context, this.dc);
            })
        };
    }
}