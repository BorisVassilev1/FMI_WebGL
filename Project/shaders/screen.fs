uniform sampler2D uTexture;
uniform mediump vec3 uTint;
varying mediump vec2 vTexCoord;

void main( )
{
	mediump vec4 col = texture2D(uTexture, vTexCoord);
	gl_FragColor = vec4(col.xyz * uTint, col.w);
}