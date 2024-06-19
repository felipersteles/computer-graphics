
const groundHeight = -1;

// create the buildings
const getBuildings = (numBuildings = 5) => {
    let buildings = []
    const size = 0.5


    for (let i = 0; i < numBuildings; i++) {
        for (let j = 0; j < numBuildings; j += 1) {
            // first face
            const A = vec4(-2.3 - i + j, groundHeight, 2 + i + j, 1.0);
            const B = vec4(A[0] + size, groundHeight, A[2] + size, 1.0);
            const C = vec4(A[0], groundHeight, B[2], 1.0);
            const D = vec4(B[0], groundHeight, A[2], 1.0);

            const height = getRandomNumber(0.5, 1.5);

            // last face
            const A1 = vec4(A[0], height, A[2], 1.0);
            const B1 = vec4(B[0], height, B[2], 1.0);
            const C1 = vec4(C[0], height, C[2], 1.0);
            const D1 = vec4(D[0], height, D[2], 1.0);

            // add the triangles to buildings array
            buildings.push(
                A, B, C,
                A, B, D,
                A1, B1, C1,
                A1, B1, D1,
                A, C, C1,
                A, C1, A1,
                B, C, C1,
                B, C1, B1,
                D, B, B1,
                D, D1, B1,
                A, A1, D1,
                A, D, D1
            )
        }
    }

    return buildings;
}

// get a random value between max and min
const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min
}