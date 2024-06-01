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

const canvasSize = 500;

var canvas, gl;
var pointProgram, lineProgram;
var pointBuffer, lineBuffer;
var pointColorBuffer, lineColorBuffer;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var colorArray = [];

var points = [], pointsIndex = 0;
var lines, linesIndex;

const white = vec4(1.0, 1.0, 1.0, 1.0);
const green = vec4(0.0, 1.0, 0.0, 1.0);

// ----------------------------------------------------------------|
//          Entities                                               |
// ----------------------------------------------------------------|


class Position {
    x; // number
    y; // number

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Star {
    name;
    position;
    canvasPosition;

    constructor(name, x, y) {
        this.name = name;
        this.position = new Position(x, y);

        this.canvasPosition = this.setNormalizedPosition(x, y)
    }

    getNormalizedPosition() {
        return this.canvasPosition;
    }

    setNormalizedPosition(x, y) {

        const normalizedX = x / (2 * canvasSize)
        const normalizedY = y / (2 * canvasSize)

        return new Position(normalizedX, normalizedY);
    }
}

class Constellation {
    name; // string
    stars = []; // stars
    edges = [];

    constructor(name) {
        this.name = name;
    };

    addStar(star) {
        this.stars.push(star)
    }

    addEdge(edge) {
        const begin = this.stars.filter((star) => star.name === edge[0])[0];
        if (!begin) alert("Please select a s valid star")

        const end = this.stars.filter((star) => star.name === edge[1])[0];
        if (!end) alert("Please select a s valid star")

        this.edges.push([begin, end]);
    }

    editStar(starName) {
        const starPosition = this.stars.filter((star, index) => {
            if (star.name === starName) return index;
        });

        this.stars[starPosition] = starName;
    }

    getStarPosition(query, isName = true) {

        const starPosition = this.stars.indexOf(query);
        if (!star) alert("Please provida a real star");

        const star = this.stars[starPosition];

        return star.position
    }

    getStarsPositionArray() {
        const starsPositions = this.stars.map(star => vec2(star.canvasPosition.x, star.canvasPosition.y));

        return starsPositions;
    }

    drawStars() {
        const starsPositions = this.getStarsPositionArray()

        starsPositions.map(pos => {

            points.push(pos);

            var i = pointsIndex;
            gl.useProgram(pointProgram)
            gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pos));
            gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i), flatten(white));

            pointsIndex++;
        })
    }

    hightlightStar(starName) {

        const star = this.stars.filter(star => star.name === starName)[0];
        const index = this.stars.indexOf(star);

        // console.log(`paint`, index);
        // clear last star selected

        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index), flatten(green));
    }
}

const leoConstellation = new Constellation('Leo');

leoConstellation.addStar(new Star('Denebola', 0, 0));
leoConstellation.addStar(new Star('Zosma', 500, 180));
leoConstellation.addStar(new Star('Chertan', -200, 300));

leoConstellation.addEdge(['Denebola', 'Zosma']);
leoConstellation.addEdge(['Denebola', 'Chertan']);
leoConstellation.addEdge(['Zosma', 'Chertan']);

// Main function
window.onload = main;

function main() {
    canvas = document.getElementById('canvas');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('WebGL isn\'t available');
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Separate Shaders
    // ----------------------------------------------------------------

    pointProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");
    lineProgram = initShaders(gl, "line-vertex-shader", "fragment-shader");

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
    //         Set values
    // ----------------------------------------------------------------

    leoConstellation.drawStars();

    const starName = document.getElementById('star-name');
    const highlightBtn = document.getElementById('highlight');

    highlightBtn.onclick = () => {
        if (!starName.value) return

        const name = starName.value;

        leoConstellation.hightlightStar(name);
    }

    // ----------------------------------------------------------------
    //         Draw
    // ----------------------------------------------------------------

    render();
};


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
    // if (lines.length > 0) {
    //     gl.useProgram(lineProgram);
    //     gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    //     var vPosition = gl.getAttribLocation(lineProgram, "vPosition");
    //     gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(vPosition);
    //     gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
    //     var vColor = gl.getAttribLocation(lineProgram, "vColor");
    //     gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    //     gl.enableVertexAttribArray(vColor);
    //     gl.drawArrays(gl.LINES, 0, linesIndex);
    // }

    window.requestAnimationFrame(render);
}