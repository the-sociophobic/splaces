import { FC } from 'react'
import { useLoader } from '@react-three/fiber'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'


const PointCloud: FC = () => {
  const obj = useLoader(PCDLoader, 'pcd/karelia_drift.pcd')
  
  return (
    <primitive
      object={obj}
      position={[0, -1.5, 1]}
      rotation={[Math.PI * 1.2, 0, 0]}
      scale={[.3, .3, .3]}
    />
  )
}


export default PointCloud
