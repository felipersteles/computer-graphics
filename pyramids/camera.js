class Camera {
    at = vec3(0.0, 0.0, 0.0);
    up = vec3(0.0, 1.0, 0.0);
    fovY = 90.0;  // Field-of-view in Y direction angle (in degrees)

    constructor(aspect,radius, theta, phi, near, far) {
        this.aspect = aspect;
        this.theta = theta;
        this.near = near;
        this.far = far;
        this.radius = radius;
        this.phi = phi;
    }

    setTheta(theta){
        this.theta = theta;
        if (this.theta > 2 * Math.PI) {
            this.theta -= 2 * Math.PI; // Reset theta to keep it within 0 to 2*PI range
        }
    }

    getModelViewMatrix(){
        this.eye = vec3(
            this.radius * Math.sin(this.theta) * Math.cos(this.phi),
            this.radius * Math.sin(this.theta) * Math.sin(this.phi),
            this.radius * Math.cos(this.theta)
        );

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
