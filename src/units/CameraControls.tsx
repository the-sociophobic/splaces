import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { isDesktop } from 'react-device-detect'

import { useSubscribeThreeRef } from '../utils/ThreeRef'
import { touchDeltaX, touchCameraStart } from './Uniforms'


const top = new THREE.Vector3(0, 1, 0)
const vectorToTarget = new THREE.Vector3(0, 1, 0)


export const CameraControls: React.FC = () => {
  const controlsRef = useRef<OrbitControlsType>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(-3.5, -1.25, -3)
      controlsRef.current.object.position.set(-7.5, 2.3, .9)
      controlsRef.current.maxDistance = 10
      controlsRef.current.enabled = isDesktop
      controlsRef.current.enableZoom = false
      controlsRef.current.update()
    }
  }, [controlsRef.current])

  useSubscribeThreeRef(touchDeltaX, () => {
    if (!controlsRef.current)
      return

    vectorToTarget.copy(touchCameraStart.current).sub(controlsRef.current.target)
    const angle = touchDeltaX.current * Math.PI / 9
    vectorToTarget.applyAxisAngle(top, angle)
    controlsRef.current.object.position.copy(vectorToTarget.add(controlsRef.current.target))
    // controlsRef.current.object.position.set(0, 0, 0)
    controlsRef.current.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
    />
  )
}
