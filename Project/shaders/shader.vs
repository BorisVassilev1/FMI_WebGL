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

uniform sampler2D uHeightTexture;
uniform float uDisplacementStrength;
uniform float uDisplacementScale;

in vec3 aXYZ;
in vec3 aColor;
in vec3 aNormal;
in vec3 aST;

out vec3 vColor;
out vec3 vNormal;
out vec3 vLightDir;
out vec3 vProjectedTexCoords;
out vec3 vViewDir;
out vec2 vTexCoord;

const float phi = 0.05;
void main ()
{
	mat4 mvMatrix = uViewMatrix * uModelMatrix;

	// гледаме съседни пиксели за да сметнем нормали после
    float height00 = texture(uHeightTexture, aST.xy).x * uDisplacementStrength;
    float height01 = texture(uHeightTexture, aST.xy + vec2(0, phi)).x * uDisplacementStrength;
    float height10 = texture(uHeightTexture, aST.xy + vec2(phi, 0)).x * uDisplacementStrength;

	vec3 t1 = vec3(0  ,phi, height01 - height00);
	vec3 t2 = vec3(phi,  0, height10 - height00);

	vec4 worldPos = uModelMatrix * vec4(aXYZ,1);
    worldPos.z += height00 * uDisplacementScale; // отместване

	gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;

	// смятаме проекция върху "светлинната камера" и превръщаме в координати за текстура
	vec4 projectedTexCoords = uShadowMatrix * worldPos;
	vProjectedTexCoords = projectedTexCoords.xyz / projectedTexCoords.w;
	vProjectedTexCoords.xyz = 0.5 * vProjectedTexCoords.xyz + 0.5;
	
	vec4 cameraPos = uViewMatrix[3];
	vViewDir = (worldPos - cameraPos).xyz; // посока на гледана за лъскавост

	vLightDir = normalize((uViewMatrix * vec4(uLightDir, 0)).xyz);
	// избираме си нормали
	if(uDisplacementStrength == 0.0) {
		vNormal = vec3(normalize(nMatrix*vec4(aNormal,0)));
	} else {
		vNormal = normalize(cross(t2, t1));
		vNormal = vec3(normalize(nMatrix*vec4(vNormal,0)));
	}
	vColor = aColor * uDiffuseColor;
	vTexCoord = (uTexMatrix * aST).xy;
}