import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'

import useStore from '../hooks/useStore'


const RequireSensorPermisson = () => {
  const [
    permissionGranted,
    setPermissionGranted
  ] = useStore(state => [
    state.permissionGranted,
    state.setPermissionGranted,
  ], shallow)

  const _permission = () => {
    if (typeof (DeviceMotionEvent) !== 'undefined' && typeof ((DeviceMotionEvent as any).requestPermission) === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: any) => {
          if (response === 'granted')
            setPermissionGranted(true)
        })
        .catch(console.error)
    } else {
      console.log('DeviceMotionEvent is not defined');
    }
  }

  useEffect(() => {
    _permission()
  }, [])

  return (
    <>
      {!permissionGranted &&
        <button
          onClick={() => _permission()}
        >
          Разрешить доступ
        </button>
      }
    </>
  )
}


export default RequireSensorPermisson
