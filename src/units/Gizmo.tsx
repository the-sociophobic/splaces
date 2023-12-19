import {
  GizmoHelper,
  GizmoViewport,
  // GizmoViewcube
} from '@react-three/drei'


const Gizmo: React.FC = () => {
  return (
    <GizmoHelper
      alignment='bottom-right'
      margin={[80, 80]}
    >
      <GizmoViewport
        axisColors={['red', 'green', 'blue']}
        labelColor='black'
      />
      {/* <GizmoViewcube /> */}
    </GizmoHelper>
  )
}


export default Gizmo
