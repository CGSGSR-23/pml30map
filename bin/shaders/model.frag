#version 300 es

precision highp float;

layout(location = 0) out vec4 outColorID;
layout(location = 1) out vec4 outPosition;

in vec2 drawTexCoord;

void main() {
  outColorID = vec4(drawTexCoord, 0, 1);
} /* main */

/* target.frag */