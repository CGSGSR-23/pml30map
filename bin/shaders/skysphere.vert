#version 300 es

precision highp float;

in vec3 inPosition;
in vec2 inTexCoord;
in vec3 inNormal;

out vec3 drawDirection;

uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

void main() {
  gl_Position = (transformViewProj * vec4(inPosition, 0)).xyww;
  drawDirection = inPosition;
} /* main */

/* target.vert */