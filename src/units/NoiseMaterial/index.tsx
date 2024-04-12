import { useEffect, useRef, useState } from 'react'
import { ShaderMaterial, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { debounce } from 'lodash'

import { fragmentShader, vertexShader } from './shaders'
import useStore from '../../hooks/useStore'
import { isDesktop } from 'react-device-detect'


const NoiseMaterial = () => {
  const { permissionGranted } = useStore(state => state)
  const noiseK = useRef(0)
  const shaderRef = useRef<ShaderMaterial>(null)
  const { camera } = useThree()
  const prevCamPos = useRef(new Vector3())

  useFrame(() => {
    if (permissionGranted) {
      if (shaderRef.current)
        if (shaderRef.current.uniforms.noiseK.value > 0) {
          shaderRef.current.uniforms.noiseK.value *= 0.975
        }
    } else {
      if (shaderRef.current) {
        const posDelta = camera.position.clone().add(prevCamPos.current.clone().negate()).length()
        noiseK.current = Math.min(Math.max(noiseK.current, posDelta * 3), 2.5)
        shaderRef.current.uniforms.noiseK.value = noiseK.current
        prevCamPos.current.copy(camera.position)
      }

      if (noiseK.current > 0) {
        noiseK.current *= 0.95
      }
    }
  })

  useEffect(() => {
    const handleDeviceMotion = debounce((event: DeviceMotionEvent) => {
      const acc = event.acceleration

      if (!shaderRef.current || !acc)
        return

      const speed = ((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2) / 30

      if (speed > shaderRef.current.uniforms.noiseK.value)
        shaderRef.current.uniforms.noiseK.value = speed
    }, 10)

    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => window.removeEventListener('devicemotion', handleDeviceMotion)
  }, [permissionGranted])



  const { raycaster, pointer } = useThree()

  useEffect(() => {
    const handleTouchMove = debounce((event: TouchEvent) => {
      if (!shaderRef.current)
        return

      raycaster.setFromCamera(pointer, camera)
      shaderRef.current.uniforms.rayStart.value = raycaster.ray.origin
      shaderRef.current.uniforms.rayEnd.value = raycaster.ray.direction
      shaderRef.current.uniforms.touchK.value = 1
      // shaderRef.current.uniformsNeedUpdate = true
    })

    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useFrame(() => {
    if (!shaderRef.current || isDesktop)
      return

    if (shaderRef.current.uniforms.touchK.value > 0) {
      shaderRef.current.uniforms.touchK.value *= 0.975
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
        },
        touchK: {
          value: 0
        },
        rayStart: {
          value: [0, 0, 0]
        },
        rayEnd: {
          value: [0, 20, 0]
        },
      }}
    />
  )
}


export default NoiseMaterial
