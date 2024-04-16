import { FC, useEffect, useRef } from 'react'
import { Vector2, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'

import useStore from '../hooks/useStore'
import { debounce } from 'lodash'
import { ThreeRef, notifyThreeRef, useSubscribeThreeRef } from '../utils/ThreeRef'
import { isDesktop } from 'react-device-detect'
import { rayDirection, rayOrigin, touchK } from './Uniforms'


export type UniformsStateType = {
  shaderRef: any
  pointCloudRef: any
}


const cameraPos = new Vector3()
const prevCameraPos = new Vector3()


const UniformsState: FC<UniformsStateType> = ({
  shaderRef,
  pointCloudRef
}) => {
  const { permissionGranted } = useStore(state => state)
  const noiseK = useRef(0)
  const prevCamPos = useRef(new Vector3())
  const { camera } = useThree()

  useFrame(() => {
    if (permissionGranted) {
      if (pointCloudRef.current && pointCloudRef.current.material)
        if (pointCloudRef.current.material.uniforms.noiseK.value > 0) {
          pointCloudRef.current.material.uniforms.noiseK.value *= 0.975
          pointCloudRef.current.material.uniformsNeedUpdate = true
        }
    } else {
      if (pointCloudRef.current && pointCloudRef.current.material) {
        cameraPos.copy(camera.position)
        prevCameraPos.copy(prevCamPos.current)

        const posDelta = cameraPos.add(prevCameraPos.negate()).length()

        noiseK.current = Math.min(Math.max(noiseK.current, posDelta * 3), 2.5)
        pointCloudRef.current.material.uniforms.noiseK.value = noiseK.current
        pointCloudRef.current.material.uniformsNeedUpdate = true
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

      if (speed > pointCloudRef.current.material.uniforms.noiseK.value) {
        pointCloudRef.current.material.uniforms.noiseK.value = speed
        pointCloudRef.current.material.uniformsNeedUpdate = true
      }
    }, 10)

    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => window.removeEventListener('devicemotion', handleDeviceMotion)
  }, [permissionGranted])



  const { raycaster } = useThree()

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
      // e.clientX / document.documentElement.clientWidth - .5,
      // - e.clientY / document.documentElement.clientHeight + .5,
      e.clientX,
      e.clientY,
    )

    updShaderUniforms(_pointer)
  })

  useSubscribeThreeRef(rayOrigin, () => {
    if (pointCloudRef.current && pointCloudRef.current.material) {
      pointCloudRef.current.material.uniforms.rayOrigin.value = rayOrigin.current.toArray()
      pointCloudRef.current.material.uniformsNeedUpdate = true
    }
  })
  useSubscribeThreeRef(rayDirection, () => {
    if (pointCloudRef.current && pointCloudRef.current.material) {
      pointCloudRef.current.material.uniforms.rayDirection.value = rayDirection.current.toArray()
      pointCloudRef.current.material.uniformsNeedUpdate = true
    }
  })
  useSubscribeThreeRef(touchK, () => {
    if (pointCloudRef.current && pointCloudRef.current.material) {
      pointCloudRef.current.material.uniforms.touchK.value = touchK.current
      pointCloudRef.current.material.uniformsNeedUpdate = true
    }
  })


  useEffect(() => {
    if (!isDesktop)
      window.addEventListener('touchmove', handleTouchMove)

    return () => {
      if (!isDesktop)
        window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // useEffect(() => {
  //   if (isDesktop)
  //     window.addEventListener('mousemove', handleMouseMove)

  //   return () => {
  //     // if (isDesktop)
  //     //   window.removeEventListener('mousemove', handleMouseMove)
  //   }
  // }, [])

  useFrame(state => {
    if (!isDesktop)
      return

    handleMouseMove({ clientX: state.pointer.x, clientY: state.pointer.y } as MouseEvent)
  })

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

    if (pointCloudRef.current.material.uniforms.touchK.value > 0 && !touching.current && !isDesktop) {
      touchK.current = touchK.current * 0.975
      notifyThreeRef(touchK)
    }
  })


  return (
    <></>
  )
}


export default UniformsState
