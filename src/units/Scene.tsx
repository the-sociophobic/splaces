import { Canvas } from '@react-three/fiber'

import { CameraControls } from './CameraControls'
import Gizmo from './Gizmo'
import PointCloud from './PointCloud'



export const Scene: React.FC = () => {
  return (
    <Canvas>
      <CameraControls />
      <ambientLight />  
      {/* <pointLight position={[5, 5, -10]} intensity={0} />
      <pointLight position={[16, 5, -10]} intensity={555} /> */}
      {/* <pointLight position={[16, 5, 3]} intensity={555} /> */}
      {/* <Gizmo /> */}

      <PointCloud />
    </Canvas>
  )
}
