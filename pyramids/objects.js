
const groundHeight = -1;

// create the buildings
const getBuildings = (numBuildings = 5) => {

    let buildings = [], normals = [];
    const size = 0.5
    const buildingColor = vec4(0.4, 0.4, 0.4, 1.0);

    for (let i = 0; i < numBuildings; i++) {
        for (let j = 0; j < numBuildings; j += 1) {
            // base
            const A1 = vec4(-2.3 - i + j, groundHeight, 2 + i + j, 1.0);
            const B1 = vec4(A1[0] - size, groundHeight, A1[2] + size, 1.0);
            const C1 = vec4(A1[0], groundHeight, B1[2], 1.0);
            const D1 = vec4(B1[0], groundHeight, A1[2], 1.0);

            const height = getRandomNumber(0.5, 1.5);

            // higher ground
            const A2 = vec4(A1[0], height, A1[2], 1.0);
            const B2 = vec4(B1[0], height, B1[2], 1.0);
            const C2 = vec4(C1[0], height, C1[2], 1.0);
            const D2 = vec4(D1[0], height, D1[2], 1.0);

            // add the triangles to buildings array
            buildings.push(
                // base
                A1, B1, C1,
                B1, A1, D1,

                // front face
                B1, C1, B2,
                B2, C2, C1,

                // back face
                A1, D1, A2,
                D2, A2, D1,

                // left face
                A1, C1, C2,
                A2, C2, A1,

                // right face
                B1, D1, B2,
                B2, D2, D1,

                // top face
                A2, B2, C2,
                A2, B2, D2,
            )

            normals.push(
                // base
                vec3(0, -1, 0),
                vec3(0, -1, 0),
                vec3(0, -1, 0),
                vec3(0, -1, 0),
                vec3(0, -1, 0),
                vec3(0, -1, 0),

                // front face
                vec3(1, 0, 0),
                vec3(1, 0, 0),
                vec3(1, 0, 0),
                vec3(1, 0, 0),
                vec3(1, 0, 0),
                vec3(1, 0, 0),

                // back face
                vec3(-1, 0, 0),
                vec3(-1, 0, 0),
                vec3(-1, 0, 0),
                vec3(-1, 0, 0),
                vec3(-1, 0, 0),
                vec3(-1, 0, 0),

                // left face
                vec3(0, 0, -1),
                vec3(0, 0, -1),
                vec3(0, 0, -1),
                vec3(0, 0, -1),
                vec3(0, 0, -1),
                vec3(0, 0, -1),

                // right face
                vec3(0, 0, 1),
                vec3(0, 0, 1),
                vec3(0, 0, 1),
                vec3(0, 0, 1),
                vec3(0, 0, 1),
                vec3(0, 0, 1),

                // top face
                vec3(0, 1, 0),
                vec3(0, 1, 0),
                vec3(0, 1, 0),
                vec3(0, 1, 0),
                vec3(0, 1, 0),
                vec3(0, 1, 0),
            )
        }
    }

    return {
        vertices: buildings,
        normals,
        colors: buildings.map(() => buildingColor)
    };
}

// get a random value between max and min
const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min
}

const getPyramids = () => {

    const pyramidColor = vec4(1, 0.9, 0, 1)

    // first pyramid
    const v11 = vec4(0.5, -1, 0.5, 1.0)
    const v12 = vec4(0.5, -1, -0.5, 1.0)
    const v13 = vec4(-0.5, -1, 0.5, 1.0)
    const v14 = vec4(-0.5, -1, -0.5, 1.0)
    const v15 = vec4(0, 0, 0, 1.0)

    // second pyramid
    const v21 = vec4(-0.8, -1, -0.8, 1.0)
    const v22 = vec4(-0.8, -1, -1.3, 1.0)
    const v23 = vec4(-1.3, -1, -0.8, 1.0)
    const v24 = vec4(-1.3, -1, -1.3, 1.0)
    const v25 = vec4(-1.05, -0.4, -1.05, 1.0)

    // third pyramid
    const v31 = vec4(1.3, -1, 1.3, 1.0)
    const v32 = vec4(1.3, -1, 0.8, 1.0)
    const v33 = vec4(0.8, -1, 1.3, 1.0)
    const v34 = vec4(0.8, -1, 0.8, 1.0)
    const v35 = vec4(1.05, -0.3, 1.05, 1.0)

    const firstPyramid = [
        // first pyramid
        // front face
        v11,
        v12,
        v15,
        // back face
        v14,
        v13,
        v15,
        // left face
        v12,
        v14,
        v15,
        // right face
        v11,
        v13,
        v15,
        // base
        v11,
        v12,
        v13,
        v12,
        v13,
        v14,
    ]

    const secondPyramid = [
        // second pyramid
        // front face
        v21,
        v22,
        v25,
        // back face
        v24,
        v23,
        v25,
        // left face
        v22,
        v24,
        v25,
        // right face
        v21,
        v23,
        v25,
        // base
        v21,
        v22,
        v23,
        v24,
        v22,
        v23,
    ]

    const thirdPyramid = [
        // second pyramid
        // front face
        v31,
        v32,
        v35,
        // back face
        v34,
        v33,
        v35,
        // left face
        v32,
        v34,
        v35,
        // right face
        v31,
        v33,
        v35,
        // base
        v31,
        v32,
        v33,
        v34,
        v32,
        v33,
    ]

    const pyramidNormals = [
        // first pyramid
        // front face
        vec3(1, 1, 0),
        vec3(1, 1, 0),
        vec3(1, 1, 0),
        //back face
        vec3(-1, 1, 0),
        vec3(-1, 1, 0),
        vec3(-1, 1, 0),
        // left face
        vec3(0, 1, -1),
        vec3(0, 1, -1),
        vec3(0, 1, -1),
        // right face
        vec3(0, 1, 1),
        vec3(0, 1, 1),
        vec3(0, 1, 1),
        // base
        vec3(0, -1, 0),
        vec3(0, -1, 0),
        vec3(0, -1, 0),
        vec3(0, -1, 0),
        vec3(0, -1, 0),
        vec3(0, -1, 0),
    ]

    return {
        first: {
            vertices: firstPyramid,
            normals: pyramidNormals,
            colors: firstPyramid.map(() => pyramidColor)
        },
        second: {
            vertices: secondPyramid,
            normals: pyramidNormals,
            colors: secondPyramid.map(() => pyramidColor)
        },
        third: {
            vertices: thirdPyramid,
            normals: pyramidNormals,
            colors: secondPyramid.map(() => pyramidColor)
        },
    }
}

// ground
const getGround = () => {
    const ground1 = vec4(100, -1, 100, 1.0);
    const ground2 = vec4(100, -1, -100, 1.0);
    const ground3 = vec4(-100, -1, 100, 1.0);
    const ground4 = vec4(-100, -1, -100, 1.0);

    const groundColor = vec4(1, 0.7, 0, 1.0);

    const vertices = [
        ground1,
        ground2,
        ground3,
        ground2,
        ground3,
        ground4,
    ]

    const normals = vertices.map(() => vec3(0, 1, 0));
    const colors = vertices.map(() => groundColor);

    return {
        vertices,
        normals,
        colors
    }
}

//sun
const getSun = () => {

    const sun = getSphere().vertices;
    const sunColor = sun.map(() => vec4(1, 1, 0.3, 1));
    const sunNormals = getSphere().normals;

    return {
        vertices: sun,
        colors: sunColor,
        normals: sunNormals
    }
}