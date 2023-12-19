import { useRef, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'


export const CameraControls: React.FC = () => {
  const controlsRef = useRef<OrbitControlsType>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(-3.5, -1.25, -3)
      controlsRef.current.object.position.set(-7.5, 2.3, .9)
      controlsRef.current.update()
    }
  }, [controlsRef.current])

  return (
    <OrbitControls
      ref={controlsRef}
    />
  )
}
