import { Vector3 } from 'three'

import { ThreeRef } from '../utils/ThreeRef'


const rayOrigin: ThreeRef<Vector3> = new ThreeRef<Vector3>(new Vector3(0, 0, 0))
const rayDirection: ThreeRef<Vector3> = new ThreeRef<Vector3>(new Vector3(0, 0, 0))
const touchK: ThreeRef<number> = new ThreeRef<number>(1)
const noiseK: ThreeRef<number> = new ThreeRef<number>(0)

const touchStartX: ThreeRef<number> = new ThreeRef<number>(0)
const touchDeltaX: ThreeRef<number> = new ThreeRef<number>(0)
const touchCameraStart: ThreeRef<Vector3> = new ThreeRef<Vector3>(new Vector3(0, 0, 0))


export {
  rayOrigin,
  rayDirection,
  touchK,
  noiseK,
  touchStartX,
  touchDeltaX,
  touchCameraStart,
}
