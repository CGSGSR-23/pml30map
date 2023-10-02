#version 300 es

precision mediump float;

layout(location = 0) out vec4 outColor;

in vec2 drawTexCoord;

// ColorID texture
uniform sampler2D Tex1;
uniform sampler2D Tex2;

void main() {
  vec3 color = texture(Tex1, drawTexCoord).xyz;

  outColor = vec4(color, 1.0);
} /* main */

/* target.frag */