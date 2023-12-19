import { Canvas } from '@react-three/fiber'

import { CameraControls } from './CameraControls'
import Gizmo from './Gizmo'
import PointCloud from './PointCloud'
import PointCloud2 from './PointCloud2'



export const Scene: React.FC = () => {
  return (
    <Canvas>
      <CameraControls />
      {/* <ambientLight />
      <pointLight position={[5, 5, -10]} intensity={55} />
      <pointLight position={[16, 5, -10]} intensity={55} />
      <pointLight position={[16, 5, 3]} intensity={55} /> */}
      <Gizmo />

      {/* <PointCloud /> */}
      <PointCloud2 />
    </Canvas>
  )
}
