import React, { useRef, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'


export const CameraControls: React.FC = () => {
  const controlsRef = useRef<OrbitControlsType>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(5, 0, 0)
      controlsRef.current.object.position.set(5, 10, 3)
      controlsRef.current.maxPolarAngle = Math.PI / 2 - .1
      controlsRef.current.update()
    }
  }, [controlsRef.current])

  return (
    <OrbitControls ref={controlsRef} />
  )
}
