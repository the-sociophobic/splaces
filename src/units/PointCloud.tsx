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
}

const modelsPos: { [key: string]: ModelPosType } = {
  'karelia': {
    position: [0, -5.5, 1],
    rotation: [Math.PI * 1.2, 0, 0],
  },
  'shipovnik': {
    position: [5, -14.5, 0],
    rotation: [Math.PI * 1.2, 0, 0],
  },
  'tree': {
    position: [0, -15.5, 1],
    rotation: [Math.PI * 1.2, 0, -Math.PI / 2],
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
  const { position, rotation } = modelsPos[model]


  return (
    <primitive
      ref={pointCloudRef}
      object={obj}
      position={position}
      rotation={rotation}
      scale={[1, 1, 1]}
    >
      <NoiseMaterial />
    </primitive>
  )
}


export default PointCloud
