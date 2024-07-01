
// get objects
const ground = getGround();
const pyramids = getPyramids();
const buildings = getBuildings();
const oasis = getOasis();
const sun = getSun();

// oasis

// const treeA1 = vec4(2.3, groundHeight, -2, 1.0);
// const treeB1 = vec4(2.8, groundHeight, -1.8, 1.0);
// const treeC1 = vec4(2.8, groundHeight, -2, 1.0);
// const treeD1 = vec4(2.3, groundHeight, -1.8, 1.0);

// const treeHeight = 0;
// const treeA2 = vec4(treeA1[0], treeHeight, treeA1[2], 1.0);
// const treeB2 = vec4(treeB1[0], treeHeight, treeB1[2], 1.0);
// const treeC2 = vec4(treeC1[0], treeHeight, treeC1[2], 1.0);
// const treeD2 = vec4(treeD1[0], treeHeight, treeD1[2], 1.0);

// const leafEnd = vec4((treeA2[0] + treeC2[0]) / 2, treeHeight - 0.1, -1.5, 1.0);
// const leaf = [treeA2, treeC2, leafEnd]


// const tree = [
//     treeA1, treeB1, treeC1,
//     treeA1, treeB1, treeD1,
//     treeA2, treeB2, treeC2,
//     treeA2, treeB2, treeD2,
//     treeA1, treeA2, treeD2,
//     treeA1, treeD1, treeD2,
//     treeD1, treeD2, treeB2,
//     treeD1, treeB1, treeB2,
//     treeC1, treeC2, treeB2,
//     treeC1, treeB2, treeB2,
//     treeA1, treeA2, treeC2,
//     treeA1, treeC1, treeC2,
// ]

// const oasisColor = [
//     ...water.map(() => vec4(0, 0, 1, 1)),
//     ...tree.map(() => vec4(0.65, 0.30, 0, 1.0)),
//     ...leaf.map(() => vec4(0, 1, 0, 1))
// ]


// scenario arrays
const scenario = [
    ...ground.vertices,
    ...pyramids.first.vertices,
    ...pyramids.second.vertices,
    ...pyramids.third.vertices,
    ...buildings.vertices,
    ...sun.vertices,
    ...oasis.vertices
];

const scenarioColors = [
    ...ground.colors,
    ...pyramids.first.colors,
    ...pyramids.second.colors,
    ...pyramids.third.colors,
    ...buildings.colors,
    ...sun.colors,
    ...oasis.colors
];

const normals = [
    ...ground.normals,
    ...pyramids.first.normals,
    ...pyramids.second.normals,
    ...pyramids.third.normals,
    ...buildings.normals,
    ...sun.normals,
    ...oasis.normals
]
