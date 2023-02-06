#version 300 es
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;
uniform mat4 uShadowMatrix;
uniform mat3 uTexMatrix;
uniform bool uUseNormalMatrix;

uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;

uniform vec3 uLightDir;

in vec3 aXYZ;
in vec3 aColor;
in vec3 aNormal;

out vec3 vColor;
out vec3 vNormal;
out vec3 vLightDir;
out vec4 vProjectedTexCoords;

void main ()
{
	mat4 mvMatrix = uViewMatrix * uModelMatrix;
	vec4 worldPos =  uModelMatrix * vec4(aXYZ,1);
	gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;
	vProjectedTexCoords = uShadowMatrix * worldPos;

	vLightDir = normalize((uViewMatrix * vec4(uLightDir, 0)).xyz);
	vNormal = vec3(normalize(nMatrix*vec4(aNormal,0)));
	vColor = aColor * uDiffuseColor;
}