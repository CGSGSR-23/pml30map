#version 300 es

precision highp float;

in vec3 inPosition;
in vec2 inTexCoord;
in vec3 inNormal;

out vec2 drawTexCoord;
out vec3 drawPosition;
out vec3 drawNormal;

uniform cameraBuffer {
  mat4 transformViewProj;

  vec3 cameraLocation;
  float currentID;

  mat4 transformWorld;
};

void main() {
  vec3 position = inPosition;

  gl_Position = transformViewProj * transformWorld * vec4(position, 1);

  drawTexCoord = inTexCoord;
  drawPosition = (transformWorld * vec4(position, 1)).xyz;
  drawNormal = normalize(mat3(inverse(transpose(transformWorld))) * inNormal);
} /* main */

/* target.vert */