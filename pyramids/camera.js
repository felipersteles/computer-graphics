class Camera {
    up = vec3(0.0, 1.0, 0.0);

    constructor(aspect, radius, theta, phi, near, far, at = vec3(0.0, 0.0, 0.0), fovY = 90.0) {
        this.aspect = aspect;
        this.theta = theta;
        this.near = near;
        this.far = far;
        this.radius = radius;
        this.phi = phi;
        this.fovY = fovY
        this.at = at;
    }

    setTheta(theta) {
        this.theta = theta;

        if (this.theta > 2 * Math.PI) {
            this.theta -= 2 * Math.PI; // Reset theta to keep it within 0 to 2*PI range
        }
    }

    setPhi(phi) {
        this.phi = phi;

        // Clamp phi between 0 and Math.PI to prevent looking upside down
        this.phi = Math.max(0, Math.min(this.phi, Math.PI));
    }

    setLookAtX(x) {
        this.at[0] = x;
    }
    
    setLookAtY(y) {
        this.at[1] = y;
    }

    setLookAtZ(z) {
        this.at[2] = z;
    }

    getModelViewMatrix() {
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
