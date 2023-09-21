#version 300 es

precision highp float;

layout(location = 0) out vec4 outColorID;
layout(location = 1) out vec4 outPosition;

in vec2 drawTexCoord;
in vec3 drawPosition;
in vec3 drawNormal;

void main() {
  const vec3 lightDirection = normalize(vec3(0.30, 0.47, 0.80));

  float coef = abs(dot(normalize(drawNormal), lightDirection));
  outColorID = vec4(coef, coef, coef, 1);
  outPosition = vec4(drawPosition, 1);
} /* main */

/* target.frag */