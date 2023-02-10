attribute vec3 aXYZ;
varying vec2 vTexCoord;

uniform vec2 uPosition;
uniform vec2 uScale;

void main() {
	vTexCoord = aXYZ.xy / 2. + 0.5;
	gl_Position = vec4((aXYZ.xy * uScale + uPosition), 0.1, 1.0);
}