"use strict";
class Object2D {
    constructor() {
        this.vertices = [];
        this.edges = [];
        this.orientation = new Matrix2D();
        this.animation = null;
        this.children = [];
        this.lineColor = "rgb(0, 0, 0)";
        this.fillColor = "rgb(255, 255, 255)";
        this.isFilled = false;
        let _this = this;

        // elapsedTimeMS: number, the number of milleseconds since the last call
        this.update = function _update(elapsedTimeMS) {
            if (this.animation) {
                this.animation.update(elapsedTimeMS);
            }
            for (let child of this.children) {
                child.update(elapsedTimeMS);
            }
        };

        this.render = function _render(context, parentOrientation) {
            context.beginPath();
            if (this.isFilled) {
                _filledRender(context, parentOrientation);
            }
            _lineRender(context, parentOrientation);
            context.closePath();
            let grandParentOrientation = parentOrientation.multiply(this.orientation);
            for (let child of this.children) {
                child.render(context, grandParentOrientation);
            }
        };

        function _lineRender(context, parentOrientation) {
            for (let i = 0; i < _this.edges.length - 1; i += 2) {
                const si = _this.edges[i];
                const ei = _this.edges[i + 1];
                let sv = _this.orientation.transform(_this.vertices[si]);
                let ev = _this.orientation.transform(_this.vertices[ei]);
                sv = parentOrientation.transform(sv);
                ev = parentOrientation.transform(ev);
                context.moveTo(sv.x, sv.y);
                context.lineTo(ev.x, ev.y);
            }
            context.strokeStyle = _this.lineColor;
            context.stroke();
        }

        function _filledRender(context, parentOrientation) {
            const si = _this.edges[0];
            let sv = _this.orientation.transform(_this.vertices[si]);
            sv = parentOrientation.transform(sv);
            context.moveTo(sv.x, sv.y);
            for (let i = 1; i < _this.edges.length - 1; i += 2) {
                const ei = _this.edges[i];
                let ev = _this.orientation.transform(_this.vertices[ei]);
                ev = parentOrientation.transform(ev);
                context.lineTo(ev.x, ev.y);
            }
            context.fillStyle = _this.fillColor;
            context.fill();
        }

        this.addChild = function _addChild(child, position) {
            child.orientation.translate(position.x, position.y);
            this.children.push(child);
        }
    }
}