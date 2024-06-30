class Lights {
    constructor() {
        this.ambientLight = vec4(0.7, 0.7, 0.7, 1);
        this.lightColor = vec4(1, 1, 1, 1);
        this.lightPosition = vec3(3, 2.5, 0);

        this.aLight = true;
        this.dLight = true;
        this.sLight = true;

        this.ambientLightCoefficient = 0.5;
        this.diffuseLightCoefficient = 0.7;
        this.specularLightCoefficient = 1.0;
    }

    lightPower(value, type) {
        switch(type){
            case lightType.AMBIENT:
                this.aLight = value;
                break;
            case lightType.DIFFUSE:
                this.dLight = value;
                break;
            default:
                this.sLight = value;
                break;
        }
    }

    lightIntensity(value, type) {
        switch(type){
            case lightType.AMBIENT:
                this.ambientLightCoefficient = value;
                break;
            case lightType.DIFFUSE:
                this.diffuseLightCoefficient = value;
                break;
            default:
                this.specularLightCoefficient = value;
                break;
        }
    }
}

const lightType = {
    AMBIENT: 0,
    DIFFUSE: 1,
    SPECULAR: 2
}