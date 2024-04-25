import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'

import { CameraControls } from './CameraControls'
import PointCloud from './PointCloud'
import RayTest from './RayTest'
import UniformsState from './UniformsState'



export const Scene: React.FC = () => {
  const pointCloudRef = useRef(null)

  return (
    <Canvas
      onCreated={state => state.gl.setPixelRatio(window.devicePixelRatio)}
      // onScroll={e => e.stopPropagation()}
      // onTouchMove={e => e.stopPropagation()}
    >
      <CameraControls />
      <ambientLight />
      {/* <RayTest /> */}
      <UniformsState
        pointCloudRef={pointCloudRef}
      />

      <PointCloud
        pointCloudRef={pointCloudRef}
      />
    </Canvas>
  )
}
