import { FC } from 'react'

import { vertShader, fragShader } from './shaders'


export type NoiseMaterialType = {}

const NoiseMaterial: FC<NoiseMaterialType> = () => {
  return (
    <shaderMaterial
      fragmentShader={fragShader}
      vertexShader={vertShader}
      uniforms={{
        noiseK: {
          value: 0
        },
        touchK: {
          value: 0
        },
        rayOrigin: {
          value: [0, 0, 0]
        },
        rayDirection: {
          value: [0, 20, 0]
        },
      }}
    />
  )
}


export default NoiseMaterial
