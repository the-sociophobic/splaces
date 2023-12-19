const vertexShader = `
  attribute vec3 color;
  uniform float noiseK;
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
    gl_PointSize = 5.0;

    // get a turbulent 3d noise using the normal, normal to high freq
    noise = 10.0 *  -.10 * turbulence( .5 * normal );
    // get a 3d noise using the position, low frequency
    float b = pnoise( 0.05 * position, vec3( 100.0 ) );
    // compose both noises
    float displacement = - noiseK * (noise + b);
    vec3 newPosition = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);
  }
`

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor, 1.);
  }
`


export {
  fragmentShader,
  vertexShader
}