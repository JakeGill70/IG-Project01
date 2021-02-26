"use strict";

(function _main() {
    let canvas = document.getElementById("drawingCanvas");
    let input_StartButton = document.getElementById("startPoly");
    let input_endButton = document.getElementById("endPoly");
    let input_color = document.getElementById("polyColor");
    let world = new World2D(canvas);
    let animationLoop = new AnimationLoop(world);

    // Setup the world coordinate system
    world.dc.setYBasis({ x: 0, y: -1 });
    world.dc.translate(canvas.width / 2, canvas.height / 2);
    // Start any animations
    animationLoop.run();

    // Use these to create new polygons
    var newPolyCount = 0;
    var newPoly = new Object2D();

    // Don't show the end button by default
    input_endButton.style.display = "none";



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

        // Add the mouse position as a vertex
        newPoly.vertices.push(mousePosition);
        // Remove final 0
        newPoly.edges.pop();
        // Add latest vertex
        newPoly.edges.push(newPoly.vertices.length - 1);
        // Connect latest to final 0
        newPoly.edges.push(newPoly.vertices.length - 1);
        if (newPoly.edges.length != 2) {
            newPoly.edges.push(0);
        }

        console.log(newPoly.edges);

        let name = "newPoly" + newPolyCount;
        world.objects.set(name, newPoly);
    });

    input_StartButton.addEventListener("click", (event) => {
        // Switch button displays
        input_StartButton.style.display = "none";
        input_endButton.style.display = "block";
        // Create a new Object2D to manipulate
        _startNewPolygon();
    });

    function _startNewPolygon() {
        newPolyCount++;
        let name = "newPoly" + newPolyCount;
        newPoly = new Object2D();
        newPoly.isFilled = true;
        newPoly.fillColor = input_color.value;
        newPoly.lineColor = input_color.value;
        world.objects.set(name, newPoly);
    }
})();