import { useRef } from 'react'
import { ShaderMaterial } from 'three'
import { useFrame } from '@react-three/fiber'

import { fragmentShader, vertexShader } from './shaders'


const NoiseMaterial = () => {
  const noiseK = useRef(0)
  const increase = useRef(1)
  const shaderRef = useRef<ShaderMaterial>(null)

  useFrame(() => {
    if (noiseK.current > 1.5)
      increase.current = -3

    if (noiseK.current < 0)
      increase.current = 1

    noiseK.current += increase.current * .01

    if (shaderRef.current) {
      shaderRef.current.uniforms.noiseK.value = noiseK.current
    }
  })

  return (
    <shaderMaterial
      ref={shaderRef}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
      uniforms={{
        noiseK: {
          value: 0
        }
      }}
    />
  )
}


export default NoiseMaterial