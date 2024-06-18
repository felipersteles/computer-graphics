
// first pyramid
const v11 = vec4(-0.5, -1, -0.5, 1.0)
const v12 = vec4(-0.5, -1, 0.5, 1.0)
const v13 = vec4(0.5, -1, -0.5, 1.0)
const v14 = vec4(0.5, -1, 0.5, 1.0)
const v15 = vec4(0, 0, 0, 1.0)
const pyramidColor = vec4(1, 0.9, 0, 1)

// second pyramid
const v21 = vec4(-0.8, -1, -0.8, 1.0)
const v22 = vec4(-1.3, -1, -0.8, 1.0)
const v23 = vec4(-1.3, -1, -1.3, 1.0)
const v24 = vec4(-0.8, -1, -1.3, 1.0)
const v25 = vec4(-1.05, -0.4, -1.05, 1.0)

// third pyramid
const v31 = vec4(0.8, -1, 0.8, 1.0)
const v32 = vec4(1.3, -1, 0.8, 1.0)
const v33 = vec4(1.3, -1, 1.3, 1.0)
const v34 = vec4(0.8, -1, 1.3, 1.0)
const v35 = vec4(1.05, -0.3, 1.05, 1.0)

// ground
const ground1 = vec4(100, -1, 100, 1.0);
const ground2 = vec4(100, -1, -100, 1.0);
const ground3 = vec4(-100, -1, 100, 1.0);
const ground4 = vec4(-100, -1, -100, 1.0);
const groundColor = vec4(1, 0.7, 0, 1.0);

const scenario = [
    // first pyramid
    // front face
    v13,
    v11,
    v15,
    // right face
    v12,
    v14,
    v15,
    // left face
    v11,
    v12,
    v15,
    // back face
    v14,
    v13,
    v15,
    // base
    v11,
    v12,
    v13,
    v12,
    v13,
    v14,

    // second pyramid
    // front face
    v21,
    v22,
    v25,
    // right face
    v23,
    v24,
    v25,
    // left face
    v22,
    v23,
    v25,
    // back face
    v24,
    v21,
    v25,
    // base
    v22,
    v23,
    v24,
    v23,
    v22,
    v24,

    // third pyramid
    // front face
    v31,
    v32,
    v35,
    // right face
    v33,
    v34,
    v35,
    // left face
    v32,
    v33,
    v35,
    // back face
    v34,
    v31,
    v35,
    // base
    v32,
    v33,
    v34,
    v34,
    v32,
    v33,

    // ground
    ground1,
    ground2,
    ground3,
    ground3,
    ground2,
    ground4,
];

const scenarioColors = [
    pyramidColor,  
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor,

    pyramidColor,  
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor,

    pyramidColor,  
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor, 
    pyramidColor,

    // ground color
    groundColor, 
    groundColor, 
    groundColor, 
    groundColor, 
    groundColor, 
    groundColor, 
];