#version 300 es

precision highp float;

layout(location = 0) out vec4 outColorID;
layout(location = 1) out vec4 outPosition;

in vec2 drawTexCoord;
in vec3 drawPosition;
in vec3 drawNormal;

uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

void main() {
  float coef = length(drawPosition);
  outColorID = vec4(coef, coef, coef, currentID);
  outPosition = vec4(drawPosition, 1);
} /* main */

/* target.frag */