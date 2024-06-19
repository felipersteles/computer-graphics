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

// buildings
const buildings = getBuildings();
const buildingColors = buildings.map(() => vec4(0.3, 0.3, 0.3, 1.0));

// oasis
const waterHeight = groundHeight + 0.05;
const waterA = vec4(1.5, waterHeight, -1.3, 1.0);
const waterB = vec4(2.1, waterHeight, -1.9, 1.0);
const waterC = vec4(2.1, waterHeight, -1.3, 1.0);
const waterD = vec4(1.5, waterHeight, -1.9, 1.0);

const treeA1 = vec4(2.3, groundHeight, -2, 1.0);
const treeB1 = vec4(2.8, groundHeight, -1.8, 1.0);
const treeC1 = vec4(2.8, groundHeight, -2, 1.0);
const treeD1 = vec4(2.3, groundHeight, -1.8, 1.0);

const treeHeight = 0;
const treeA2 = vec4(treeA1[0], treeHeight, treeA1[2], 1.0);
const treeB2 = vec4(treeB1[0], treeHeight, treeB1[2], 1.0);
const treeC2 = vec4(treeC1[0], treeHeight, treeC1[2], 1.0);
const treeD2 = vec4(treeD1[0], treeHeight, treeD1[2], 1.0);

const leafEnd = vec4((treeA2[0] + treeC2[0]) / 2, treeHeight - 0.1, -1.5, 1.0);
const leaf = [treeA2, treeC2, leafEnd]

const water = [
    waterA, waterB, waterC,
    waterA, waterB, waterD
]
const tree = [
    treeA1, treeB1, treeC1,
    treeA1, treeB1, treeD1,
    treeA2, treeB2, treeC2,
    treeA2, treeB2, treeD2,
    treeA1, treeA2, treeD2,
    treeA1, treeD1, treeD2,
    treeD1, treeD2, treeB2,
    treeD1, treeB1, treeB2,
    treeC1, treeC2, treeB2,
    treeC1, treeB2, treeB2,
    treeA1, treeA2, treeC2,
    treeA1, treeC1, treeC2,
]
const oasis = [
    ...water,
    ...tree,
    ...leaf
]
const oasisColor = [
    ...water.map(() => vec4(0, 0, 1, 1)),
    ...tree.map(() => vec4(0.65, 0.30, 0, 1.0)),
    ...leaf.map(() => vec4(0, 1, 0, 1))
]

// sun
const sun = getSphere().vertices;
const sunColor = sun.map(() => vec4(1, 1, 1, 1));

// diamond
const diamond = getDiamond([0, -1, -3], 0.8).vertices;
const diamondColor = diamond.map(() => vec4(0.3, 0, 1, 1));

// scenario arrays
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

    ...buildings,
    ...oasis,
    ...sun,
    ...diamond
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

    ...buildingColors,
    ...oasisColor,
    ...sunColor,
    ...diamondColor
];
