#version 300 es
precision highp float;

in vec3 vColor;
in vec3 vNormal;
in vec3 vLightDir;
in vec3 vProjectedTexCoords;
in vec3 vViewDir;
in vec2 vTexCoord;

uniform vec3 uLightDir;
uniform sampler2D uTexture;
uniform sampler2D uShadowTexture;
uniform bool uUseTexture;

out vec4 fragColor;

const float phi = 0.001;
const float eps = 0.006;
const float specularStrength = 0.3;

void main( )
{
	vec3 texColor = texture(uTexture, vTexCoord).xyz;
	texColor = mix(texColor, vec3(1.), 1. - float(uUseTexture));

	// блин-фонг
	vec3 normal = normalize(vNormal);
	vec3 color = texColor * vColor * max(dot(normal, vLightDir), 0.0);

	vec3 viewDir = normalize(vViewDir);
	vec3 halfDir = normalize(vLightDir + viewDir);
	float specAngle = max(dot(halfDir, normal), 0.0);
    float specular = pow(specAngle, 16.) * specularStrength;

	// дали фрагментът е в рамките на текстурата за сенки
	float inRange = float(
		vProjectedTexCoords.x >= 0.0 &&
		vProjectedTexCoords.x <= 1.0 &&
		vProjectedTexCoords.y >= 0.0 &&
		vProjectedTexCoords.y <= 1.0);


	// плавни сенки
	float currentDepth = vProjectedTexCoords.z - eps;
	float shadowFactor = (
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(   0,    0)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(+phi, +phi)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(-phi, +phi)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(+phi, -phi)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(-phi, -phi)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(-phi,    0)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(+phi,    0)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(   0, -phi)).x)+
		step(currentDepth, texture(uShadowTexture, vProjectedTexCoords.xy + vec2(   0, +phi)).x)
	) / 9.;

	// сенките да не са напълно черни
	shadowFactor = shadowFactor * 0.7 + 0.3;
	// ако не сме в рамките, няма сянка
	shadowFactor += 1. - inRange;
	shadowFactor = min(shadowFactor, 1.);
	
	vec3 allColor = (color + vec3(specular)) * shadowFactor;

	fragColor = vec4(allColor, 1.);
}