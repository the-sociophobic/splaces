import { FC, useRef } from 'react'
import { ThreeElements, useLoader } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import * as THREE from 'three'

import NoiseMaterial from './NoiseMaterial'
import isProd from '../utils/isProd'
import useStore from '../hooks/useStore'


const PointCloud: FC = () => {
  const setModelLoaded = useStore(state => state.setModelLoaded)
  // const asset_path = isProd() ?
  // 'pcd/karelia_drift.pcd'
  // :
  // 'https://raw.githubusercontent.com/the-sociophobic/splaces/main/public/pcd/karelia.pcd'
  // const asset_path = 'https://raw.githubusercontent.com/the-sociophobic/splaces/main/public/pcd/karelia.pcd'
  const asset_path = './splaces/pcd/karelia.pcd'
  const obj = useLoader(
    PCDLoader,
    asset_path,
    undefined,
    e => e.loaded === e.total && setModelLoaded(true)
  )
  console.log(THREE.LoopOnce)
  const progress = useProgress()
  console.log(progress)
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
