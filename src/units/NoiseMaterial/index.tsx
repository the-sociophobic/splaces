import { useRef } from 'react'
import { ShaderMaterial, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { debounce } from 'lodash'

import { fragmentShader, vertexShader } from './shaders'


const NoiseMaterial = () => {
  const noiseK = useRef(0)
  const shaderRef = useRef<ShaderMaterial>(null)
  const { camera } = useThree()
  const prevCamPos = useRef(new Vector3())

  useFrame(() => {
    // if (shaderRef.current) {
    //   const posDelta = camera.position.clone().add(prevCamPos.current.clone().negate()).length()
    //   noiseK.current = Math.min(Math.max(noiseK.current, posDelta * 3), 2.5)
    //   shaderRef.current.uniforms.noiseK.value = noiseK.current
    //   prevCamPos.current.copy(camera.position)
    // }

    // if (noiseK.current > 0) {
    //   noiseK.current *= 0.95
    // }

    if (shaderRef.current)
      if (shaderRef.current.uniforms.noiseK.value > 0) {
        shaderRef.current.uniforms.noiseK.value *= 0.975
      }
  })

  const handleDeviceMotion = debounce((event: DeviceMotionEvent) => {
    const acc = event.acceleration

    if (!shaderRef.current || !acc)
      return

    const speed = ((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2) / 30
    // console.log(speed)
    if (speed > shaderRef.current.uniforms.noiseK.value)
      shaderRef.current.uniforms.noiseK.value = speed
  }, 10)

  window.addEventListener('devicemotion', handleDeviceMotion)


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
