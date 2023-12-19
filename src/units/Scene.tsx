import { Canvas } from '@react-three/fiber'

import { CameraControls } from './CameraControls'
import Gizmo from './Gizmo'
import PointCloud from './PointCloud'



export const Scene: React.FC = () => {
  return (
    <Canvas>
      <CameraControls />
      <PointCloud />
    </Canvas>
  )
}
