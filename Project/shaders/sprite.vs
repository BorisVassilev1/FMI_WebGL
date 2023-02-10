#version 300 es
precision highp float;
uniform vec4 uPosition;
uniform float uMaxParticleLife;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;


in vec3 aXYZ;
in vec3 aParticlePosition;
in vec3 aParticleVelocity;
in vec3 aParticleColor;
in float aParticleLife;

out vec2 vTexCoord;
out float vParticleLife;
out vec3 vParticleColor;

void main() {
    // първи правим изгледа, после отместваме встрани
    gl_Position = uProjectionMatrix * (uViewMatrix * vec4(aParticlePosition, 1.) + vec4(aXYZ, 0) * 1.);
    vTexCoord = aXYZ.xy + vec2(0.5);
    // корен от живота ги кара да изчезват малко по-бързо
    vParticleLife = pow(min(aParticleLife / uMaxParticleLife, 1.), 0.5);
    vParticleColor = aParticleColor;
}