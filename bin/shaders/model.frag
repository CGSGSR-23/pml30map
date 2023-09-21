#version 300 es

precision highp float;

layout(location = 0) out vec4 outColorID;
layout(location = 1) out vec4 outPosition;

in vec2 drawTexCoord;
in vec3 drawPosition;

void main() {
  outColorID = vec4(1, 1, 1, 1);
  outPosition = vec4(drawPosition.xyz, 1);
} /* main */

/* target.frag */