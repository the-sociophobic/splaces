import { FC, useRef } from 'react'
import { ThreeElements, useLoader } from '@react-three/fiber'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'

import NoiseMaterial from './NoiseMaterial'
import isProd from '../utils/isProd'


const PointCloud: FC = () => {
  const obj = useLoader(PCDLoader, isProd() ?
    'pcd/karelia_drift.pcd'
    :
    'splaces/pcd/karelia_drift.pcd'
  )
  const primRef = useRef<ThreeElements['primitive']>(null)

  return (
    <primitive
      ref={primRef}
      object={obj}
      position={[0, -5.5, 1]}
      rotation={[Math.PI * 1.2, 0, 0]}
      scale={[1, 1, 1]}
    >
      <NoiseMaterial />
    </primitive>
  )
}


export default PointCloud
