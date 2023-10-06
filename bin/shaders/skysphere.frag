#version 300 es

precision highp float;

#define PI 3.14159265358979

layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outPositionID;

in vec3 drawDirection;

uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

uniform translateBuffer {
  float isTranslate;
  float translateCoefficent;
};

uniform sampler2D Tex1;
uniform sampler2D Tex2;

void main() {
  vec3 direction = normalize(drawDirection);

  float
    azimuth = acos(direction.y),
    elevation = sign(direction.z) * acos(clamp(direction.x / length(direction.xz), -1.0, 1.0));
  vec2 fetchCoord = vec2(
    elevation / (PI * 2.0) - 0.25,
    azimuth / PI
  );

  if (isTranslate == 1.0) {
    vec3 tex1Value = texture(Tex1, fetchCoord).xyz;
    vec3 tex2Value = texture(Tex2, fetchCoord).xyz;

    outColor = vec4(mix(tex1Value, tex2Value, translateCoefficent), 1.0);
  } else {
    outColor = vec4(texture(Tex1, fetchCoord).xyz, 1.0);
  }

  outPositionID = vec4(0, 0, 0, currentID);
} /* main */