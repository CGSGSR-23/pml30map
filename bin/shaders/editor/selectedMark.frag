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

/// !!!ACHTUNG CONE NORMALS!!!
void main() {
  const vec3 lightDirection = normalize(vec3(0.30, 0.47, 0.80));
  const vec3 color = vec3(0.8, 0.20, 0.20);
  float diffuseCoef = clamp(dot(normalize(drawNormal), lightDirection), 0.3, 1.0);

  outColor = vec4(color * diffuseCoef, 1.0);
  outPositionID = vec4(drawPosition, currentID);
} /* main */

/* target.frag */