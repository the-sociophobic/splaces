import { FC, useEffect, useRef } from 'react'
import { Vector2, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { isDesktop } from 'react-device-detect'
import { clamp, debounce } from 'lodash'

import useStore from '../hooks/useStore'
import { notifyThreeRef, useSubscribeThreeRef } from '../utils/ThreeRef'
import {
  rayDirection,
  rayOrigin,
  touchK,
  noiseK,
  touching,
  touchStartX,
  touchDeltaX,
  touchCameraStart,
  lastTouchTimestamp,
  cameraPos
} from './Uniforms'


export type UniformsStateType = {
  pointCloudRef: any
}


const posDelta = new Vector3()
const pointer = new Vector2()

const MAX_MOVE_NOISE = 25


const UniformsState: FC<UniformsStateType> = ({
  pointCloudRef
}) => {
  const materialIsDefined = () => !!(pointCloudRef.current && pointCloudRef.current.material)

  // SUBSCRIBE TO UNIFORMS UPDATES
  useSubscribeThreeRef(rayOrigin, () => {
    if (materialIsDefined()) {
      pointCloudRef.current.material.uniforms.rayOrigin.value = rayOrigin.current.toArray()
      pointCloudRef.current.material.uniformsNeedUpdate = true
    }
  })
  useSubscribeThreeRef(rayDirection, () => {
    if (materialIsDefined()) {
      pointCloudRef.current.material.uniforms.rayDirection.value = rayDirection.current.toArray()
      pointCloudRef.current.material.uniformsNeedUpdate = true
    }
  })
  useSubscribeThreeRef(touchK, () => {
    if (materialIsDefined()) {
      pointCloudRef.current.material.uniforms.touchK.value = touchK.current
      pointCloudRef.current.material.uniformsNeedUpdate = true
    }
  })
  useSubscribeThreeRef(noiseK, () => {
    if (materialIsDefined()) {
      pointCloudRef.current.material.uniforms.noiseK.value = noiseK.current
      pointCloudRef.current.material.uniformsNeedUpdate = true
    }
  })

  // CAMERA MOVEMENT NOISE
  const { permissionGranted } = useStore(state => state)
  const prevCamPos = useRef(new Vector3())
  const { camera, pointer: threePointer, clock } = useThree()

  useFrame((state, deltaTime) => {
    if (!materialIsDefined() || permissionGranted)
      return

    posDelta.copy(cameraPos.current).sub(prevCamPos.current)

    noiseK.current = Math.min(
      Math.max(noiseK.current, posDelta.length() * 1000 * deltaTime),
      MAX_MOVE_NOISE
    )
    notifyThreeRef(noiseK)
    prevCamPos.current.copy(cameraPos.current)
  })

  // DEVICE ACCELEROMETER NOISE
  useEffect(() => {
    const handleDeviceMotion = debounce((event: DeviceMotionEvent) => {
      const acc = event.acceleration

      if (!materialIsDefined() || !acc)
        return

      const speed = ((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2) / 30

      if (speed > noiseK.current) {
        noiseK.current = speed
        notifyThreeRef(noiseK)
      }
    }, 10)

    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => window.removeEventListener('devicemotion', handleDeviceMotion)
  }, [permissionGranted])

  // NOISE FADING
  useFrame((_state, deltaTime) => {
    if (!materialIsDefined())
      return

    if (noiseK.current > 0) {
      noiseK.current *= (permissionGranted ? (0.975 - deltaTime * 5) : (0.95 - deltaTime * 5))
      notifyThreeRef(noiseK)
    }

    if (!isDesktop) {
      if (touching.current) {
        touchK.current = clamp(touchK.current * (1 + deltaTime * 35), 0, 1)
        notifyThreeRef(touchK)
      } else {
        if (touchK.current > 0) {
          touchK.current = clamp(touchK.current * (0.975 - deltaTime * 5), 0, 1)
          notifyThreeRef(touchK)
        }
      }
    }
  })

  const { raycaster } = useThree()
  const updRayUniforms = (_pointer: Vector2) => {
    raycaster.setFromCamera(_pointer, camera)
    rayOrigin.current.copy(raycaster.ray.origin)
    notifyThreeRef(rayOrigin)
    rayDirection.current.copy(raycaster.ray.direction)
    notifyThreeRef(rayDirection)
    if (isDesktop) {
      touchK.current = .5
      notifyThreeRef(touchK)
    }
  }

  // const handleTouchMove = debounce((e: TouchEvent) => {
  const handleTouchMove = debounce(() => {
    if (!materialIsDefined())
      return

    touching.current = true
    notifyThreeRef(touching)
    lastTouchTimestamp.current = clock.getElapsedTime()
    notifyThreeRef(lastTouchTimestamp)

    pointer.set(
      //  e.touches[0].clientX * 2 - 1,
      // -e.touches[0].clientY * 2 + 1,
      threePointer.x,
      threePointer.y
    )

    updRayUniforms(pointer)

    touchDeltaX.current = threePointer.x - touchStartX.current
    notifyThreeRef(touchDeltaX)
  }, 3)

  // const handleScroll = debounce((e: Event) => {
  //   if (!materialIsDefined())
  //     return

  //   // touching.current = false
  //   // notifyThreeRef(touching)
  // })

  const handleMouseMove = debounce((e: MouseEvent) => {
    if (!materialIsDefined())
      return

    pointer.set(
      e.clientX / document.documentElement.clientWidth * 2 - 1,
      -e.clientY / document.documentElement.clientHeight * 2 + 1,
      // e.clientX,
      // e.clientY,
      // -threePointer.x,
      // -threePointer.y
    )

    updRayUniforms(pointer)
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
  //   if (!isDesktop)
  //     window.addEventListener('scroll', handleScroll)

  //   return () => {
  //     if (!isDesktop)
  //       window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

  useEffect(() => {
    if (isDesktop)
      window.addEventListener('mousemove', handleMouseMove)

    return () => {
      if (isDesktop)
        window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // HANDLE TOUCH
  const handleTouchStart = (e: TouchEvent) => {
    touching.current = true
    notifyThreeRef(touching)
    lastTouchTimestamp.current = clock.getElapsedTime()
    notifyThreeRef(lastTouchTimestamp)

    touchCameraStart.current.copy(cameraPos.current)
    notifyThreeRef(touchCameraStart)
    touchStartX.current = threePointer.x
    notifyThreeRef(touchStartX)
  }

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart)

    return () => window.removeEventListener('touchstart', handleTouchStart)
  }, [])

  const handleTouchEnd = () => {
    touching.current = false
    notifyThreeRef(touching)
    // touchStartX.current = 0
    // notifyThreeRef(touchStartX)
    // touchCameraStart.current.set(0, 0, 0)
    // notifyThreeRef(touchCameraStart)
  }

  useEffect(() => {
    window.addEventListener('touchend', handleTouchEnd)

    return () => window.removeEventListener('touchend', handleTouchEnd)
  }, [])
  useEffect(() => {
    window.addEventListener('touchcancel', handleTouchEnd)

    return () => window.removeEventListener('touchcancel', handleTouchEnd)
  }, [])

  useEffect(() => {
    clock.start()
  }, [])

  useFrame(state => {
    const timeSinceLastKnownTouch = state.clock.getElapsedTime() - lastTouchTimestamp.current

    if (timeSinceLastKnownTouch > .45 && touching.current) {
      touching.current = false
      notifyThreeRef(touching)
    }
  })

  return (
    <></>
  )
}


export default UniformsState
