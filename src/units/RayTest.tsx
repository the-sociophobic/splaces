import { useRef, useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { debounce } from 'lodash'


const RayTest: React.FC = () => {
  const { raycaster, pointer, camera } = useThree()
  const [_start, set_start] = useState(raycaster.ray.origin.toArray())
  const [_end, set_end] = useState(raycaster.ray.direction.toArray())

  useEffect(() => {
    const handleTouchMove = debounce((event: TouchEvent) => {
      console.log(pointer)
      raycaster.setFromCamera(pointer, camera)
      set_start(raycaster.ray.origin.toArray())
      set_end(raycaster.ray.direction.clone().add(raycaster.ray.origin).toArray())
    })

    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <>
      <mesh position={_start}>
        <sphereGeometry args={[.05]} />
      </mesh>
      <mesh position={_end}>
        <sphereGeometry args={[.05]} />
      </mesh>
    </>
  )
}


export default RayTest
