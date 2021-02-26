"use strict";

(function _main() {
    let canvas = document.getElementById("drawingCanvas");
    let input_StartButton = document.getElementById("startPoly");
    let input_endButton = document.getElementById("endPoly");
    let input_color = document.getElementById("polyColor");
    let world = new World2D(canvas);
    let animationLoop = new AnimationLoop(world);

    world.dc.setYBasis({ x: 0, y: -1 });
    world.dc.translate(canvas.width / 2, canvas.height / 2);
    animationLoop.run();

    canvas.addEventListener('click', (event) => {
        // Implementation based on notes by Dr. Jeff Roach
        // inside of "CSCI4157-Animation-HierarchicalModeling" on D2L.
        // https://elearn.etsu.edu/d2l/le/content/8468953/viewContent/72103140/View
        let targetElement = event.currentTarget;
        let realMouseX = event.clientX - targetElement.offsetLeft;
        let realMouseY = event.clientY - targetElement.offsetTop;

        // Device Coordinates to World Coordinates
        let dcToWc = new Matrix2D();
        dcToWc.setMatrix(world.dc.getInverse());
        let mousePosition = dcToWc.transform({ x: realMouseX, y: realMouseY });
        console.log(mousePosition);

    });

})();