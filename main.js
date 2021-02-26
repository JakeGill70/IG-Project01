"use strict";

(function _main() {
    let canvas = document.getElementById("drawingCanvas");
    let input_StartButton = document.getElementById("startPoly");
    let input_endButton = document.getElementById("endPoly");
    let input_undoButton = document.getElementById("undoPoly");
    let input_color = document.getElementById("polyColor");
    let world = new World2D(canvas);
    let animationLoop = new AnimationLoop(world);
    let isDrawingNewPolygon = false;

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

    // Set the background color to near-black
    world.bgColor = "#2A2A2A";

    //_loadScene1Art();
    //_loadScene2Art();

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

        if (isDrawingNewPolygon) {
            _addVertexToPolygon(mousePosition.x, mousePosition.y);
        }

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
        isDrawingNewPolygon = true;
        console.log("Is draw poly", isDrawingNewPolygon);
        newPolyCount++;
        let name = "newPoly" + newPolyCount;
        newPoly = new Object2D();
        newPoly.isFilled = true;
        newPoly.fillColor = input_color.value;
        newPoly.lineColor = input_color.value;
        world.objects.set(name, newPoly);
    }

    function _addVertexToPolygon(x, y) {
        let _x = x;
        let _y = y;
        // Add the mouse position as a vertex
        newPoly.vertices.push({ x: _x, y: _y });
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
    }

    function _endNewPolygon() {
        isDrawingNewPolygon = false;
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

    function _convertResponseToObject2D(responseAsset) {
        /* TODO: This should really be an overloaded constructor in Object2D.

            The assets, when stored as JSON, only store the data, not methods.
            The world object requires these methods. So, we must make new
            Object2D objects that have those methods then copy the asset data
            over to the new object.
            */
        let asset = new Object2D();
        asset.vertices = responseAsset.vertices;
        asset.edges = responseAsset.edges;
        asset.fillColor = responseAsset.fillColor;
        asset.lineColor = responseAsset.lineColor;
        asset.isFilled = responseAsset.isFilled;
        return asset;
    }

    async function _loadScene1Art() {
        let AssetNames = ["CaveEntrance", "LightPath", "Face", "Fire1", "Fire2", "Fire3", "Fire4", "FirePlace", "Hat", "Legs", "Torso"];
        let assetGetters = {};

        for (const name of AssetNames) {
            assetGetters[name] = await $.getJSON("Art/Scene1/" + name + ".json").then(Response => {
                world.objects.set(name, _convertResponseToObject2D(Response));
            });
        }

        // Add animation to fire
        world.objects.get("Fire1").animation = new HoverAnimation(world.objects.get("Fire1"), 0.1, 0.0, 0.50);
        world.objects.get("Fire2").animation = new HoverAnimation(world.objects.get("Fire2"), 0.1, 0.1, 0.25);
        world.objects.get("Fire3").animation = new HoverAnimation(world.objects.get("Fire3"), 0.1, 0.3, 0.15);
        world.objects.get("Fire4").animation = new HoverAnimation(world.objects.get("Fire4"), 0.1, 0.6, 0.50);
    }

    async function _loadScene2Art() {
        let AssetNames = ["Body", "Head", "Brow", "LeftCheek", "LeftEye", "LeftHair", "Mouth", "Nose", "RightCheek", "RightEye", "RightHair", "Wrinkle1", "Wrinkle2"];
        let assetGetters = {};

        for (const name of AssetNames) {
            assetGetters[name] = await $.getJSON("Art/Scene2/" + name + ".json").then(Response => {
                world.objects.set(name, _convertResponseToObject2D(Response));
            });
        }
    }

    function _locadScene3Art() {
        let textOBject = new Object2D();
        textOBject.render = function (ctx, dc) {
            ctx.font = "48px sans-serif";
            ctx.fillStyle = "#FF0000";
            ctx.fillText("It's dangerous to go alone,", 100, 250);
            ctx.fillText("take this!", 300, 350);
        };

        world.objects.set("text", textOBject);
    }

})();