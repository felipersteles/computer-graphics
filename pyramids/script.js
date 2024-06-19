var canvas;
var gl;

var near = 0.3;
var far = 10.0;
var radius = 4.0;
var theta = 5;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var camera;
var aspect;

var program;
var program_originline;

var cBuffer;
var vColor;
var vBuffer;
var vPosition;

var l_vBuffer;
var l_vPosition;
var l_cBuffer;
var l_vColor;

window.onload = function init() {

    canvas = document.getElementById("canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect = canvas.width / canvas.height;

    gl.clearColor(0.5, 0.7, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program_originline = initShaders(gl, "vertex-shader", "fragment-shader");
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    //CUBE Buffers
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(scenarioColors), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(scenario), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");

    const changeCamTheta = document.getElementById("cam-theta")
    changeCamTheta.addEventListener("input", function (event) {
        camera.setTheta(event.target.value / 10);
    })

    render();
}

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    if (!camera) {
        camera = new Camera(aspect, radius, theta, phi, near, far);
    }

    modelViewMatrix = camera.getModelViewMatrix();
    projectionMatrix = camera.getProjectionMatrix();

    //PYRAMID PROGRAM
    gl.useProgram(program);
    gl.enableVertexAttribArray(vPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, scenario.length);

    // Set model-view and projection matrices for pyramid program
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // camera.spin(0.05)

    requestAnimFrame(render);
}