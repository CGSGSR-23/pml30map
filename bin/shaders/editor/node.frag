#version 300 es

precision highp float;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outPositionID;

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
  const vec3 lightDir = normalize(vec3(0.30, 0.47, 0.80));

  outColor = vec4(vec3(0.30, 0.80, 0.47) * dot(normalize(drawNormal), lightDir), 1.0);
  outPositionID = vec4(drawPosition, currentID);
} /* main */

/* target.frag */