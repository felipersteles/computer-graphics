var gl;
var points;
var fColor
var fvColor
var thetaLoc;

var axis = 0;
var theta = [ 0, 0, 0 ];

// Three Vertices
var vertices = [
    vec3( 0.5, 0.5, 0 ), // 0
    vec3( 0, 1, 0 ), // 1
    vec3( -1, 0, 0 ), // 2
]; 

var colors = [
    vec3(  0,  0, 1), // b
    vec3( 0, 1, 0), // g
    vec3( 1, 0, 0), // r
];    


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

    // Load the data into the GPU        
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 ); // canvas dimensions
    gl.enableVertexAttribArray( vPosition );    

    // // varying color
    var cBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW ); 
    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );    

    // associando a variavel de thetaLoc com theta do html
    thetaLoc = gl.getUniformLocation( program, "theta");
    render();
};

function render() {
   gl.clear( gl.COLOR_BUFFER_BIT ); 

    theta[1] += .4;
    gl.uniform3fv(thetaLoc, theta);

   // inicia no indice 0 e vai até o indice 6
   // desenha a quantidade de pontos no formato do triangulo
   gl.drawArrays( gl.TRIANGLES, 0, vertices.length );
   requestAnimFrame( render);
   
}

