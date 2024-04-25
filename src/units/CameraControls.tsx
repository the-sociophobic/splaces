import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { isDesktop } from 'react-device-detect'

import { useSubscribeThreeRef } from '../utils/ThreeRef'
import { touchDeltaX, touchCameraStart } from './Uniforms'
import { debounce } from 'lodash'
import useStore from '../hooks/useStore'


const cameraInitialPos = new THREE.Vector3(-7.5, 2.3, .9)
const target = new THREE.Vector3(-3.5, -1.25, -3)
const cameraTargetDistance = new THREE.Vector3().copy(cameraInitialPos).sub(target).length()
const top = new THREE.Vector3(0, 1, 0)
const front = new THREE.Vector3(0, 0, 1)

const vectorToTarget = new THREE.Vector3(0, 1, 0)
const acceleration = new THREE.Vector3(0, 0, 0)
const quaternion = new THREE.Quaternion()
const matrix = new THREE.Matrix4()

const CameraControlsDesktop: React.FC = () => {
  const controlsRef = useRef<OrbitControlsType>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(-3.5, -1.25, -3)
      controlsRef.current.object.position.copy(cameraInitialPos)
      controlsRef.current.update()
    }
  }, [controlsRef.current])

  useSubscribeThreeRef(touchDeltaX, () => {
    if (!controlsRef.current)
      return

    vectorToTarget.copy(touchCameraStart.current).sub(controlsRef.current.target)
    const angle = -touchDeltaX.current * Math.PI / 9
    vectorToTarget.applyAxisAngle(top, angle)
    controlsRef.current.object.position.copy(vectorToTarget.add(controlsRef.current.target))
    controlsRef.current.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={isDesktop}
      enableZoom={false}
      maxDistance={10}
    />
  )
}

const CameraControlsMobile: React.FC = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.copy(cameraInitialPos)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }, [])

  useSubscribeThreeRef(touchDeltaX, () => {
    vectorToTarget.copy(touchCameraStart.current).sub(target)
    const angle = -touchDeltaX.current * Math.PI / 9
    vectorToTarget.applyAxisAngle(top, angle)
    camera.position.copy(vectorToTarget.add(target))
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  })

  const { permissionGranted } = useStore(state => state)
  useEffect(() => {
    const handleDeviceMotion = debounce((event: DeviceMotionEvent) => {
      const { rotationRate } = event

      if (!rotationRate)
        return
      
      acceleration.set(
        rotationRate.alpha || 0,
        rotationRate.beta || 0,
        rotationRate.gamma || 0
      ).multiplyScalar(.001)
      
      vectorToTarget.copy(target).sub(camera.position).normalize()
      quaternion.setFromUnitVectors(front, vectorToTarget)
      matrix.makeRotationFromQuaternion(quaternion)
      acceleration.applyMatrix4(matrix)

      vectorToTarget.copy(camera.position).add(acceleration)
        .normalize().multiplyScalar(cameraTargetDistance)

      camera.position.copy(vectorToTarget)
      camera.lookAt(target)
      camera.updateProjectionMatrix()
    }, 5)

    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => window.removeEventListener('devicemotion', handleDeviceMotion)
  }, [permissionGranted])

  return <></>
}

export const CameraControls: React.FC = () => isDesktop ?
  <CameraControlsDesktop />
  :
  <CameraControlsMobile />
