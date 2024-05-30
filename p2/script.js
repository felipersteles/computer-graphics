// ----------------------------------------------------------------
// Copyright (c) Teles and Celso 2024
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated
// documentation files (the "Software ")
//
// |-----------------------------------|
// | UNIVERSIDADE FEDERAL DO MARANHÃO  |
// |-----------------------------------|
//
// Segunda avaliação de Computação Gráfica
//      disciplina ministrada pelo prof. dr. Darlan
//
// ----------------------------------------------------------------
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

var selectedTriangle = -1, selectedSquare = -1;
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
    selectedDrawMode = drawMode.POLYGONS;
    var show = document.getElementById("object");
    show.innerText = `polygons`;
};

const setTriangles = () => {
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

    const showMode = document.getElementById("mode");
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
        unHighlightTriangle();
        unHighlightSquare();
        selectedAction = actions.DRAW;
        isSelected = false;
        selectedObj = -1;
        console.log(`Selected action: draw`);
        showMode.innerText = `Drawing: `
    };

    clearButton.onclick = () => clear();

    moveButton.onclick = () => {
        if (
            selectedDrawMode != drawMode.POLYGONS &&
            selectedDrawMode != drawMode.TRIANGLES
        ) {
            alert('You must select a polygon or triangle.');
            return;
        }

        console.log('Selected action: move');

        unHighlightTriangle();
        unHighlightSquare();

        selectedAction = actions.MOVE;
        showMode.innerText = `Moving: `
        canvas.removeEventListener('mousedown', startTriangleRotation);
        canvas.removeEventListener('mousemove', rotateTriangleOnMouse);
        canvas.removeEventListener('mousedown', startPolygonRotation);
        canvas.removeEventListener('mousemove', rotatePolygonOnMouse);
    };

    rotateButton.onclick = () => {
        if (
            selectedDrawMode != drawMode.POLYGONS &&
            selectedDrawMode != drawMode.TRIANGLES
        ) {
            alert('You must select a polygon or triangle.');
            return;
        }

        console.log('Selected action: rotation');

        unHighlightTriangle();
        unHighlightSquare();

        selectedAction = actions.ROTATE;
        showMode.innerText = `Rotating: `
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

    // verify clicked position to get a triangle 
    selectedTriangle = getTriangle(pos);

    // active event listeners to the selected triangle
    if (selectedTriangle < 0) return;

    canvas.addEventListener('mousemove', moveTriangleOnMouse);
    document.addEventListener('keypress', stopMoveTriangle);
}

// arrow function for events
const moveTriangleOnMouse = (e) => {

    if (selectedTriangle < 0) return;

    // get position of mouse cursor
    const newPos = convertXY(e.clientX, e.clientY);
    const newX = newPos[0];
    const newY = newPos[1];

    // move triangle
    moveTriangleObj(newX, newY);
}

// stop triangle move by clicking enter
const stopMoveTriangle = (e) => {

    // if not enter continue
    if (e.key !== 'Enter') return;

    unHighlightTriangle()

    // remove event listeners
    canvas.removeEventListener('mousemove', moveTriangleOnMouse);
    document.removeEventListener('keypress', stopMoveTriangle);
    canvas.addEventListener("click", clickOnCanvas);
}

// move the triangle object
function moveTriangleObj(x, y) {

    // do not enter in the function if does not have
    // a selected triangle
    if (selectedTriangle < 0) return;

    // get the index reference on the triangle array (start and end)
    selIndexStart = 3 * selectedTriangle;
    selIndexEnd = 3 + selIndexStart;

    // 
    //         /\    /\
    //        /__\  /__\ 
    //        v[0]  v[1]
    //
    //          L> edges = [ [ [A1, B1], [A1, C1], [B1, C1] ] <- selected object = 0,[ [A2, B2], [A2, C2], [B2, C2] ] ]
    //              [A1, B1] <- triangles[selected object][0][1]
    //              [A1, C1] <- triangles[selected object][1]
    //              [B1, C1] <- triangles[selected object][2]
    //
    // get the triangle vertices
    vt1 = triangles[selectedTriangle][0][0];
    vt2 = triangles[selectedTriangle][2][0];
    vt3 = triangles[selectedTriangle][1][1];

    // initial position of the center of the triangle
    const oldX = (vt1[0] + vt2[0] + vt3[0]) / 3;
    const oldY = (vt1[1] + vt2[1] + vt3[1]) / 3;

    // new position of the center of the triangle
    // x and y -> passed by mouse click
    const newX = x, newY = y;

    // translocation factor of the center
    const deltaX = newX - oldX;
    const deltaY = newY - oldY;

    // calculating the new vertices
    // v1
    vt1[0] = vt1[0] + deltaX;
    vt1[1] = vt1[1] + deltaY;

    // v2
    vt2[0] = vt2[0] + deltaX;
    vt2[1] = vt2[1] + deltaY;

    //v3
    vt3[0] = vt3[0] + deltaX;
    vt3[1] = vt3[1] + deltaY;

    // update the triangle edges array
    updateTriangleEdges(selectedTriangle, vt1, vt2, vt3);

    // set triangle buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

    // draw triangle new position
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(vt1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(vt2));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(vt3));
}

// ----------------------------------------------------------------
//          Move Squares
//  ---------------------------------------------------------------

function moveSquare(pos) {

    // verify clicked position to ger a square
    selectedObj = getSquare(pos);

    // active event listeners to the selected square
    if (selectedObj >= 0) {
        canvas.addEventListener('mousemove', moveSquareOnMouse);
        document.addEventListener('keypress', stopMoveSquare);
    }
}

// arrow function for events
const moveSquareOnMouse = (e) => {
    // get position of mouse cursor
    const newPos = convertXY(e.clientX, e.clientY);
    const newX = newPos[0];
    const newY = newPos[1];

    // move square
    moveSquareObj(selectedObj, newX, newY);
}

// stop square move by clicking enter
const stopMoveSquare = (e) => {
    // if not enter continue
    if (e.key !== 'Enter') return;

    // get reference index of selected square
    const selIndexStart = 4 * selectedObj;
    const selIndexEnd = 4 + selIndexStart;

    // set square color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);

    // Get index of color of selected square
    const polygonColor = polygonsColors[selectedObj];

    // paint the square with the original color
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 4), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 3), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 2), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndexEnd - 1), flatten(polygonColor));

    // unselect object
    selectedObj = -1;
    isSelected = false;

    // remove event listeners
    canvas.removeEventListener('mousemove', moveSquareOnMouse);
    document.removeEventListener('keypress', stopMoveSquare);
    canvas.addEventListener("click", clickOnCanvas);
}

// move the square object
function moveSquareObj(selObj, x, y) {

    // do not enter in the function of does not have
    // a selected square
    if (!isSelected) return;

    // get the index reference on the square array (start and end)
    selIndexStart = 4 * selObj;
    selIndexEnd = 4 + selIndexStart;

    // get the square vertices
    v1 = polygons[selObj][0][0];
    v2 = polygons[selObj][2][0];
    v3 = polygons[selObj][0][1];
    v4 = polygons[selObj][1][1];

    // initial position of the center of the square
    const oldX = (v1[0] + v2[0]) / 2;
    const oldY = (v1[1] + v2[1]) / 2;

    // new position of the center of the square
    // x and y  -> passed by mouse click
    const newX = x, newY = y;

    // translocation factor of the center
    const deltaX = newX - oldX;
    const deltaY = newY - oldY;

    // calculating the new vertices
    //v1
    v1[0] = v1[0] + deltaX;
    v1[1] = v1[1] + deltaY;

    //v2
    v2[0] = v2[0] + deltaX;
    v2[1] = v2[1] + deltaY;

    //v3
    v3[0] = v3[0] + deltaX;
    v3[1] = v3[1] + deltaY;

    //v4
    v4[0] = v4[0] + deltaX;
    v4[1] = v4[1] + deltaY;

    // update the square edges array
    updateSquareEdges(selObj, v1, v2, v3, v4);

    // set square buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonBuffer);

    // draw square new position
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(v1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(v3));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(v2));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 3), flatten(v4));
}

// ----------------------------------------------------------------
//          Rotate objects
// ----------------------------------------------------------------
function rotate(pos) {
    switch (selectedDrawMode) {
        case drawMode.POLYGONS:
            rotateSquare(pos);
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
    selectedTriangle = getTriangle(pos);

    if (selectedTriangle < 0) return;
    canvas.addEventListener('mousedown', startTriangleRotation);
}

const startTriangleRotation = () => {
    canvas.addEventListener('mousemove', rotateTriangleOnMouse);
    canvas.addEventListener('mouseup', stopTriangleRotation);
}

const rotateTriangleOnMouse = (e) => {

    if (selectedTriangle < 0) return;

    const mouseY = e.movementY;
    const senseInput = getSense?.value;
    const sense = senseInput ? senseInput : 15;

    var theta = 0;
    if (mouseY > 0) {
        theta += sense;
    } else if (mouseY < 0) {
        theta -= sense;
    }

    displayAngle.innerText = theta < 0 ? "Sentido horário" : "Sentido anti-horário";
    const angle = theta * (Math.PI / 180);

    rotateTriangleObj(angle);
}

const stopTriangleRotation = () => {

    canvas.removeEventListener('mouseup', stopTriangleRotation);
    if (selectedTriangle < 0) return;

    unHighlightTriangle()

    isRotating = false;

    // remove events of rotation
    canvas.removeEventListener('mousedown', startTriangleRotation);
    canvas.removeEventListener('mousemove', rotateTriangleOnMouse);
}

function rotateTriangleObj(angle) {

    // condition to rotate
    if (selectedTriangle < 0) return;

    // get the value of rotation by cos and sin
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    // get triangle informations
    var selIndexStart = 3 * selectedTriangle;
    var newX = 0, newY = 0;
    var oldX = 0, oldY = 0;
    var deltaX = 0, deltaY = 0;

    // get triangle vertices
    vt1 = triangles[selectedTriangle][0][0];
    vt2 = triangles[selectedTriangle][0][1];
    vt3 = triangles[selectedTriangle][1][1];

    // get triangle center
    oldX = (vt1[0] + vt2[0] + vt3[0]) / 3;
    oldY = (vt1[1] + vt2[1] + vt3[1]) / 3;

    // moving triangle to center
    deltaX = newX - oldX;
    deltaY = newY - oldY;

    // creating references of vertices
    var refV1 = [0, 0];
    refV1[0] = vt1[0] + deltaX;
    refV1[1] = vt1[1] + deltaY;

    var refV2 = [0, 0];
    refV2[0] = vt2[0] + deltaX;
    refV2[1] = vt2[1] + deltaY;

    var refV3 = [0, 0];
    refV3[0] = vt3[0] + deltaX;
    refV3[1] = vt3[1] + deltaY;

    // calculate the rotation matrix
    var rotation = mat2(
        vec2(cos, sin),
        vec2(-sin, cos)
    );

    // rotate vertices
    refV1 = (mult(mat2(refV1[0], refV1[1]), rotation))[0];
    refV2 = (mult(mat2(refV2[0], refV2[1]), rotation))[0];
    refV3 = (mult(mat2(refV3[0], refV3[1]), rotation))[0];

    // get back triangle to original position
    newX = oldX, newY = oldY;
    oldX = 0, oldY = 0;

    // moving triangle to original position
    deltaX = newX - oldX;
    deltaY = newY - oldY;

    // moving the first vertice
    vt1[0] = refV1[0] + deltaX;
    vt1[1] = refV1[1] + deltaY;

    // moving the second vertice
    vt2[0] = refV2[0] + deltaX;
    vt2[1] = refV2[1] + deltaY;

    // moving the last vertices 
    vt3[0] = refV3[0] + deltaX;
    vt3[1] = refV3[1] + deltaY;

    // update triangles array
    updateTriangleEdges(selectedTriangle, vt1, vt2, vt3);

    // draw triangle on
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * selIndexStart, flatten(vt1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 1), flatten(vt2));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (selIndexStart + 2), flatten(vt3));

    // Copyright: Made by Felipe Teles
}

// ----------------------------------------------------------------
//          Rotate square
// ----------------------------------------------------------------
function rotateSquare(pos) {
    selectedSquare = getSquare(pos);

    if (selectedSquare < 0) return;
    canvas.addEventListener('mousedown', startPolygonRotation);
}

const startPolygonRotation = () => {
    canvas.addEventListener('mousemove', rotatePolygonOnMouse);
    canvas.addEventListener('mouseup', stopPolygonRotation);
}

const rotatePolygonOnMouse = (e) => {

    if (selectedSquare < 0) return;

    const mouseY = e.movementY;
    const senseInput = getSense?.value;
    const sense = senseInput ? senseInput : 15;

    var theta = 0;
    if (mouseY > 0) {
        theta += sense;
    } else if (mouseY < 0) {
        theta -= sense;
    }

    displayAngle.innerText = theta < 0 ? "Sentido horário" : "Sentido anti-horário";
    const angle = theta * (Math.PI / 180);

    rotatePolygonObj(angle);
}

const stopPolygonRotation = () => {

    unHighlightSquare()

    canvas.removeEventListener('mousedown', startPolygonRotation);
    canvas.removeEventListener('mousemove', rotatePolygonOnMouse);
    canvas.removeEventListener('mouseup', stopPolygonRotation);
}

function rotatePolygonObj(angle) {
    if (selectedSquare < 0) return;


    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var selIndexStart = 4 * selectedSquare;

    var v1 = polygons[selectedSquare][0][0];
    var v2 = polygons[selectedSquare][2][0];
    var v3 = polygons[selectedSquare][0][1];
    var v4 = polygons[selectedSquare][1][1];

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

    updateSquareEdges(selectedSquare, v1, v2, v3, v4);

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

// ----------------------------------------------------------------
//           Triangle Utils
// ----------------------------------------------------------------


// Returns the clicked triangle
function getTriangle(pos) {
    var pickedIndex; // Index of triangle picked
    for (let i = triangles.length - 1; i >= 0; i--) {

        // check if the clicked position is on triangle
        const pickReturn = pickTriangle(i, pos[0], pos[1]);

        if (pickReturn) {
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

// Highlight the triangle 
function highlightTriangle(triangle) {

    selectedTriangle = triangle;

    var selColorIndex;

    selIndex = 3 + 3 * selectedTriangle;
    selColorIndex = colorArray[selectedTriangle];

    const color = vec4(highlightedColors[selColorIndex]);

    // set triangle color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(color));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(color));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(color));
}

// update the edges of triangle in array
function updateTriangleEdges(selObj, a, b, c) {
    triangles[selObj] = [
        [a, b],
        [a, c],
        [b, c]
    ];
}

// using the picked method learned on the graphic computer classe
// of prof. dr. Darlan url(???)
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

// Highlight the triangle 
function unHighlightTriangle() {
    if (selectedTriangle < 0) return;

    const selIndex = 3 + 3 * selectedTriangle;
    const triangleColor = trianglesColors[selectedTriangle];

    // set triangle color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(triangleColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(triangleColor));

    selectedTriangle = -1;
    isSelected = false;
}


// ----------------------------------------------------------------
//           Square Utils
// ----------------------------------------------------------------

// Returns the clicked square
function getSquare(pos) {

    // Index of square picked
    var pickedIndex;
    for (let i = polygons.length - 1; i >= 0; i--) {

        // check if the clicked position is on square
        const pickReturn = pickSquare(i, pos[0], pos[1]);

        if (pickReturn) {
            pickedIndex = i;
            highlightObj(i);
            console.log("Selected object index: " + pickedIndex);
            isSelected = true;
            return pickedIndex;
        }
    }

    isSelected = false;
    return -1;
}

function updateSquareEdges(selObj, a, b, c, d) {
    polygons[selObj] = [
        [a, c],
        [a, d],
        [b, c],
        [b, d]
    ];
}


// using the picked method learned on the graphic computer classe
// of prof. dr. Darlan url(???)
function pickSquare(currentId, x, y) {
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

    selIndex = 4 + 4 * selObj;
    selColorIndex = colorArray[selObj];

    const originalColor = vec4(highlightedColors[selColorIndex]);

    // set square buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 4), flatten(originalColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(originalColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(originalColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(originalColor));
}

function unHighlightSquare() {
    if (selectedSquare < 0) return;

    const selIndex = 4 + 4 * selectedSquare;
    const polygonColor = polygonsColors[selectedSquare];

    // set square buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonColorBuffer);

    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 4), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 3), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 2), flatten(polygonColor));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selIndex - 1), flatten(polygonColor));

    selectedSquare = -1;
    isSelected = false;
}

// ----------------------------------------------------------------
//          Clear all
// ----------------------------------------------------------------

function clearAll() {

    // wrong way :/
    // window.location.reload(true);

    gl.deleteProgram(pointProgram);
    pointProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");
    gl.deleteProgram(lineProgram);
    lineProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");
    gl.deleteProgram(triangleProgram);
    triangleProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");
    gl.deleteProgram(polygonProgram);
    polygonProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");

    unHighlightTriangle();
    unHighlightSquare();
    isSelected = false;
    selectedObj = -1;
    selectedAction = actions.CLEAR;
}
