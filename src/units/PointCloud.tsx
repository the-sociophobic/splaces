import { FC } from 'react'
import { useLoader } from '@react-three/fiber'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader'

import NoiseMaterial from './NoiseMaterial'
import isProd from '../utils/isProd'
import useStore from '../hooks/useStore'


export type PointCloudType = {
  pointCloudRef: any
}

export type Vector3Array = [number, number, number]
export type ModelPosType = {
  position: Vector3Array
  rotation: Vector3Array
  scale: Vector3Array
  noiseKmax: number
}

const modelsPos: { [key: string]: ModelPosType } = {
  'karelia': {
    position: [0, -5.5, 1],
    rotation: [Math.PI * 1.2, 0, 0],
    scale: [1, 1, 1],
    noiseKmax: 5
  },
  'shipovnik': {
    position: [5, -14.5, 0],
    rotation: [Math.PI * 1.2, 0, 0],
    scale: [1, 1, 1],
    noiseKmax: 17
  },
  'tree': {
    position: [-5, -3.5, 1],
    rotation: [Math.PI * 1.2, 0, -Math.PI / 2],
    scale: [.35, .35, .35],
    noiseKmax: 20
  },
}

const PointCloud: FC<PointCloudType> = ({
  pointCloudRef
}) => {
  const setModelLoaded = useStore(state => state.setModelLoaded)
  const model = useStore(state => state.model)
  const asset_path = isProd() ?
    `https://cdn.tochkadostupa.spb.ru/the_sociophobic/splaces/pcd/${model}.pcd`
    :
    `./splaces/pcd/${model}.pcd`
  const obj = useLoader(
    PCDLoader,
    asset_path,
    undefined,
    e => {
      if (e.loaded === e.total)
        setTimeout(() => setModelLoaded(true), 5)
    }
  )
  const { position, rotation, scale, noiseKmax } = modelsPos[model]


  return (
    <primitive
      ref={pointCloudRef}
      object={obj}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <NoiseMaterial noiseKmax={noiseKmax} />
    </primitive>
  )
}


export default PointCloud
