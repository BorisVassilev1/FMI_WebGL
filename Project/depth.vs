#version 300 es
precision highp float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

in vec3 aXYZ;

void main ()
{
	mat4 mvMatrix = uViewMatrix * uModelMatrix;
	vec4 pos = uProjectionMatrix * mvMatrix * vec4(aXYZ,1);
	gl_Position = pos;
}