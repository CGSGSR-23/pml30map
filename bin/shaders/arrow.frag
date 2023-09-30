#version 300 es

precision highp float;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outPositionID;

in vec2 drawTexCoord;
in vec3 drawPosition;

uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

void main() {
  outColor = vec4(drawTexCoord.xy, 0, 1);
  outPositionID = vec4(drawPosition, currentID);
} /* main */

/* target.frag */