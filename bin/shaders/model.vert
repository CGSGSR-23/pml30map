#version 300 es

precision highp float;

in vec3 inPosition;
in vec2 inTexCoord;

out vec2 drawTexCoord;
out vec3 drawPosition;

void main() {
  gl_Position = vec4(inPosition * 0.5, 1);

  drawTexCoord = inTexCoord;
  drawPosition = inPosition;
} /* main */

/* target.vert */