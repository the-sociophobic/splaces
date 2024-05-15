import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { isDesktop } from 'react-device-detect'
import { debounce } from 'lodash'

import { notifyThreeRef, useSubscribeThreeRef } from '../utils/ThreeRef'
import { touchDeltaX, touchCameraStart, touching, cameraPos } from './Uniforms'
import useStore from '../hooks/useStore'


const cameraInitialPos = new THREE.Vector3(-7.5, 2.3, .9)
const target = new THREE.Vector3(-3.5, -1.25, -3)
const cameraTargetDistance = new THREE.Vector3().copy(cameraInitialPos).sub(target).length()
const top = new THREE.Vector3(0, 1, 0)
const front = new THREE.Vector3(0, 0, 1)

const vectorToTarget = new THREE.Vector3(0, 1, 0)
const deltaPos = new THREE.Vector3(0, 0, 0)
const acceleration = new THREE.Vector3(0, 0, 0)
const quaternion = new THREE.Quaternion()
const matrix = new THREE.Matrix4()


const CameraControlsDesktop: React.FC = () => {
  const controlsRef = useRef<OrbitControlsType>(null)

  useEffect(() => {
    if (controlsRef.current) {
      cameraPos.current.copy(cameraInitialPos)
      notifyThreeRef(cameraPos)

      controlsRef.current.object.position.copy(cameraInitialPos)
      controlsRef.current.target.copy(target)
      controlsRef.current.update()
    }
  }, [controlsRef.current])

  useFrame(() => {
    if (controlsRef.current) {
      deltaPos.copy(cameraPos.current)
        .sub(controlsRef.current.object.position)
        .multiplyScalar(isDesktop ? .025 : .35)
      controlsRef.current.object.position.add(deltaPos)
      // controlsRef.current.object.position.copy(cameraPos.current)
      controlsRef.current.update()
    }
  })

  useSubscribeThreeRef(touchDeltaX, () => {
    if (!controlsRef.current || !touching.current)
      return

    vectorToTarget.copy(touchCameraStart.current).sub(target)
    const angle = -touchDeltaX.current * Math.PI / 7
    vectorToTarget.applyAxisAngle(top, angle)
    cameraPos.current.copy(vectorToTarget.add(target))
    notifyThreeRef(cameraPos)
  })

  const handleDeviceMotion = debounce((event: DeviceMotionEvent) => {
    if (!controlsRef.current || touching.current)
      return 

    const { rotationRate } = event

    if (!rotationRate)
      return
    
    acceleration.set(
      rotationRate.alpha || 0,
      rotationRate.beta || 0,
      // rotationRate.gamma || 0
      0
    ).multiplyScalar(.0005)

    vectorToTarget.copy(target).sub(cameraPos.current).normalize()
    quaternion.setFromUnitVectors(front, vectorToTarget)
    matrix.makeRotationFromQuaternion(quaternion)
    acceleration.applyMatrix4(matrix)

    vectorToTarget.copy(cameraPos.current)
      .add(acceleration)
      .normalize().multiplyScalar(cameraTargetDistance)

    cameraPos.current.copy(vectorToTarget)
    notifyThreeRef(cameraPos)
  }, 3)

  const { permissionGranted } = useStore(state => state)  
  useEffect(() => {
    window.addEventListener('devicemotion', handleDeviceMotion)

    return () => window.removeEventListener('devicemotion', handleDeviceMotion)
  }, [permissionGranted])

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={isDesktop}
      enableZoom={false}
      maxDistance={10}
    />
  )
}

// const CameraControlsMobile: React.FC = () => {
//   const { camera } = useThree()

//   useEffect(() => {
//     camera.position.copy(cameraInitialPos)
//     camera.lookAt(target)
//     camera.updateProjectionMatrix()
//   }, [])

//   useSubscribeThreeRef(touchDeltaX, () => {
//     vectorToTarget.copy(touchCameraStart.current).sub(target)
//     const angle = -touchDeltaX.current * Math.PI / 9
//     vectorToTarget.applyAxisAngle(top, angle)
//     camera.position.copy(vectorToTarget.add(target))
//     camera.lookAt(target)
//     camera.updateProjectionMatrix()
//   })

//   const { permissionGranted } = useStore(state => state)
//   useEffect(() => {
//     const handleDeviceMotion = debounce((event: DeviceMotionEvent) => {
//       const { rotationRate } = event

//       if (!rotationRate)
//         return
      
//       acceleration.set(
//         rotationRate.alpha || 0,
//         rotationRate.beta || 0,
//         // rotationRate.gamma || 0
//         0
//       ).multiplyScalar(.0005)
      
//       vectorToTarget.copy(target).sub(camera.position).normalize()
//       quaternion.setFromUnitVectors(front, vectorToTarget)
//       matrix.makeRotationFromQuaternion(quaternion)
//       acceleration.applyMatrix4(matrix)

//       vectorToTarget.copy(camera.position).add(acceleration)
//         .normalize().multiplyScalar(cameraTargetDistance)

//       camera.position.copy(vectorToTarget)
//       camera.lookAt(target)
//       camera.updateProjectionMatrix()
//     }, 5)

//     window.addEventListener('devicemotion', handleDeviceMotion)

//     return () => window.removeEventListener('devicemotion', handleDeviceMotion)
//   }, [permissionGranted])

//   return <></>
// }

export const CameraControls: React.FC = () =>// isDesktop ?
  <CameraControlsDesktop />
  // :
  // <CameraControlsMobile />
