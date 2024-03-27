var gl;
var points;
var fColor
var fvColor

var editVertices = [
    vec2( 0, 1 ),
    vec2(  0.5,  0 ),
    vec2(  -0.5, 0 ),]
var colors = [
    vec3(  1,  1, 0),
    vec3( 0, 1, 1),
    vec3( 1, 0, 1),
]

window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );
    var canvasEdit = document.getElementById( "gl-canvas-edit" );

     gl = WebGLUtils.setupWebGL( canvas );    
     glEdit = WebGLUtils.setupWebGL( canvasEdit );    
     if ( !gl ) { alert( "WebGL isn't available" ); }  
     if ( !glEdit ) { alert( "WebGL to edit isn't available" ); }       
    // Three Vertices
    var vertices = [
            vec2( 0, 1 ),
            vec2(  0.5,  0 ),
            vec2(  -0.5, 0 ),
            vec2(  0, -1 ),
            vec2( 0.5, 0 ),
            vec2(  -0.5,  0 ),
            vec2( 0, -0.5 ),
            vec2(  0,  0.5 ),
            vec2(  1, 0 ),
            vec2( 0, -0.5 ),
            vec2(  0,  0.5 ),
            vec2(  -1, 0 ),
    ]; 

    var colors = [
        vec3(  0,  1, 1),
        vec3( 1, 0, 1),
        vec3( 1, 0, 1),
        vec3( 1, 0, 1),
        vec3(  0,  1, 1),
        vec3(  1,  0, 1),
        vec3( 1, 0, 1),
        vec3(  0,  1, 0),
        vec3(  1,  1, 0),
        vec3( 1, 0, 1),
        vec3(  1,  0, 0),
        vec3(  0,  0, 1),
    ];    


    //  Configure WebGL   
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1.0 );  

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );    

    // Load the data into the GPU        
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 ); // o dois equivale a dois canais
    gl.enableVertexAttribArray( vPosition );    

    // // varying color
    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW ); 
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
   gl.drawArrays( gl.TRIANGLES, 0, 12 );
   
}

