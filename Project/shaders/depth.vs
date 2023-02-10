#version 300 es
precision highp float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

uniform sampler2D uHeightTexture;
uniform float uDisplacementStrength;
uniform float uDisplacementScale;

in vec3 aXYZ;
in vec3 aColor;
in vec3 aNormal;
in vec3 aST;

void main ()
{
	mat4 mvMatrix = uViewMatrix * uModelMatrix;

	vec4 pos = uModelMatrix * vec4(aXYZ,1); // world position
	// отместване нагоре
 	float height = texture(uHeightTexture, aST.xy).x * uDisplacementStrength * uDisplacementScale;
	pos.z += height;

	// view and projection
	pos = uProjectionMatrix * uViewMatrix * pos;
	gl_Position = pos;
}