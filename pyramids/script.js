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
var lightPosition, lightColor, ambientLightColor;
var lightPositionLoc, lightColorLoc, ambientLightColorLoc;
var ambientLight, diffuseLight, specularLight;
var kaLoc, kdLoc, ksLoc;

var camera;
var aspect;
var lights;

// Scenario program and its properties
var program;

// color buffer
var cBuffer;
var vColor;

// vertices buffer
var vBuffer;
var vPosition;

// normal buffer
var nBuffer;
var vNormal;

//ambient light and light sources
var ambientLight;
var lightSources = [];

// FIXME: esto deberia ser un array si vamos a soportar mas de una luz
var lightAttributes = {
    ka: 0.2,
    kd: 0.6,
    ks: 0.6
};

window.onload = function init() {

    canvas = document.getElementById("canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect = canvas.width / canvas.height;

    gl.clearColor(0.5, 0.7, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    //Scenario Buffers
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(scenarioColors), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(scenario), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");

    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    vNormal = gl.getAttribLocation(program, "vNormal");

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

    if (!lights) {
        lights = new Lights();
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

    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);        

    // Set model-view and projection matrices for pyramid program
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    lightPositionLoc = gl.getUniformLocation(program, "uLightPosition");
    lightColorLoc = gl.getUniformLocation(program, "uLightColor");
    ambientLightColorLoc = gl.getUniformLocation(program, "uAmbientLightColor");

    ambientLight = gl.getUniformLocation(program, "uAmbientLight");
    diffuseLight = gl.getUniformLocation(program, "uDiffuseLight");
    specularLight = gl.getUniformLocation(program, "uSpecularLight");

    kaLoc = gl.getUniformLocation(program, "uKa");
    kdLoc = gl.getUniformLocation(program, "uKd");
    ksLoc = gl.getUniformLocation(program, "uKs");

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.uniform3fv(lightPositionLoc, flatten(lights.lightPosition));
    gl.uniform4fv(lightColorLoc, flatten(lights.lightColor)); // White light

    // Set ambient light (optional)
    gl.uniform4fv(ambientLightColorLoc, flatten(lights.ambientLight)); // Dim white ambient light

    gl.uniform1i(ambientLight, true); // Enable ambient light
    gl.uniform1i(diffuseLight, true); // Enable diffuse light
    gl.uniform1i(specularLight, true); // Enable specular light

    gl.uniform1f(kaLoc, 0.2);
    gl.uniform1f(kdLoc, 0.7);
    gl.uniform1f(kdLoc, 1.0);

    camera.spin(0.01);

    requestAnimFrame(render);
}