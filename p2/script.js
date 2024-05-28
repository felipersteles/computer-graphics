var canvas;
var gl;
var lineProgram, pointProgram, triangleProgram, polygonProgram;
var lineBuffer, pointBuffer, triangleBuffer, polygonBuffer;
var lineColorBuffer, pointColorBuffer, triangleColorBuffer, polygonColorBuffer;

var displayAngle;
var getSense;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var colorArray = [];

var colors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(0.0, 1.0, 1.0, 1.0), // cyan
];

var highlightedColors = [
    vec4(0.0, 0.0, 0.0, 0.5), // light black
    vec4(1.0, 0.0, 0.0, 0.5), // light red
    vec4(1.0, 1.0, 0.0, 0.5), // light yellow
    vec4(0.0, 1.0, 0.0, 0.5), // light green
    vec4(0.0, 0.0, 1.0, 0.5), // light blue
    vec4(1.0, 0.0, 1.0, 0.5), // light magenta
    vec4(0.0, 1.0, 1.0, 0.5), // light cyan
];

var cIndex = 0;

// ----------------------------------------------------------------
//              Select a object
// ----------------------------------------------------------------

var selectedObj = -1;
var isSelected = false;
var isRotating = false;

// ----------------------------------------------------------------
//            Select Draw Mode
// ----------------------------------------------------------------

const drawMode = {
    POINTS: 'points',
    LINES: 'lines',
    TRIANGLES: 'triangles',
    POLYGONS: 'polygons',
};
var selectedDrawMode = drawMode.POINTS;

const setPoints = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.POINTS;
    var show = document.getElementById("object");
    show.innerText = `points`;
};

const setLines = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.LINES;
    var show = document.getElementById("object");
    show.innerText = `lines`;
};

const setPolygons = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.POLYGONS;
    var show = document.getElementById("object");
    show.innerText = `polygons`;
};

const setTriangles = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.TRIANGLES;
    var show = document.getElementById("object");
    show.innerText = `triangles`;
};

// ----------------------------------------------------------------
//            DRAW POINTS
// ----------------------------------------------------------------
var points = [];
var pointsIndex = 0;

// ----------------------------------------------------------------
//            DRAW LINES
// ----------------------------------------------------------------
var lines = [];
var linesIndex = 0;

// ----------------------------------------------------------------
//            DRAW TRIANGLES
// ----------------------------------------------------------------
var triangles = [];
var trianglesColors = [];
var trianglesIndex = 0;
var trianglePoints = 0;
var vt1, vt2, vt3;

// ----------------------------------------------------------------
//            DRAW SQUARES
// ----------------------------------------------------------------
var polygons = [];
var polygonsColors = [];
var polygonsIndex = 0;
var first = true;
var v1, v2, v3, v4;

// ----------------------------------------------------------------
//            Select Action
// ----------------------------------------------------------------
const actions = {
    DRAW: 'draw',
    CLEAR: 'clear',
    MOVE: 'move',
    ROTATE: 'rotate',
};
var selectedAction = actions.DRAW;

// Receives event.clientX and event.clientY (pixels) and converts to canvas position.
function convertXY(x, y) {
    return vec2(2 * x / canvas.width - 1, 2 * (canvas.height - y) / canvas.height - 1);
}

// Main function
window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Separate Shaders
    // ----------------------------------------------------------------

    pointProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");
    lineProgram = initShaders(gl, "line-vertex-shader", "fragment-shader");
    polygonProgram = initShaders(gl, "polygon-vertex-shader", "fragment-shader");
    triangleProgram = initShaders(gl, "triangle-vertex-shader", "fragment-shader");

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Points
    // ----------------------------------------------------------------

    pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    pointColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Line
    // ----------------------------------------------------------------

    lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    lineColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Triangles
    // ----------------------------------------------------------------

    triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    triangleColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Polygon
    // ----------------------------------------------------------------

    polygonBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    polygonColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // UX / UI elements
    const pointsButton = document.getElementById("point");
    const linesButton = document.getElementById("line");
    const polygonButton = document.getElementById("polygon");
    const triangleButton = document.getElementById("triangles");

    displayAngle = document.getElementById('infoAngle');
    getSense = document.getElementById('sense');

    const colorMenu = document.getElementById("color-menu");

    const drawButton = document.getElementById("draw");
    const clearButton = document.getElementById("clear");
    const moveButton = document.getElementById("move");
    const rotateButton = document.getElementById("rotate");

    // Select color
    colorMenu.addEventListener("click", function () {
        cIndex = colorMenu.selectedIndex;
    });

    // Select draw mode
    pointsButton.onclick = setPoints;
    linesButton.onclick = setLines;
    polygonButton.onclick = setPolygons;
    triangleButton.onclick = setTriangles;

    canvas.addEventListener("click", clickOnCanvas);

    drawButton.onclick = () => {
        unhighlightObj(selectedObj);
        selectedAction = actions.DRAW;
        isSelected = false;
        selectedObj = -1;
        console.log(`Selected action: draw`);
    };

    clearButton.onclick = () => {
        isSelected = false;
        selectedObj = -1;
        selectedAction = actions.CLEAR;
    };

    moveButton.onclick = () => {
        if (
            selectedDrawMode != drawMode.POLYGONS &&
            selectedDrawMode != drawMode.TRIANGLES
        ) {
            alert('You must select a polygon or triangle.');
            return;
        }

        console.log('Selected action: move');
        isSelected = false;
        selectedObj = -1;
        selectedAction = actions.MOVE;
    };

    rotateButton.onclick = () => {
        if (
            selectedDrawMode != drawMode.POLYGONS &&
            selectedDrawMode != drawMode.TRIANGLES
        ) {
            alert('You must select a polygon or triangle.');
            return;
        }

        isSelected = false;
        selectedObj = -1;
        unhighlightObj(selectedObj);
        selectedAction = actions.ROTATE;
    };

    render();
};

const clickOnCanvas = (event) => {

    const x = event.clientX;
    const y = event.clientY;
    const pos = convertXY(x, y);

    const rotateMenu = document.getElementById("rotate-menu");
    rotateMenu.style = `display: ${selectedAction === actions.ROTATE ? 'block' : 'none'}`;

    switch (selectedAction) {
        case actions.MOVE:
            move(pos);
            break;

        case actions.ROTATE:
            rotate(pos);
            break;

        default:
            draw(pos);
            break;
    }
};

function clear() {
    console.clear();
    console.log('Cleared...');
    points = [];
    lines = [];
    polygons = [];
    triangles = [];

    pointsIndex = 0;
    linesIndex = 0;
    polygonsIndex = 0;
    trianglesIndex = 0;

    gl.clear(gl.COLOR_BUFFER_BIT);
}

// ----------------------------------------------------------------
//          Draw objects
// ----------------------------------------------------------------
function draw(pos) {
    switch (selectedDrawMode) {
        case drawMode.LINES:
            addLine(pos);
            break;
        case drawMode.POLYGONS:
            addPolygon(pos);
            break;
        case drawMode.TRIANGLES:
            addTriangle(pos);
            break;
        default:
            addPoint(pos);
            break;
    }
}

function addPoint(pos) {

    points.push(pos);

    var i = pointsIndex;
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pos));
    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colors[cIndex]));
    pointsIndex++;
}

function addLine(pos) {

    lines.push(pos);

    var i = linesIndex;
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pos));
    gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colors[cIndex]));
    linesIndex++;
}

function addTriangle(pos) {

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    switch (trianglePoints) {
        case 0:
            vt1 = pos;
            trianglePoints++;
            break;
        case 1:
            vt2 = pos;
            trianglePoints++;
            break;

        default:
            vt3 = pos;

            triangles.push([
                [vt1, vt2],
                [vt1, vt3],
                [vt2, vt3]
            ]);

            const triangleColor = colors[cIndex];
            trianglesColors.push(triangleColor);

            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * trianglesIndex, flatten(vt1));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (trianglesIndex + 1), flatten(vt2));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (trianglesIndex + 2), flatten(vt3));

            gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
            trianglesIndex += 3;

            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (trianglesIndex - 3), flatten(triangleColor));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (trianglesIndex - 2), flatten(triangleColor));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (trianglesIndex - 1), flatten(triangleColor));

            trianglePoints = 0;
            break;
    }
}

function addPolygon(pos) {

    gl.bindBuffer(gl.ARRAY_BUFFER, polygonBuffer);
    if (first) {
        first = false;
        v1 = pos;
    } else {
        first = true;
        v2 = pos;
        v3 = vec2(v1[0], v2[1]);
        v4 = vec2(v2[0], v1[1]);

        const polygonColor = colors[cIndex];
        polygonsColors.push(polygonColor);

        polygons.push([
            [v1, v3],
            [v1, v4],
            [v2, v3],
            [v2, v4]
        ]);

        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * polygonsIndex, flatten(v1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (polygonsIndex + 1), flatten(v3));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (polygonsIndex + 2), flatten(v2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (polygonsIndex + 3), flatten(v4));

        gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);
        polygonsIndex += 4;

        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 4), flatten(polygonColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 3), flatten(polygonColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 2), flatten(polygonColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 1), flatten(polygonColor));
    }
}

// ----------------------------------------------------------------
//          Move objects
// ----------------------------------------------------------------
function move(pos) {
    switch (selectedDrawMode) {
        case drawMode.POLYGONS:
            moveSquare(pos);
            break;
        case drawMode.TRIANGLES:
            moveTriangle(pos);
            break;
    }
}

// ----------------------------------------------------------------
//          Move triangle
//  ---------------------------------------------------------------
function moveTriangle(pos) {
    selectedObj = getTriangle(pos);
    if (selectedObj >= 0) {
        canvas.addEventListener('mousemove', moveOnMouse);
        document.addEventListener('keypress', stopMove);
    }
}

const moveOnMouse = (e) => {
    const newPos = convertXY(e.clientX, e.clientY);
    const newX = newPos[0];
    const newY = newPos[1];
    moveTriangleObj(selectedObj, newX, newY);
}

const stopMove = (e) => {
    if (e.key !== 'Enter') return;

    const selIndexStart = 3 * selectedObj;
    const selIndexEnd = 3 + selIndexStart;

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);

    // Get index of color of selected object
    const triangleColor = trianglesColors[selectedObj];

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 3), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 2), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 1), flatten(triangleColor));

    selectedObj = -1;
    isSelected = false;
    canvas.removeEventListener('mousemove', moveOnMouse);
    canvas.addEventListener("click", clickOnCanvas);
}

// Returns the clicked triangle
function getTriangle(pos) {
    var pickedIndex; // Index of triangle picked
    for (let i = triangles.length - 1; i >= 0; i--) {
        const pickReturn = pickTriangle(i, pos[0], pos[1]);
        if (pickReturn) {
            isSelected = true;
            pickedIndex = i;
            highlightTriangle(i);
            console.log("Selected object index: " + pickedIndex);
            isSelected = true;
            return pickedIndex;
        }
    }
    isSelected = false;
    return -1;
}

function highlightTriangle(selObj) {
    var selColorIndex;
    if (isSelected) {
        selIndex = 3 + 3 * selObj;
        selColorIndex = colorArray[selObj];
        const color = vec4(highlightedColors[selColorIndex]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(color));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(color));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(color));
    }
}

function pickTriangle(currentId, x, y) {
    var ni = 0;
    var p1, p2; // Edges
    var p1x, p1y, p2x, p2y;
    var xc;

    for (let j = 0; j < 3; j++) {
        p1 = triangles[currentId][j][0];
        p2 = triangles[currentId][j][1];
        p1x = p1[0], p1y = p1[1];
        p2x = p2[0], p2y = p2[1];
        if (
            // Cases to discard:
            !(p1y == p2y) &&
            !(p1y > y && p2y > y) &&
            !(p1y < y && p2y < y) &&
            !(p1x < x && p2x < x)
        ) {
            if (p1y == y) {
                if (p1x > x && p2y > y) {
                    ni += 1;
                }
            } else if (p2y == y) {
                if (p2x > x && p1y > y) {
                    ni += 1;
                }
            } else if (p1x > x && p2x > x) {
                ni += 1;
            } else {
                var dx = p1x - p2x;
                xc = p1x;
                if (dx != 0.0) {
                    xc += ((y - p1y) * dx) / (p1y - p2y);
                }
                if (xc > x) {
                    ni += 1;
                }
            }
        }
    }
    return ni % 2 === 1;
}

function moveTriangleObj(selObj, x, y) {
    var oldX, oldY;
    var newX, newY;
    var deltaX, deltaY;
    var selIndexStart;

    if (isSelected) {
        selIndexStart = 3 * selObj;
        selIndexEnd = 3 + selIndexStart;
        vt1 = triangles[selObj][0][0];
        vt2 = triangles[selObj][0][1];
        vt3 = triangles[selObj][1][1];
        oldX = (vt1[0] + vt2[0] + vt3[0]) / 3;
        oldY = (vt1[1] + vt2[1] + vt3[1]) / 3;
        newX = x, newY = y;
        deltaX = newX - oldX;
        deltaY = newY - oldY;
        vt1[0] = vt1[0] + deltaX;
        vt1[1] = vt1[1] + deltaY;
        vt2[0] = vt2[0] + deltaX;
        vt2[1] = vt2[1] + deltaY;
        vt3[0] = vt3[0] + deltaX;
        vt3[1] = vt3[1] + deltaY;
        updateTriangleEdges(selObj, vt1, vt2, vt3);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(vt1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(vt2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(vt3));
    }
}

function updateTriangleEdges(selObj, a, b, c) {
    triangles[selObj] = [
        [a, b],
        [a, c],
        [b, c]
    ];
}

// ----------------------------------------------------------------
//          Move Squares
//  ---------------------------------------------------------------

function moveSquare(pos) {
    const x = pos[0];
    const y = pos[1];
    if (!isSelected) {
        selectedObj = getSquare(x, y);
        if (selectedObj >= 0) {
            canvas.addEventListener('mousemove', moveSquareOnMouse);
            document.addEventListener('keypress', stopMoveSquare);
        }
    }
}

const moveSquareOnMouse = (e) => {
    const newPos = convertXY(e.clientX, e.clientY);
    const newX = newPos[0];
    const newY = newPos[1];
    moveSquareObj(selectedObj, newX, newY);
}

const stopMoveSquare = (e) => {
    if (e.key !== 'Enter') return;

    const selIndexStart = 4 * selectedObj;
    const selIndexEnd = 4 + selIndexStart;

    gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);

    // Get index of color of selected object
    const polygonColor = polygonsColors[selectedObj];

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 4), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 3), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 2), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 1), flatten(polygonColor));

    selectedObj = -1;
    isSelected = false;
    canvas.removeEventListener('mousemove', moveSquareOnMouse);
    canvas.addEventListener("click", clickOnCanvas);
}

function moveSquareObj(selObj, x, y) {
    var oldX, oldY;
    var newX, newY;
    var deltaX, deltaY;
    var selIndexStart;

    if (isSelected) {
        selIndexStart = 4 * selObj;
        selIndexEnd = 4 + selIndexStart;
        v1 = polygons[selObj][0][0];
        v2 = polygons[selObj][2][0];
        v3 = polygons[selObj][0][1];
        v4 = polygons[selObj][1][1];
        oldX = (v1[0] + v2[0]) / 2;
        oldY = (v1[1] + v2[1]) / 2;
        newX = x, newY = y;
        deltaX = newX - oldX;
        deltaY = newY - oldY;
        v1[0] = v1[0] + deltaX;
        v1[1] = v1[1] + deltaY;
        v2[0] = v2[0] + deltaX;
        v2[1] = v2[1] + deltaY;
        v3[0] = v3[0] + deltaX;
        v3[1] = v3[1] + deltaY;
        v4[0] = v4[0] + deltaX;
        v4[1] = v4[1] + deltaY;
        updateSquareEdges(selObj, v1, v2, v3, v4);
        gl.bindBuffer(gl.ARRAY_BUFFER, polygonBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(v1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(v3));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(v2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 3), flatten(v4));
    }
}

function updateSquareEdges(selObj, a, b, c, d) {
    polygons[selObj] = [
        [a, c],
        [a, d],
        [b, c],
        [b, d]
    ];
}

function getSquare(clickX, clickY) {
    var pickedIndex;
    for (let i = polygons.length - 1; i >= 0; i--) {
        const pickReturn = pickArea(i, clickX, clickY);
        if (pickReturn) {
            isSelected = true;
            pickedIndex = i;
            highlightObj(i);
            console.log("Selected object index: " + pickedIndex);
            return pickedIndex;
        }
    }
    isSelected = false;
    return null;
}

function pickArea(currentId, x, y) {
    var ni = 0;
    var p1, p2; // Edges
    var p1x, p1y, p2x, p2y;
    var xc;

    for (let j = 0; j < 4; j++) {
        p1 = polygons[currentId][j][0];
        p2 = polygons[currentId][j][1];
        p1x = p1[0], p1y = p1[1];
        p2x = p2[0], p2y = p2[1];
        if (
            !(p1y == p2y) &&
            !(p1y > y && p2y > y) &&
            !(p1y < y && p2y < y) &&
            !(p1x < x && p2x < x)
        ) {
            if (p1y == y) {
                if (p1x > x && p2y > y) {
                    ni += 1;
                }
            } else if (p2y == y) {
                if (p2x > x && p1y > y) {
                    ni += 1;
                }
            } else if (p1x > x && p2x > x) {
                ni += 1;
            } else {
                var dx = p1x - p2x;
                xc = p1x;
                if (dx != 0.0) {
                    xc += ((y - p1y) * dx) / (p1y - p2y);
                }
                if (xc > x) {
                    ni += 1;
                }
            }
        }
    }
    return ni % 2 === 1;
}

function highlightObj(selObj) {
    var selColorIndex;
    if (isSelected) {
        selIndex = 4 + 4 * selObj;
        selColorIndex = colorArray[selObj];
        const t = vec4(highlightedColors[selColorIndex]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 4), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(t));
    }
}

function unhighlightObj(selObj) {
    if (!isSelected) return;
    const selIndex = 4 + 4 * selObj;
    const polygonColor = polygonsColors[selObj];
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 4), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(polygonColor));
    selectedObj = -1;
    isSelected = false;
}

// ----------------------------------------------------------------
//          Rotate objects
// ----------------------------------------------------------------
function rotate(pos) {
    switch (selectedDrawMode) {
        case drawMode.POLYGONS:
            rotatePolygon(pos);
            break;
        case drawMode.TRIANGLES:
            rotateTriangle(pos);
            break;
    }
}

// ----------------------------------------------------------------
//          Rotate triangle
// ----------------------------------------------------------------
function rotateTriangle(pos) {
    selectedObj = getTriangle(pos);
    if (selectedObj < 0) return;
    canvas.addEventListener('mousedown', startTriangleRotation);
}

const startTriangleRotation = (e) => {
    canvas.addEventListener('mousemove', rotateTriangleOnMouse);
    canvas.addEventListener('mouseup', stopTriangleRotation);
}

const rotateTriangleOnMouse = (e) => {
    if (selectedObj < 0) return;
    const mouseY = e.movementY;
    var theta = 0;
    const senseInput = getSense?.value;
    const sense = senseInput ? senseInput : 15;
    if (mouseY > 0) {
        theta += sense;
    } else if (mouseY < 0) {
        theta -= sense;
    }
    displayAngle.innerText = theta < 0 ? "Sentido horário" : "Sentido anti-horário";
    const angle = theta * (Math.PI / 180);
    rotateTriangleObj(selectedObj, angle);
}

const stopTriangleRotation = (e) => {
    const selIndexStart = 3 * selectedObj;
    const selIndexEnd = 3 + selIndexStart;
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    const triangleColor = trianglesColors[selectedObj];
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 3), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 2), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 1), flatten(triangleColor));
    selectedObj = -1;
    isSelected = false;
    isRotating = false;
    canvas.removeEventListener('mousedown', startTriangleRotation);
    canvas.removeEventListener('mousemove', rotateTriangleOnMouse);
    canvas.removeEventListener('mouseup', stopTriangleRotation);
}

function rotateTriangleObj(obj, angle) {
    if (obj < 0) return;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var selIndexStart = 3 * obj;
    var newX = 0, newY = 0;
    var oldX = 0, oldY = 0;
    var deltaX = 0, deltaY = 0;
    vt1 = triangles[obj][0][0];
    vt2 = triangles[obj][0][1];
    vt3 = triangles[obj][1][1];
    oldX = (vt1[0] + vt2[0] + vt3[0]) / 3;
    oldY = (vt1[1] + vt2[1] + vt3[1]) / 3;
    deltaX = newX - oldX;
    deltaY = newY - oldY;
    var refV1 = [0, 0];
    refV1[0] = vt1[0] + deltaX;
    refV1[1] = vt1[1] + deltaY;
    var refV2 = [0, 0];
    refV2[0] = vt2[0] + deltaX;
    refV2[1] = vt2[1] + deltaY;
    var refV3 = [0, 0];
    refV3[0] = vt3[0] + deltaX;
    refV3[1] = vt3[1] + deltaY;
    var rotation = mat2(
        vec2(cos, sin),
        vec2(-sin, cos)
    );
    refV1 = (mult(mat2(refV1[0], refV1[1]), rotation))[0];
    refV2 = (mult(mat2(refV2[0], refV2[1]), rotation))[0];
    refV3 = (mult(mat2(refV3[0], refV3[1]), rotation))[0];
    newX = oldX, newY = oldY;
    oldX = 0, oldY = 0;
    deltaX = newX - oldX;
    deltaY = newY - oldY;
    vt1[0] = refV1[0] + deltaX;
    vt1[1] = refV1[1] + deltaY;
    vt2[0] = refV2[0] + deltaX;
    vt2[1] = refV2[1] + deltaY;
    vt3[0] = refV3[0] + deltaX;
    vt3[1] = refV3[1] + deltaY;
    updateTriangleEdges(obj, vt1, vt2, vt3);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(vt1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(vt2));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(vt3));
}

// ----------------------------------------------------------------
//          Rotate polygon
// ----------------------------------------------------------------
function rotatePolygon(pos) {
    const x = pos[0];
    const y = pos[1];
    if (!isSelected) {
        selectedObj = getSquare(x, y);
        if (selectedObj < 0) return;
    }
    canvas.addEventListener('mousedown', startPolygonRotation);
}

const startPolygonRotation = (e) => {
    canvas.addEventListener('mousemove', rotatePolygonOnMouse);
    canvas.addEventListener('mouseup', stopPolygonRotation);
}

const rotatePolygonOnMouse = (e) => {
    if (selectedObj < 0) return;
    const mouseY = e.movementY;
    var theta = 0;
    const senseInput = getSense?.value;
    const sense = senseInput ? senseInput : 15;
    if (mouseY > 0) {
        theta += sense;
    } else if (mouseY < 0) {
        theta -= sense;
    }
    displayAngle.innerText = theta < 0 ? "Sentido horário" : "Sentido anti-horário";
    const angle = theta * (Math.PI / 180);
    rotatePolygonObj(selectedObj, angle);
}

const stopPolygonRotation = (e) => {
    selectedObj = -1;
    isSelected = false;
    canvas.removeEventListener('mousedown', startPolygonRotation);
    canvas.removeEventListener('mousemove', rotatePolygonOnMouse);
    canvas.removeEventListener('mouseup', stopPolygonRotation);
}

function rotatePolygonObj(obj, angle) {
    if (obj < 0) return;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var selIndexStart = 4 * obj;
    var v1 = polygons[obj][0][0];
    var v2 = polygons[obj][2][0];
    var v3 = polygons[obj][0][1];
    var v4 = polygons[obj][1][1];
    var oldX = (v1[0] + v2[0]) / 2;
    var oldY = (v1[1] + v2[1]) / 2;
    var deltaX = 0 - oldX;
    var deltaY = 0 - oldY;
    v1[0] += deltaX;
    v1[1] += deltaY;
    v2[0] += deltaX;
    v2[1] += deltaY;
    v3[0] += deltaX;
    v3[1] += deltaY;
    v4[0] += deltaX;
    v4[1] += deltaY;
    v1 = [v1[0] * cos - v1[1] * sin, v1[0] * sin + v1[1] * cos];
    v2 = [v2[0] * cos - v2[1] * sin, v2[0] * sin + v2[1] * cos];
    v3 = [v3[0] * cos - v3[1] * sin, v3[0] * sin + v3[1] * cos];
    v4 = [v4[0] * cos - v4[1] * sin, v4[0] * sin + v4[1] * cos];
    deltaX = oldX;
    deltaY = oldY;
    v1[0] += deltaX;
    v1[1] += deltaY;
    v2[0] += deltaX;
    v2[1] += deltaY;
    v3[0] += deltaX;
    v3[1] += deltaY;
    v4[0] += deltaX;
    v4[1] += deltaY;
    updateSquareEdges(obj, v1, v2, v3, v4);
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(v1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(v3));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(v2));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 3), flatten(v4));
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw points
    if (points.length > 0) {
        gl.useProgram(pointProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
        var vPosition = gl.getAttribLocation(pointProgram, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        var vColor = gl.getAttribLocation(pointProgram, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        gl.drawArrays(gl.POINTS, 0, pointsIndex);
    }

    // Draw lines
    if (lines.length > 0) {
        gl.useProgram(lineProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
        var vPosition = gl.getAttribLocation(lineProgram, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
        var vColor = gl.getAttribLocation(lineProgram, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        gl.drawArrays(gl.LINES, 0, linesIndex);
    }

    // Draw triangles
    if (triangles.length > 0) {
        gl.useProgram(triangleProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        var vPosition = gl.getAttribLocation(triangleProgram, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
        var vColor = gl.getAttribLocation(triangleProgram, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        for (var i = 0; i < trianglesIndex; i += 3) {
            gl.drawArrays(gl.TRIANGLES, i, 3);
        }
    }

    // Draw polygons
    if (polygons.length > 0) {
        gl.useProgram(polygonProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, polygonBuffer);
        var vPosition = gl.getAttribLocation(polygonProgram, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);
        var vColor = gl.getAttribLocation(polygonProgram, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        for (var i = 0; i < polygonsIndex; i += 4) {
            gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
        }
    }

    window.requestAnimationFrame(render);
}
