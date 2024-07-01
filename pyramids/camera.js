class Camera {
    z = 0;
    up = vec3(0.0, 1.0, 0.0);

    constructor(aspect, radius, theta, phi, near, far, at = vec3(-3, 0.0, 2), fovY = 90.0) {
        this.aspect = aspect;
        this.theta = theta;
        this.near = near;
        this.far = far;
        this.radius = radius;
        this.phi = phi;
        this.fovY = fovY
        this.at = at;
        this.eye = vec3(
            this.radius * Math.sin(this.theta) * Math.cos(this.phi),
            this.radius * Math.sin(this.theta) * Math.sin(this.phi),
            this.radius * Math.cos(this.theta)
        );
    }

    moveForward(delta) {
        const forward = normalize(subtractVectors(this.at, this.eye));
        this.eye = addVectors(this.eye, scaleVector(forward, delta));
        this.at = addVectors(this.at, scaleVector(forward, delta));
    }

    moveBackward(delta) {
        this.moveForward(-delta);
    }

    moveRight(delta) {
        this.moveLeft(-delta);
    }

    moveLeft(delta) {
        const right = normalize(cross(this.up, subtractVectors(this.at, this.eye)));
        this.eye = addVectors(this.eye, scaleVector(right, delta));
        this.at = addVectors(this.at, scaleVector(right, delta));
    }

    moveUp(delta) {
        const up = this.up;
        this.eye = addVectors(this.eye, scaleVector(up, delta));
        this.at = addVectors(this.at, scaleVector(up, delta));
    }

    moveDown(delta) {
        this.moveUp(-delta);
    }

    lookUp(deltaAngle) {
        const angle = deltaAngle * (Math.PI / 180);

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const rotationMatrix = mat3(
            vec3(1, 0, 0), 
            vec3(0, cos, -sin), 
            vec3(0, sin, cos) 
        );

        // Get the current eye direction vector
        const eyeDirection = subtractVectors(this.at, this.eye);

        // Apply rotation to the eye direction
        const newEyeDirection = multiplyMatrixVector(rotationMatrix, eyeDirection);

        // Update the at vector based on the transformed eye direction and eye position
        this.at = addVectors(this.eye, newEyeDirection);
    }

    lookDown(deltaAngle) {
        this.lookUp(-deltaAngle)
    }

    lookRight(deltaAngle) {
        const angle = deltaAngle * (Math.PI / 180);

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const rotationMatrix = mat3(
            vec3(cos, 0, -sin),
            vec3(0, 1, 0),
            vec3(sin, 0, cos)
        )

        // Get the current eye direction vector
        const eyeDirection = subtractVectors(this.at, this.eye);

        // // Apply rotation to the eye direction
        const newEyeDirection = multiplyMatrixVector(rotationMatrix, eyeDirection);

        // // Update the at vector based on the transformed eye direction and eye position
        this.at = addVectors(this.eye, newEyeDirection);
    }

    lookLeft(deltaAngle) {
        this.lookRight(-deltaAngle);
    }

    setFOV(value) {
        this.fovY = value;
    }

    getModelViewMatrix() {
        return lookAt(this.eye, this.at, this.up);
    }

    getProjectionMatrix() {
        return perspective(this.fovY, this.aspect, this.near, this.far);
    }

    spin(speed = 0.01) {
        // console.log("spin")
        // Update theta for next frame (replace with time-based update)
        this.theta += speed; // Adjust for desired rotation speed
        if (this.theta > 2 * Math.PI) {
            this.theta -= 2 * Math.PI; // Reset theta to keep it within 0 to 2*PI range
        }
    }
}
