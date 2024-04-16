import { FC, useEffect, useRef, useState } from 'react'
import { ThreeElements, useLoader } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'
import * as THREE from 'three'

import NoiseMaterial from './NoiseMaterial'
import isProd from '../utils/isProd'
import useStore from '../hooks/useStore'
import { debounce } from 'lodash'


export type PointCloudType = {
  shaderRef: any
  pointCloudRef: any
}
const PointCloud: FC<PointCloudType> = ({
  shaderRef,
  pointCloudRef
}) => {
  const setModelLoaded = useStore(state => state.setModelLoaded)
  // const asset_path = isProd() ?
  // 'pcd/karelia_drift.pcd'
  // :
  // 'https://raw.githubusercontent.com/the-sociophobic/splaces/main/public/pcd/karelia.pcd'
  const asset_path = 'https://raw.githubusercontent.com/the-sociophobic/splaces/main/public/pcd/karelia.pcd'
  // const asset_path = './splaces/pcd/karelia.pcd'
  // const asset_path = './splaces/pcd/shipovnik.pcd'
  // const asset_path = './splaces/pcd/tree.pcd'
  const obj = useLoader(
    PCDLoader,
    asset_path,
    undefined,
    e => {
      if (e.loaded === e.total)
        setTimeout(() => setModelLoaded(true), 5)
    }
  )
  const primRef = useRef<ThreeElements['primitive']>(null)

  const shaderVersion = useRef(1)
  useEffect(() => {
    const updShaderVersion = debounce(() => {
      if (shaderVersion.current)
      console.log('shaderVersion', shaderVersion.current)
      shaderVersion.current += 1
    }, 10)

    window.addEventListener('scroll', updShaderVersion)

    return () => window.removeEventListener('scroll', updShaderVersion)
  }, [])

  return (
    <primitive
      ref={pointCloudRef}
      object={obj}
      position={[0, -5.5, 1]}
      rotation={[Math.PI * 1.2, 0, 0]}
      scale={[1, 1, 1]}
      // key={shaderVersion.current || 1}
    >
      <NoiseMaterial
        shaderRef={shaderRef}
        // key={shaderVersion.current || 1}
      />
    </primitive>
  )
}


export default PointCloud
