uniform sampler2D uTexture;
varying mediump vec2 vTexCoord;
	
void main( )
{
	gl_FragColor = vec4(vec3(texture2D(uTexture, vTexCoord).x * 1.), 1.0);
}