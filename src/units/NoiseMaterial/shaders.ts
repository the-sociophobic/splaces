const vertShader = `
attribute vec3 color;
uniform float noiseK;
uniform float noiseKmax;
uniform float touchK;
uniform vec3 rayOrigin;
uniform vec3 rayDirection;
varying vec3 vColor;
varying float noise;

float pnoise( vec3 pos1, vec3 pos2 ) {
  return fract(sin(dot(pos1, pos2)) * 4.37585453123);
}

float turbulence( vec3 p ) {
  float w = 100.0;
  float t = -.5;

  for (float f = 1.0 ; f <= 10.0 ; f++ ){
    float power = pow( 2.0, f );
    t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
  }

  return t;
}

void main(){
  vColor = color;
  gl_PointSize = 2.0;

  vec4 proj_pos = projectionMatrix * modelViewMatrix * vec4(position, 1.);

  // get a turbulent 3d noise using the normal, normal to high freq
  noise = 10.0 *  -.10 * turbulence( .5 * normal );
  // get a 3d noise using the position, low frequency
  float b = pnoise( 0.05 * position, vec3( 100.0 ) );

  // Add noise on touch
  vec3 ray = rayDirection;
  vec3 position2 = (modelMatrix * vec4(position, 1.0)).xyz - rayOrigin;
  float posCamPos = dot(position2, rayDirection);
  float KK = sqrt( dot(position2, position2) - posCamPos * posCamPos);
  float touchNearK = noiseKmax / (KK + 1.0)  / (KK + 1.0);

  // compose both noises
  float displacement = - (noiseK + touchNearK * touchK) * (noise + b);
  vec3 newPosition = position + normal * displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
}
`

const fragShader = `
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.);
}
`


export {
  vertShader,
  fragShader
}