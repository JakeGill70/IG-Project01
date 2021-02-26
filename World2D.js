"use strict";
class World2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.objects = new Map();
        this.dc = new Matrix2D();
        this.bgColor = "#FFFFFF";

        // elapsedTimeMS: number, the number of milleseconds since the last call
        this.update = function _update(elapsedTimeMS) {
            this.objects.forEach((object) => {
                object.update(elapsedTimeMS);
            });
        };

        this.render = function _render() {
            // Remove any artifacts
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Draw a new background
            this.context.rect(0, 0, canvas.width, canvas.height);
            this.context.fillStyle = this.bgColor;
            this.context.fill();
            // Draw everything else
            this.objects.forEach((object) => {
                object.render(this.context, this.dc);
            })
        };
    }
}