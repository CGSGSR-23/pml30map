#version 300 es

precision highp float;

layout(location = 0) out vec4 outColorID;
layout(location = 1) out vec4 outPosition;

in vec3 drawPosition;
in vec2 drawTexCoord;


uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

uniform sampler2D Tex1;

void main() {
/*
  outColorID = vec4(0, 0, 1, currentID);
  outPosition = vec4(drawPosition, 1);

  return;
*/
  vec3 color = texture(Tex1, drawTexCoord).xyz;

  if (color.r + color.g + color.b <= 2.0)
    discard;

  outColorID = vec4(color, currentID);
  outPosition = vec4(drawPosition, 1);
} /* main */