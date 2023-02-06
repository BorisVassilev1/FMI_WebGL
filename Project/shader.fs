#version 300 es
precision highp float;

in vec3 vColor;
in vec3 vNormal;
in vec3 vLightDir;
in vec4 vProjectedTexCoords;
uniform vec3 uLightDir;
uniform sampler2D uShadowTexture;

out vec4 fragColor;

const float phi = 0.002;
const float eps = 0.005;

void main( )
{
	vec3 normal = normalize(vNormal);
	vec3 color = vColor * max(dot(normal, vLightDir), 0.0);
	
	vec3 projectedTexCoords = vProjectedTexCoords.xyz / vProjectedTexCoords.w;
	projectedTexCoords.xyz = 0.5 * projectedTexCoords.xyz + 0.5;


	float inRange = float(
		projectedTexCoords.x >= 0.0 &&
		projectedTexCoords.x <= 1.0 &&
		projectedTexCoords.y >= 0.0 &&
		projectedTexCoords.y <= 1.0);


	// float projectedDepth = texture(uShadowTexture, projectedTexCoords.xy).x;

	float currentDepth = projectedTexCoords.z - eps;
	float shadowFactor = (
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(   0,    0)).x)+
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(+phi, +phi)).x)+
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(-phi, +phi)).x)+
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(+phi, -phi)).x)+
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(-phi, -phi)).x)+

		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(-phi,    0)).x)+
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(+phi,    0)).x)+
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(   0, -phi)).x)+
		step(currentDepth, texture(uShadowTexture, projectedTexCoords.xy + vec2(   0, +phi)).x)
	) / 9.;

	shadowFactor = shadowFactor * 0.7 + 0.3;
	shadowFactor += 1. - inRange;
	shadowFactor = min(shadowFactor, 1.);
	
	fragColor = vec4(color * shadowFactor, 1.);
}