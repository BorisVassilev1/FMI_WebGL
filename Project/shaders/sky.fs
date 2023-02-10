#version 300 es
precision highp float;
uniform samplerCube tex;

in vec3 vTexCoord;
out vec4 fragColor;

void main() {
    fragColor = texture(tex, vTexCoord);
}