
var canvas;
var gl;

var t1 = vec4(0.0, 0.0, 0.0, 1.0); // fator de translação
var T_loc1;
var program1;

var t2 = vec4(0.0, 0.0, 0.0, 1.0); // fator de translação
var T_loc2;
var program2;


// Three Vertices

var vertices1 = [
    vec2(-0.5, -1),
    vec2(0, -0.5),
    vec2(0.5, -1)
];

var vertices2 = [
    vec2(-0.5, 1),
    vec2(0, 0.5),
    vec2(0.5, 1)
];

var colors = [
    vec3(1, 0, 0),
    vec3(0, 1, 0),
    vec3(0, 0, 1)
];

var colors2= [
    vec3(1, 0, 1),
    vec3(0, 1, 0),
    vec3(0, 0, 1)
];

var t_step = 0.02; // velocidade

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //  Load shaders and initialize attribute buffers
    program1 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program1);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices1), gl.STATIC_DRAW);
    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program1, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Repeat the above process for vertices color attributes
    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program1, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    T_loc1 = gl.getUniformLocation(program1, "T"); // envia valor T_loc para o vertex shader com o valor T

    // --------------
    // program 2
    // --------------

    //  Load shaders and initialize attribute buffers
    program2 = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program2);

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);
    // Associate our shader variables with our data buffer
    vPosition = gl.getAttribLocation(program2, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Repeat the above process for vertices color attributes
    cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW);
    vColor = gl.getAttribLocation(program2, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    T_loc2 = gl.getUniformLocation(program2, "T"); // envia valor T_loc para o vertex shader com o valor T

    render();

}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (t1[0] > 0.5 || t1[0] < -0.5) {
        t_step *= -1 // desloca até um limie na coordenada x e depois volta
    }
    t1[0] += t_step
    t2[1] += t_step

    gl.useProgram(program1);
    gl.uniformMatrix4fv(T_loc1, false, flatten(translate(t1[0], t1[1], t1[2])));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.useProgram(program2);
    gl.uniformMatrix4fv(T_loc2, false, flatten(translate(t2[0], t2[1], t2[2])));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // str = JSON.stringify(t);
    // console.log(t); // Logs output to dev tools console.
    requestAnimFrame(render);
}