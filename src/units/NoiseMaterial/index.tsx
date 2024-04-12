import { useEffect, useRef, useState } from 'react'
import { ShaderMaterial, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { debounce } from 'lodash'

import vertexShader from './shader.vert?raw'
import fragmentShader from './shader.frag?raw'
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

      raycaster.setFromCamera(pointer.clone().multiplyScalar(-1), camera)
      shaderRef.current.uniforms.rayOrigin.value = raycaster.ray.origin
      shaderRef.current.uniforms.rayDirection.value = raycaster.ray.direction
      shaderRef.current.uniforms.touchK.value = 1
      shaderRef.current.uniformsNeedUpdate = true
    })

    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const touching = useRef(false)  
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      touching.current = true
    }

    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])
  useEffect(() => {
    const handleTouchEnd = (event: TouchEvent) => {
      touching.current = false
    }

    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  useFrame(() => {
    if (!shaderRef.current || isDesktop)
      return

    // if (shaderRef.current.uniforms.touchK.value > 0 && !touching.current) {
    if (shaderRef.current.uniforms.touchK.value > 0 && !touching.current) {
      shaderRef.current.uniforms.touchK.value *= 0.975
      shaderRef.current.uniformsNeedUpdate = true
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
