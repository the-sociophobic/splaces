import { FC, useRef } from 'react'
import { ThreeElements, useLoader } from '@react-three/fiber'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'

import NoiseMaterial from './NoiseMaterial'
import isProd from '../utils/isProd'
import useStore from '../hooks/useStore'


const PointCloud: FC = () => {
  const setModelLoaded = useStore(state => state.setModelLoaded)
  // const asset_path = isProd() ?
  // 'pcd/karelia_drift.pcd'
  // :
  // 'https://raw.githubusercontent.com/the-sociophobic/splaces/main/public/pcd/karelia_drift.pcd'
  const asset_path = 'https://raw.githubusercontent.com/the-sociophobic/splaces/main/public/pcd/karelia_drift.pcd'
  const obj = useLoader(
    PCDLoader,
    asset_path,
    undefined,
    e => e.loaded === e.total && setModelLoaded(true)
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
