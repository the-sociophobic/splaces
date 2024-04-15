import { FC, useEffect, useRef, useState } from 'react'
import { ShaderMaterial, Vector2, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { isDesktop } from 'react-device-detect'
import { debounce } from 'lodash'

import { vertShader, fragShader } from './shaders'
import useStore from '../../hooks/useStore'
import { ThreeRef, notifyThreeRef, useSubscribeThreeRef } from '../../utils/ThreeRef'


export type NoiseMaterialType = {
  shaderRef: any
}

const NoiseMaterial: FC<NoiseMaterialType> = ({
  shaderRef
}) => {
  return (
    <shaderMaterial
      ref={shaderRef}
      fragmentShader={fragShader}
      vertexShader={vertShader}
      uniforms={{
        noiseK: {
          value: 0
        },
        touchK: {
          value: 0
        },
        rayOrigin: {
          value: [0, 0, 0]
        },
        rayDirection: {
          value: [0, 20, 0]
        },
      }}
    />
  )
}


export default NoiseMaterial
