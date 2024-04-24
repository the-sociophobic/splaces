import { FC } from 'react'

import { vertShader, fragShader } from './shaders'


export type NoiseMaterialType = {
  noiseKmax: number
}

const NoiseMaterial: FC<NoiseMaterialType> = ({
  noiseKmax
}) => {
  return (
    <shaderMaterial
      fragmentShader={fragShader}
      vertexShader={vertShader}
      uniforms={{
        noiseK: {
          value: .1
        },
        noiseKmax: {
          value: noiseKmax
        },
        touchK: {
          value: .1
        },
        rayOrigin: {
          value: [0, 0, 0]
        },
        rayDirection: {
          value: [0, 1, 0]
        },
      }}
    />
  )
}


export default NoiseMaterial
