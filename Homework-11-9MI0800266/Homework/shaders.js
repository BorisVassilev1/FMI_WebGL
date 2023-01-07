var vShader =
	'attribute vec3 aXYZ;'+
	'attribute vec2 aRange;'+
	''+
	'uniform float uMinT;'+
	'uniform float uMaxT;'+
	'uniform float uMaxF;'+
	'uniform float uMinF;'+
	''+
	'float map(float value, float min1, float max1, float min2, float max2) {'+
	'	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);'+
	'}'+
	'void main ()'+
	'{'+
	'	float x = map(aXYZ.x, uMinT, uMaxT, -1., 1.);'+
	'	float y = map(aXYZ.y, uMinF, uMaxF, -1., 1.);'+
	'	gl_Position = vec4(x, y, 0,1);'+
	'}';
	
var fShader =
	'precision mediump float;'+
	'uniform vec3 uColor;'+
	''+
	'void main( )'+
	'{'+
	'	gl_FragColor = vec4(uColor, 1.0);'+
	'}';

var vScreenShader = 
	'attribute vec3 aXYZ;' +
	'varying vec2 vTexCoord;' +
	'' +
	'void main() {' +
	'	vTexCoord = aXYZ.xy / 2. + 0.5;' +
	'	gl_Position = vec4(aXYZ, 1.0);' +
	'}';

var fScreenShader =
	'uniform sampler2D uTexture;'+
	'varying mediump vec2 vTexCoord;'+
	''+
	'void main( )'+
	'{' +
	'	gl_FragColor = vec4(texture2D(uTexture, vTexCoord).xyz, 1.0);'+
	'}';

var fGradientShader = 
	'precision mediump float;'+
	'uniform float uMinGrad;'+
	'uniform float uMaxGrad;'+
	''+
	'varying vec2 vTexCoord;'+
	''+
	'void main() {'+
	'	float strength = 0.;'+
	// лошо е да има иф-ове ама...
	'	float min = uMinGrad * 0.5, max = uMaxGrad * 0.5;'+
	'	if(vTexCoord.x < min) strength = vTexCoord.x / min;'+
	'	if(vTexCoord.x > max) strength = (1.-vTexCoord.x) / (1.-max);'+
	'	strength *= 0.8;'+
	'	strength += step(abs(vTexCoord.x + 0.002 - min), 0.002);'+
	'	strength += step(abs(vTexCoord.x - 0.002- max), 0.002);'+
	'	gl_FragColor = vec4(0,0,1,strength);'+
	'}';


