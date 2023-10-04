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

uniform sampler2D Tex1;

void main() {
  float texValue = texture(Tex1, drawTexCoord.yx * vec2(1, -1)).x;

  if (texValue <= 0.4)
    discard;

  float color = sign(drawPosition.y);
  outColor = vec4(color, color, color, 1);
  outPositionID = vec4(drawPosition, currentID);
} /* main */

/* target.frag */