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

uniform baseConstructionBuffer {
  vec3 baseConstructionColor;
  float cutHeight;
};

void main() {
  if (drawPosition.y >= cutHeight)
    discard;

  const vec3 lightDir = normalize(vec3(0.30, 0.47, 0.80));

  const float checkerScale = 1.5;
  int checkerCoef = (int(floor(drawPosition.x / checkerScale)) ^ int(floor(drawPosition.y / checkerScale)) ^ int(floor(drawPosition.z / checkerScale))) & 1;
  float diffuseCoef = dot(drawNormal, lightDir) * (0.85 + 0.15 * float(checkerCoef));

  outColor = vec4(baseConstructionColor * vec3(abs(min(diffuseCoef, 1.0))), 1.0);
  outPositionID = vec4(drawPosition, currentID);
} /* main */

/* target.frag */