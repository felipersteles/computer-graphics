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
var camX = 0, camY = 0, camZ = 0;
var aspect;
var lights;
var lastValueX = 50, lastValueY = 50, lastValueZ = 50;
var lastRValueX = 50, lastRValueY = 50;

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
        const { value } = event.target;

        if (value > lastRValueX)
            camera.lookUp(value / 10);
        else
            camera.lookDown(value / 10);

        lastRValueX = value;
    })

    const changeCamPhi = document.getElementById("cam-phi")
    changeCamPhi.addEventListener("input", function (event) {
        const { value } = event.target;

        if (value > lastRValueY)
            camera.lookRight(value / 10);
        else
            camera.lookLeft(value / 10);

            lastRValueY = value;
    })

    const changeCamX = document.getElementById("cam-x")
    changeCamX.addEventListener("input", function (event) {
        const { value } = event.target;

        if (value > lastValueX)
            camera.moveForward(value / 100);
        else
            camera.moveBackward(value / 100);

        lastValueX = value;
    })

    const changeCamY = document.getElementById("cam-y")
    changeCamY.addEventListener("input", function (event) {
        const { value } = event.target;

        if (value > lastValueY)
            camera.moveUp(value / 100);
        else
            camera.moveDown(value / 100);

        lastValueY = value;
    })

    const changeCamZ = document.getElementById("cam-z")
    changeCamZ.addEventListener("input", function (event) {
        const { value } = event.target;

        if (value > lastValueZ)
            camera.moveRight(value / 100);
        else
            camera.moveLeft(value / 100);

        lastValueZ = value;
    })

    const changeCamFOV = document.getElementById("cam-fov")
    changeCamFOV.addEventListener("change", function (event) {
        const { value } = event.target;

        camera.setFOV(value);
    })

    const controlAmbientLightPower = document.getElementById("aLight")
    controlAmbientLightPower.addEventListener("click", function (event) {
        const value = event.target.checked;
        lights.lightPower(value, lightType.AMBIENT)
    })

    const controlDiffuseLightPower = document.getElementById("dLight")
    controlDiffuseLightPower.addEventListener("click", function (event) {
        const value = event.target.checked;
        lights.lightPower(value, lightType.DIFFUSE)
    })

    const controlSpecularLightPower = document.getElementById("sLight")
    controlSpecularLightPower.addEventListener("click", function (event) {
        const value = event.target.checked;
        lights.lightPower(value, lightType.SPECULAR)
    })

    const controlAmbientLight = document.getElementById("aLightCoefficient")
    controlAmbientLight.addEventListener("change", (event)=>{
        const { value } = event.target;
        lights.lightIntensity(value / 100, lightType.AMBIENT)
    })

    const controlDiffuseLight = document.getElementById("aLightCoefficient")
    controlDiffuseLight.addEventListener("change", (event)=>{
        const { value } = event.target;
        lights.lightIntensity(value / 100, lightType.DIFFUSE)
    })

    const controlSpecularLight = document.getElementById("aLightCoefficient")
    controlSpecularLight.addEventListener("change", (event)=>{
        const { value } = event.target;
        lights.lightIntensity(value / 100, lightType.SPECULAR)
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
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.enableVertexAttribArray(vNormal);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, scenario.length);

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

    gl.uniform1i(ambientLight, lights.aLight); // Enable ambient light
    gl.uniform1i(diffuseLight, lights.dLight); // Enable diffuse light
    gl.uniform1i(specularLight, lights.sLight); // Enable specular light

    gl.uniform1f(kaLoc, lights.ambientLightCoefficient);
    gl.uniform1f(kdLoc, lights.diffuseLightCoefficient);
    gl.uniform1f(ksLoc, lights.specularLightCoefficient);

    // camera.spin(0.01);

    requestAnimFrame(render);
}