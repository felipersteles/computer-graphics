
var canvas;
var gl;
var lineProgram, pointProgram, triangleProgram, polygonProgram;
var lineBuffer, pointBuffer, triangleBuffer, polygonBuffer;
var lineColorBuffer, pointColorBuffer, triangleColorBuffer, polygonColorBuffer;

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
var selectedDrawMode = drawMode.POINTS

const setPoints = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.POINTS
    var show = document.getElementById("object");
    show.innerText = `points`
}

const setLines = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.LINES
    var show = document.getElementById("object");
    show.innerText = `lines`
}

const setPolygons = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.POLYGONS
    var show = document.getElementById("object");
    show.innerText = `polygons`
}

const setTriangles = () => {
    selectedAction = actions.DRAW;
    selectedDrawMode = drawMode.TRIANGLES
    var show = document.getElementById("object");
    show.innerText = `triangles`
}


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

// receives event.clientX and event.clientY (pixels) and converts to canvas position.
function convertXY(x, y) {

    convertedArray = vec2(2 * x / canvas.width - 1, 2 * (canvas.height - y) / canvas.height - 1);

    return convertedArray;

}

// main function
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

    const colorMenu = document.getElementById("mymenu");

    const drawButton = document.getElementById("draw");
    const clearButton = document.getElementById("clear");
    const moveButton = document.getElementById("move");
    const rotateButton = document.getElementById("rotate");

    // select color
    colorMenu.addEventListener("click", function () {
        cIndex = colorMenu.selectedIndex;
    });

    // select draw mode
    pointsButton.onclick = setPoints
    linesButton.onclick = setLines
    polygonButton.onclick = setPolygons
    triangleButton.onclick = setTriangles

    // click coordinates
    var x, y;

    canvas.addEventListener("mousedown", clickOnCanvas);

    drawButton.onclick = () => {
        unhighlightObj(selectedObj)
        selectedAction = actions.DRAW;
        console.log(`Selected action: draw`)
    }
    clearButton.onclick = () => {
        selectedAction = actions.CLEAR;
    }
    moveButton.onclick = () => {
        if (
            selectedDrawMode != drawMode.POLYGONS &&
            selectedDrawMode != drawMode.TRIANGLES
        ) {
            alert('You must select a polygon.');
            return;
        }

        console.log('Selected action: move');
        selectedAction = actions.MOVE;
    }
    rotateButton.onclick = () => {
        if (selectedDrawMode != drawMode.POLYGONS) {
            alert('You must select a polygon.');
            return;
        }

        unhighlightObj(selectedObj)
        selectedAction = actions.ROTATE;
    }

    render()
}

const clickOnCanvas = (event) => {

    x = event.clientX, y = event.clientY;
    const pos = convertXY(x, y);

    // console.log("x: " + x + ", y: " + y);

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
}

function clear() {
    console.clear();
    console.log('Cleared...');
    points = []
    lines = []
    polygons = []

    pointsIndex = 0;
    linesIndex = 0;
    polygonsIndex = 0;

    gl.getParameter(gl.COLOR_CLEAR_VALUE);
    gl.getParameter(gl.DEPTH_CLEAR_VALUE);
    gl.getParameter(gl.STENCIL_CLEAR_VALUE);

    selectedAction = actions.DRAW;
}

// ----------------------------------------------------------------
//          Draw objects
// ----------------------------------------------------------------
function draw(pos) {
    switch (selectedDrawMode) {
        case drawMode.LINES:
            addLine(pos)
            break
        case drawMode.POLYGONS:
            addPolygon(pos)
            break
        case drawMode.TRIANGLES:
            addTriangle(pos)
            break
        default:
            addPoint(pos)
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

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer)
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
            ])

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

            trianglePoints++;
            trianglePoints = 0;
            break;
    }
}

function addPolygon(pos) {

    gl.bindBuffer(gl.ARRAY_BUFFER, polygonBuffer)
    if (first) {
        first = false;
        v1 = pos;
    }
    else {
        first = true;
        v2 = pos;
        v3 = vec2(v1[0], v2[1]);
        v4 = vec2(v2[0], v1[1]);

        // console.log('v1', v1, 'v2', v2, 'v3', v3, 'v4', v4)

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
    if (!isSelected)
        selectedObj = getTriangle(pos);
    else {
        canvas.addEventListener('mousemove', moveOnMouse)
        document.addEventListener('keypress', stopMove)
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

    canvas.removeEventListener('mousemove', moveOnMouse);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);

    // get index of color of selected object
    const triangleColor = trianglesColors[selectedObj];

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 3), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 2), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 1), flatten(triangleColor));

    selectedObj = -1;
    isSelected = false;
}

// returns the clicked triangle
function getTriangle(pos) {
    var pickedIndex; // index of triangle picked
    for (let i = triangles.length - 1; i >= 0; i--) {

        const pickReturn = pickTriangle(i, pos[0], pos[1]);

        if (pickReturn) {
            isSelected = true;
            pickedIndex = i;
            highlightTriangle(i);

            console.log("Selected object index: " + pickedIndex);
            return pickedIndex;
        }
    }

    isSelected = false;
    return null;
}

function highlightTriangle(selObj) {
    var selColorIndex;

    if (isSelected) {

        selIndex = 3 + 3 * selObj;

        // get index of color of selected object
        selColorIndex = colorArray[selObj];

        // use same color to highlight selected object
        const color = vec4(highlightedColors[selColorIndex]);

        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(color));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(color));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(color));

    }
}

function pickTriangle(currentId, x, y) {

    var ni = 0;
    var p1, p2; // edges
    var p1x, p1y, p2x, p2y;
    var xc;

    for (let j = 0; j < 3; j++) {
        p1 = triangles[currentId][j][0];
        p2 = triangles[currentId][j][1];

        p1x = p1[0], p1y = p1[1];
        p2x = p2[0], p2y = p2[1];

        if (
            // cases to discard:
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
        // get index of the selected object in buffer (considering bytes)
        selIndexStart = 3 * selObj;
        selIndexEnd = 3 + selIndexStart;

        // get coordinates for old vertices
        vt1 = triangles[selObj][0][0];
        vt2 = triangles[selObj][0][1];
        vt3 = triangles[selObj][1][1];

        // calculate old center
        // Use edges v1-v2 to get the X and Y of the center
        oldX = (vt1[0] + vt2[0] + vt3[0]) / 3;
        oldY = (vt1[1] + vt2[1] + vt3[1]) / 3;

        // receiving new center from click
        newX = x, newY = y;

        // calculate delta
        deltaX = newX - oldX;
        deltaY = newY - oldY;

        // calculate new vertices
        vt1[0] = vt1[0] + deltaX;
        vt1[1] = vt1[1] + deltaY;

        vt2[0] = vt2[0] + deltaX;
        vt2[1] = vt2[1] + deltaY;

        vt3[0] = vt3[0] + deltaX;
        vt3[1] = vt3[1] + deltaY;

        // update edges array
        updateTriangleEdges(selObj, vt1, vt2, vt3);

        // update buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(vt1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(vt2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(vt3));
    }


}

function updateTriangleEdges(selObj, a, b, c) {

    // update edges of polygons after move it
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
    }
    else
        moveSquareObj(selectedObj, x, y, polygonBuffer, polygonColorBuffer);
}

// returns whether an object has been selected.
function getSquare(clickX, clickY) {

    var pickedIndex;

    for (let i = polygons.length - 1; i >= 0; i--) {

        const pickReturn = pickArea(i, clickX, clickY);

        if (pickReturn) {
            isSelected = true;
            pickedIndex = i;
            highlightObj(i);

            console.log("selected object index: " + pickedIndex);
            return pickedIndex;
        }
    }

    isSelected = false;
    return null;
}

function moveSquareObj(selObj, x, y, vBuffer, cBuffer) {

    var oldX, oldY;
    var newX, newY;
    var deltaX, deltaY;
    var selIndexStart, selIndexEnd;

    if (isSelected) {
        // get index of the selected object in buffer (considering bytes)
        selIndexStart = 4 * selObj;
        selIndexEnd = 4 + 4 * selObj;

        // get coordinates for old vertices
        v1 = polygons[selObj][0][0];
        v2 = polygons[selObj][2][0];
        v3 = polygons[selObj][0][1];
        v4 = polygons[selObj][1][1];

        // calculate old center
        // Use edges v1-v2 to get the X and Y of the center
        oldX = (v1[0] + v2[0]) / 2;
        oldY = (v1[1] + v2[1]) / 2;

        // receiving new center from click
        newX = x, newY = y;

        // calculate delta
        deltaX = newX - oldX;
        deltaY = newY - oldY;

        // calculate new vertices
        v1[0] = v1[0] + deltaX;
        v1[1] = v1[1] + deltaY;

        v2[0] = v2[0] + deltaX;
        v2[1] = v2[1] + deltaY;

        v3[0] = v3[0] + deltaX;
        v3[1] = v3[1] + deltaY;

        v4[0] = v4[0] + deltaX;
        v4[1] = v4[1] + deltaY;

        // update edges array
        updateSquareEdges(selObj, v1, v2, v3, v4);

        // update buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(v1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(v3));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(v2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 3), flatten(v4));

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

        // get index of color of selected object
        const polygonColor = polygonsColors[selObj];

        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 4), flatten(polygonColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 3), flatten(polygonColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 2), flatten(polygonColor));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 1), flatten(polygonColor));

        isSelected = false;

    }

}

function updateSquareEdges(selObj, a, b, c, d) {

    // update edges of polygons after move it
    polygons[selObj] = [[a, c],
    [a, d],
    [b, c],
    [b, d]];

}

function pickArea(currentId, x, y) {

    var ni = 0;
    var p1, p2; // edges
    var p1x, p1y, p2x, p2y;
    var xc;

    for (let j = 0; j < 4; j++) {
        p1 = polygons[currentId][j][0];
        p2 = polygons[currentId][j][1];

        p1x = p1[0], p1y = p1[1];
        p2x = p2[0], p2y = p2[1];

        if (
            // cases to discard:
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

// highlights selected object with a lighter color.
function highlightObj(selObj) {

    var selColorIndex;

    if (isSelected) {

        selIndex = 4 + 4 * selObj;

        // get index of color of selected object
        selColorIndex = colorArray[selObj];

        // use same color to highlight selected object
        t = vec4(highlightedColors[selColorIndex]);

        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 4), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(t));

    }
}

// unhighlights selected object back to original color.
function unhighlightObj(selObj) {

    if (!isSelected) return;

    const selIndex = 4 + 4 * selObj;

    // get index of color of selected object
    const polygonColor = polygonsColors[selObj];

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 4), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(polygonColor));


    // libera o objeto selecionado
    selectedObj = -1;
    isSelected = false;
}


// ----------------------------------------------------------------
//          Rotate objects
// ----------------------------------------------------------------
function rotate(pos) {

    const x = pos[0];
    const y = pos[1];

    if (!isSelected) {
        obj = getSelected(x, y);
        console.log("selected object index: " + obj);

        if (obj > -1) isRotating = true;
    }
    else
        rotateObj(obj, polygonBuffer, polygonColorBuffer);
}

function rotateObj(obj, vBuffer, cBuffer) {


    var theta = 0;
    var angle, cos, sin;
    var selIndexStart = 4 * obj;
    var b = document.getElementById('infoAngle')

    canvas.addEventListener("wheel", (e) => {

        if (!isRotating) return;

        if (e.deltaY > 0) {
            theta = (theta + 10) % 360;
        } else {
            theta = (theta - 10) % 360;
        }

        b.innerText = theta
        // b.style.display = "block";

        // calculate angle in radians
        angle = theta * (Math.PI / 180);
        // console.log(angle)
        cos = Math.cos(angle);
        sin = Math.sin(angle);

        // new center is 0, old center is selected center
        var newX = 0, newY = 0;
        var oldX = 0, oldY = 0;
        var deltaX = 0, deltaY = 0;

        // get original vertices
        var t1 = polygons[obj][0][0];
        var t2 = polygons[obj][2][0];
        var t3 = polygons[obj][0][1];
        var t4 = polygons[obj][1][1];

        // calculate current center
        oldX = (t1[0] + t2[0]) / 2;
        oldY = (t1[1] + t2[1]) / 2;

        // calculate delta from old position to center
        deltaX = newX - oldX;
        deltaY = newY - oldY;

        // calculate new vertices positions
        t1[0] = t1[0] + deltaX;
        t1[1] = t1[1] + deltaY;

        t2[0] = t2[0] + deltaX;
        t2[1] = t2[1] + deltaY;

        t3[0] = t3[0] + deltaX;
        t3[1] = t3[1] + deltaY;

        t4[0] = t4[0] + deltaX;
        t4[1] = t4[1] + deltaY;

        // object is centered, now rotate  
        var rotation = mat2(vec2(cos, sin),
            vec2(-sin, cos));

        var resultT1 = (mult(mat2(t1[0], t1[1]), rotation));
        var resultT2 = (mult(mat2(t2[0], t2[1]), rotation));
        var resultT3 = (mult(mat2(t3[0], t3[1]), rotation));
        var resultT4 = (mult(mat2(t4[0], t4[1]), rotation));

        // update vertices with result
        t1 = resultT1[0];
        t2 = resultT2[0];
        t3 = resultT3[0];
        t4 = resultT4[0];

        // object is rotated, now move back
        // new center is now going to be old center
        newX = oldX, newY = oldY;
        oldX = 0, oldY = 0;

        // // calculate delta again
        deltaX = newX - oldX;
        deltaY = newY - oldY;

        // calculate rotated vertices positions
        t1[0] = t1[0] + deltaX;
        t1[1] = t1[1] + deltaY;

        t2[0] = t2[0] + deltaX;
        t2[1] = t2[1] + deltaY;

        t3[0] = t3[0] + deltaX;
        t3[1] = t3[1] + deltaY;

        t4[0] = t4[0] + deltaX;
        t4[1] = t4[1] + deltaY;

        // now, update final position and convert to canvas
        updateEdges(obj, t1, t2, t3, t4);

        // update buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(t1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(t3));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(t2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 3), flatten(t4));

    })

    document.addEventListener("keypress", function (e) {
        if (e.key == 'Enter') {
            theta = 0;
            b.style.display = "none";

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            unhighlightObj(obj);

            isRotating = false;
            canvas.removeEventListener("wheel", (e) => console.log(`Fim da rotação`))
        }
    })
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BI | gl.DEPTH_BUFFER_BIT);

    switch (selectedDrawMode) {
        case drawMode.LINES:
            // Draw lines
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
            break

        case drawMode.TRIANGLES:
            // Draw Triangles
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
                gl.drawArrays(gl.TRIANGLES, 0, trianglesIndex);
            }
            break

        case drawMode.POLYGONS:
            // Draw polygons
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
            break

        default:
            // Draw points
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
            gl.drawArrays(gl.POINTS, 0, pointsIndex);
            break;
    }

    // Update framer to animate
    window.requestAnimationFrame(render);
}