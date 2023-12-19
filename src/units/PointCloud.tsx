import { FC } from 'react'


const PointCloud: FC = () => {
  const scanPoints = []
  
  return (
    <points>
      {/* <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          array={scanPoints}
          count={scanPoints.length / 3}
          itemSize={3}
        />
      </bufferGeometry> */}
      <boxGeometry />
    </points>
  )
}


export default PointCloud
