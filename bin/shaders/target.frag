#version 300 es

precision mediump float;

layout(location = 0) out vec4 outColor;

in vec2 drawTexCoord;

// ColorID
uniform sampler2D Tex1;
uniform sampler2D Tex2;
uniform sampler2D Tex3;

void main() {
  outColor = texture(Tex1, drawTexCoord);
  return;

  outColor = vec4(0.0, 0.0, 0.0, 0.0);

  outColor += texture(Tex1, drawTexCoord);
  outColor += texture(Tex3, drawTexCoord);
  outColor += vec4(drawTexCoord.xy, 0.0, 1.0);

  outColor /= 3.0;

} /* main */

/* target.frag */