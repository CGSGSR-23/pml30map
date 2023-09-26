#version 300 es

precision highp float;

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outPositionID;

in vec3 drawDirection;

uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

uniform sampler2D Tex1;

#define PI 3.14159265358979

void main() {
  vec3 direction = normalize(drawDirection);

  float
    azimuth = acos(direction.y),
    elevation = sign(direction.z) * acos(direction.x / length(direction.xz));
  vec2 fetchCoord = vec2(
    elevation / (PI * 2.0) + 0.5,
    azimuth / PI
  );

  outColor = vec4(texture(Tex1, fetchCoord).xyz, currentID);
  outPositionID = vec4(0, 0, 0, currentID);
} /* main */