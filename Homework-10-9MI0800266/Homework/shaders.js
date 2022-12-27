var vShader =
	'uniform mat4 uProjectionMatrix;'+
	'uniform mat4 uViewMatrix;'+
	'uniform mat4 uModelMatrix;'+
	'uniform mat4 uNormalMatrix;'+
	'uniform bool uUseNormalMatrix;'+
	''+
	'uniform vec3 uAmbientColor;'+
	'uniform vec3 uDiffuseColor;'+
	''+
	'uniform vec3 uLightDir;'+
	''+
	'attribute vec3 aXYZ;'+
	'attribute vec2 aST;'+
	'attribute vec3 aColor;'+
	'attribute vec3 aNormal;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	''+
	'uniform sampler2D uDisplSampler;'+
	'uniform mediump mat3 uTexMatrix;'+
	''+
	'void main ()'+
	'{'+
	'	vST = vec3(aST,1);'+
	'	mat4 mvMatrix = uViewMatrix * uModelMatrix;'+
	'	float height = texture2D(uDisplSampler, (uTexMatrix*vST).st).x * 0.1;'+
	'	gl_Position = uProjectionMatrix * mvMatrix * vec4(aXYZ * (1. + height), 1);'+
	'	mat4 nMatrix = uUseNormalMatrix?uNormalMatrix:mvMatrix;'+
	''+
	'	vColor = uAmbientColor*aColor;'+
	''+
	'	vec3 light = normalize(-uLightDir);'+
	'	vec3 normal = vec3(normalize(nMatrix*vec4(aNormal,0)));'+
	'	vColor += aColor*uDiffuseColor*abs(dot(normal,light));'+
	'}';
	
var fShader =
	'precision mediump float;'+
	'uniform sampler2D uSampler;'+
	'uniform sampler2D uDisplSampler;'+
	'uniform mat3 uTexMatrix;'+
	''+
	'varying vec3 vST;'+
	'varying vec3 vColor;'+
	'void main()'+
	'{'+
	'	vec4 texCol = texture2D(uSampler,(uTexMatrix*vST).st);'+
	'	gl_FragColor = texCol*vec4(vColor,1.0);'+
	'}';
