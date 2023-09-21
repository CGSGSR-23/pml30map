#version 300 es

precision mediump float;

layout(location = 0) out vec4 outColor;

in vec2 drawTexCoord;

// ColorID texture
uniform sampler2D Tex1;

void main() {
  outColor = vec4(texture(Tex1, drawTexCoord).xyz, 1.0);
} /* main */

/* target.frag */