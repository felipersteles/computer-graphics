var gl;
var points;
var fColor
var fvColor

// Three Vertices
var vertices = [
    vec3( 0.5, 0.5, 0.5 ), // 0
    vec3( -0.5, 0.5, 0.5 ), // 1
    vec3( -0.5, -0.5, 0.5 ), // 2
    vec3( 0.5, -0.5, 0.5 ), // 3
    vec3( 0.5, 0.5, -0.5 ), // 4
    vec3( -0.5, 0.5, -0.5 ), // 5
    vec3( -0.5, -0.5, -0.5 ), // 6
    vec3( 0.5, -0.5, -0.5 ), // 7
]; 

var faces = [
    [0,1,2,3],
    [4,7,6,5],
    [0,4,5,1],
    [1,5,6,2],
    [2,6,7,3],
    [3,7,4,0]
]

var colors = [
    vec3(  0,  0, 1), // b
    vec3( 0, 1, 0), // g
    vec3( 1, 0, 0), // r
    vec3( 1, 0, 0), // ciano
    vec3( 0, 1, 0), // amarelo
    vec3( 0, 0, 1), // magenta
];    

var vs_vertices = [];
var vs_colors = [];

function createCube(){
    for(var i = 0; i<faces.length;i++){
        vs_vertices.push(vertices[faces[i][0]]);
        vs_vertices.push(vertices[faces[i][1]]);
        vs_vertices.push(vertices[faces[i][2]]);
        vs_vertices.push(vertices[faces[i][0]]);
        vs_vertices.push(vertices[faces[i][2]]);
        vs_vertices.push(vertices[faces[i][3]]);

        for(var j =0;j<6;j++){
            vs_colors.push(colors[i]);
        }
    }
}

window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );

     gl = WebGLUtils.setupWebGL( canvas );    
     if ( !gl ) { alert( "WebGL isn't available" ); }   

    //  Configure WebGL   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1, 1, 1, 1.0 );  

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );    

    // render cube
    createCube();

    // Load the data into the GPU        
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vs_vertices), gl.STATIC_DRAW ); 
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 ); // canvas dimensions
    gl.enableVertexAttribArray( vPosition );    

    // // varying color
    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vs_colors), gl.STATIC_DRAW ); 
    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );    

    render();
};

function render() {
   gl.clear( gl.COLOR_BUFFER_BIT ); 
   // inicia no indice 0 e vai até o indice 6
   // desenha a quantidade de pontos no formato do triangulo
   gl.drawArrays( gl.TRIANGLES, 0, vs_vertices.length );
   
}

