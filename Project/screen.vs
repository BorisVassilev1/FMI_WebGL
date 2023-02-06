attribute vec3 aXYZ;
varying vec2 vTexCoord;

void main() {
	vTexCoord = aXYZ.xy / 2. + 0.5;
	gl_Position = vec4((aXYZ.xy * 0.3 + 0.7), 0., 1.0);
}