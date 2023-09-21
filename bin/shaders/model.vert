#version 300 es

precision highp float;

in vec3 inPosition;
in vec2 inTexCoord;
in vec3 inNormal;

out vec2 drawTexCoord;
out vec3 drawPosition;
out vec3 drawNormal;

void main() {
  gl_Position = vec4(inPosition * 0.5, 1);

  drawTexCoord = inTexCoord;
  drawPosition = inPosition;
  drawNormal = inNormal;
} /* main */

/* target.vert */