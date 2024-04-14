import { useEffect, useRef } from 'react'
import { ShaderMaterial, Vector2, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { isDesktop } from 'react-device-detect'
import { debounce } from 'lodash'

import { vertShader, fragShader } from './shaders'
import useStore from '../../hooks/useStore'
import { ThreeRef, notifyThreeRef, useSubscribeThreeRef } from '../../utils/ThreeRef'


const cameraPos = new Vector3()
const prevCameraPos = new Vector3()


const NoiseMaterial = () => {
  const { permissionGranted } = useStore(state => state)
  const noiseK = useRef(0)
  const shaderRef = useRef<ShaderMaterial>(null)
  const { camera, pointer } = useThree()
  const prevCamPos = useRef(new Vector3())

  useEffect(() => {
    console.log('b')
  }, [pointer])

  useFrame(() => {
    console.log('a')
    if (permissionGranted) {
      if (shaderRef.current)
        if (shaderRef.current.uniforms.noiseK.value > 0) {
          shaderRef.current.uniforms.noiseK.value *= 0.975
          shaderRef.current.uniformsNeedUpdate = true
        }
    } else {
      if (shaderRef.current) {
        cameraPos.copy(camera.position)
        prevCameraPos.copy(prevCamPos.current)

        const posDelta = cameraPos.add(prevCameraPos.negate()).length()

        noiseK.current = Math.min(Math.max(noiseK.current, posDelta * 3), 2.5)
        shaderRef.current.uniforms.noiseK.value = noiseK.current
        shaderRef.current.uniformsNeedUpdate = true
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

      if (speed > shaderRef.current.uniforms.noiseK.value) {
        shaderRef.current.uniforms.noiseK.value = speed
        shaderRef.current.uniformsNeedUpdate = true
      }
    }, 10)

    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => {}//window.removeEventListener('devicemotion', handleDeviceMotion)
  }, [permissionGranted])



  const { raycaster } = useThree()
  const rayOrigin: ThreeRef<Vector3> = new ThreeRef<Vector3>(raycaster.ray.origin)
  const rayDirection: ThreeRef<Vector3> = new ThreeRef<Vector3>(raycaster.ray.direction)
  const touchK: ThreeRef<number> = new ThreeRef<number>(1)


  const updShaderUniforms = (pointer: Vector2) => {
    raycaster.setFromCamera(pointer.multiplyScalar(-1), camera)
    rayOrigin.current = raycaster.ray.origin
    notifyThreeRef(rayOrigin)
    rayDirection.current = raycaster.ray.direction
    notifyThreeRef(rayDirection)
    touchK.current = isDesktop ? .5 : 1
    notifyThreeRef(touchK)
  }

  const handleTouchMove = debounce((e: TouchEvent) => {
    if (!shaderRef.current)
      return

    const _pointer = new Vector2(
      e.touches[0].clientX / document.documentElement.clientWidth * 2 - 1,
      e.touches[0].clientY / document.documentElement.clientHeight * 2 - 1,
    )

    updShaderUniforms(_pointer)
  })
  const handleMouseMove = debounce((e: MouseEvent) => {
    if (!shaderRef.current)
      return

    const _pointer = new Vector2(
      e.clientX / document.documentElement.clientWidth - .5,
      - e.clientY / document.documentElement.clientHeight + .5,
    )

    updShaderUniforms(_pointer)
  })

  useSubscribeThreeRef(rayOrigin, () => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.rayOrigin.value = rayOrigin.current.toArray()
      shaderRef.current.uniformsNeedUpdate = true
    }
  })
  useSubscribeThreeRef(rayDirection, () => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.rayDirection.value = rayDirection.current.toArray()
      shaderRef.current.uniformsNeedUpdate = true
    }
  })
  useSubscribeThreeRef(touchK, () => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.touchK.value = touchK.current
      shaderRef.current.uniformsNeedUpdate = true
    }
  })


  useEffect(() => {
    if (!isDesktop)
      window.addEventListener('touchmove', handleTouchMove)

    return () => {
      // if (!isDesktop)
      //   window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useEffect(() => {
    if (isDesktop)
      window.addEventListener('mousemove', handleMouseMove)

    return () => {
      // if (isDesktop)
      //   window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const touching = useRef(false)  
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      touching.current = true
    }

    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      // window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])
  useEffect(() => {
    const handleTouchEnd = (event: TouchEvent) => {
      touching.current = false
    }

    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      // window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  useFrame(() => {
    if (!shaderRef.current || isDesktop)
      return

    if (shaderRef.current.uniforms.touchK.value > 0 && !touching.current && !isDesktop) {
      touchK.current = touchK.current * 0.975
      notifyThreeRef(touchK)
    }
  })

  return (
    <shaderMaterial
      ref={shaderRef}
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
