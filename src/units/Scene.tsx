import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { debounce } from 'lodash'

import { CameraControls } from './CameraControls'
import Gizmo from './Gizmo'
import PointCloud from './PointCloud'
import RayTest from './RayTest'
import UniformsState from './UniformsState'



export const Scene: React.FC = () => {  
  const shaderRef = useRef(null)
  const pointCloudRef = useRef(null)
  const shaderVersion = useRef(1)
  
  // useEffect(() => {
  //   const updShaderVersion = debounce(() => {
  //     if (shaderVersion.current)
  //     console.log('shaderVersion', shaderVersion.current)
  //     shaderVersion.current += 1
  //   }, 10)

  //   window.addEventListener('scroll', updShaderVersion)

  //   return () => window.removeEventListener('scroll', updShaderVersion)
  // }, [])

  return (
    <Canvas onCreated={state => state.gl.setClearAlpha(0)}>
      <CameraControls />
      <ambientLight />
      {/* <RayTest /> */}
      {/* <pointLight position={[5, 5, -10]} intensity={0} />
      <pointLight position={[16, 5, -10]} intensity={555} /> */}
      {/* <pointLight position={[16, 5, 3]} intensity={555} /> */}
      {/* <Gizmo /> */}
      <UniformsState
        shaderRef={shaderRef}
        pointCloudRef={pointCloudRef}
      />

      {/* {shaderVersion.current % 2 === 1 && */}
        <PointCloud
          shaderRef={shaderRef}
          pointCloudRef={pointCloudRef}
          // key={shaderVersion.current || 1}
        />
      {/* } */}
    </Canvas>
  )
}
