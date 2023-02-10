#version 300 es
precision highp float;
uniform sampler2D tex;
in vec2 vTexCoord;
in float vParticleLife;
in vec3 vParticleColor;

out vec4 fragColor;

void main() {
    vec4 color = texture(tex, vTexCoord);
    fragColor = vec4(color.xyz * vParticleColor * vParticleLife,color.w);
}