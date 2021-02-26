"use strict";

(function _main() {
    let canvas = document.getElementById("drawingCanvas");
    let input_StartButton = document.getElementById("startPoly");
    let input_endButton = document.getElementById("endPoly");
    let input_undoButton = document.getElementById("undoPoly");
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

    // Don't show the end or undo buttons by default
    input_endButton.style.display = "none";
    input_undoButton.style.display = "none";



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
        // Add latest vertex edge
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

    input_undoButton.addEventListener("click", (event) => {
        // Remove latest vertex
        newPoly.vertices.pop()
        // Remove final 0
        newPoly.edges.pop();
        // Remove latest vertex from edge
        newPoly.edges.pop();
        // Remove connection to final zero
        newPoly.edges.pop();
        // Add final zero
        newPoly.edges.push(0);

        console.log(newPoly.edges);
    });

    input_StartButton.addEventListener("click", (event) => {
        // Switch button displays
        input_StartButton.style.display = "none";
        input_endButton.style.display = "block";
        input_undoButton.style.display = "block";
        // Create a new Object2D to manipulate
        _startNewPolygon();
    });

    input_endButton.addEventListener("click", (event) => {
        // Switch button displays
        input_StartButton.style.display = "block";
        input_endButton.style.display = "none";
        input_undoButton.style.display = "none";
        // Stop manipulating this Object2D
        _endNewPolygon();
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

    function _endNewPolygon() {
        // Save the this Object2D's properties
        let polyStr = JSON.stringify(newPoly);
        let name = _getFilenamePopup();
        if (name) {
            _saveFile(name, polyStr);
        }
    }

    function _saveFile(filename, data) {
        /*
        Saves a file for download.

        Code written by Stack Overflow user Ludovic Feltz
        in a response to the Sep. 2010 Question:
            "How to create a file in memory for user to download, but not through server?"

        https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
        */
        var blob = new Blob([data], { type: 'text/csv' });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            var elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    function _getFilenamePopup(defaultName = "Polygon.json") {
        // Makes a generic popup box asking what the file name should be.
        // Returns null if the user cancels and doesn't enter anything.
        // Otherwise, returns the name that the user entered.
        var filename = prompt("Please enter your name:", defaultName);
        if (filename) {
            return filename;
        }
        return null;
    }

})();