
var canvas;
var gl;

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

const drawMode = {
    POINTS: 'points',
    LINES: 'lines',
    POLYGONS: 'polygons',
};
var selectedDrawMode = drawMode.POINTS


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
//            DRAW POLYGONS
// ----------------------------------------------------------------
var polygons = [];
var polygonsIndex = 0;
var first = true;
var v1,v2,v3,v4;



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

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // UX / UI elements
    var pointsButton = document.getElementById("point");
    var linesButton = document.getElementById("line");
    var polygonButton = document.getElementById("polygon");
    var colorMenu = document.getElementById("mymenu");

    colorMenu.addEventListener("click", function () {
        cIndex = colorMenu.selectedIndex;
    });
    pointsButton.onclick = () => selectedDrawMode = drawMode.POINTS;
    linesButton.onclick = () => selectedDrawMode = drawMode.LINES;
    polygonButton.onclick = () => selectedDrawMode = drawMode.POLYGONS;

    // click coordinates
    var x, y;

    canvas.addEventListener("mousedown", function (event) {

        x = event.clientX, y = event.clientY;
        const pos = convertXY(x, y);

        // console.log("x: " + x + ", y: " + y);

        switch (selectedDrawMode) {
            case drawMode.LINES:
                addLine(pos, vBuffer, cBuffer)
                break
            case drawMode.POLYGONS:
                addPolygon(pos, vBuffer, cBuffer)
                break
            default:
                addPoint(pos, vBuffer, cBuffer)
                break;
        }
    });

    render()
}

function addPoint(pos, vBuffer, cBuffer) {

    points.push(pos);

    var i = pointsIndex;
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pos));
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colors[cIndex]));
    pointsIndex++;
}

function addLine(pos, vBuffer, cBuffer) {

    lines.push(pos);

    var i = linesIndex;
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pos));
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(colors[cIndex]));
    linesIndex++;
}

function addPolygon(pos, vBuffer, cBuffer) {

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
    if (first) {
      first = false;
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
      v1 = pos;
    }
    else {
      first = true;
      v2 = pos;
      v3 = vec2(v1[0], v2[1]);
      v4 = vec2(v2[0], v1[1]);

        console.log('v1', v1, 'v2', v2, 'v3', v3 , 'v4', v4)

      const polygonColor = colors[cIndex];

      polygons.push([v1,v2,v3,v4])

      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * polygonsIndex, flatten(v1));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (polygonsIndex + 1), flatten(v3));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (polygonsIndex + 2), flatten(v2));
      gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (polygonsIndex + 3), flatten(v4));

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      polygonsIndex += 4;

      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 4), flatten(polygonColor));
      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 3), flatten(polygonColor));
      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 2), flatten(polygonColor));
      gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (polygonsIndex - 1), flatten(polygonColor));

    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    switch (selectedDrawMode) {
        case drawMode.LINES:
            // Draw lines
            gl.drawArrays(gl.LINES, 0, linesIndex);
            break
        case drawMode.POLYGONS:
            for (var i = 0; i < polygonsIndex; i += 4) gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
            break
        default:
            // Draw points
            gl.drawArrays(gl.POINTS, 0, pointsIndex);
            break;
    }



    // Draw polygons

    window.requestAnimationFrame(render);
}