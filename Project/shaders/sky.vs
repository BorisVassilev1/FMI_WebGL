#version 300 es
precision highp float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

in vec3 aXYZ;

out vec3 vTexCoord;

void main() {
    // правим въртене защото z е нагоре
    vec3 direction = vec3(aXYZ.x, aXYZ.z, -aXYZ.y);
    // правим само въртенето от матрицата на изгледа
    vec4 position = uViewMatrix * vec4(direction, 0.0);
    // и проектираме нормално
    position.w = 1.0;
    position = uProjectionMatrix * position;
    gl_Position = vec4(position.xyww); // z = 1.
    vTexCoord = aXYZ.xyz;
}