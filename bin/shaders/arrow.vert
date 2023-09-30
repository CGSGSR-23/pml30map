#version 300 es

precision highp float;

in vec3 inPosition;
in vec2 inTexCoord;
in vec3 inNormal;

out vec2 drawTexCoord;
out vec3 drawPosition;

uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

void main() {
  gl_Position = transformViewProj * transformWorld * vec4(inPosition, 1);

  drawTexCoord = inTexCoord;
  drawPosition = (transformWorld * vec4(inPosition, 1)).xyz;
} /* main */

/* target.vert */