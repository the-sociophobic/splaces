import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'

import useStore from '../hooks/useStore'
import { isIOS } from 'react-device-detect'


const RequireSensorPermisson = () => {
  const [
    permissionGranted,
    setPermissionGranted,
    modelLoaded
  ] = useStore(state => [
    state.permissionGranted,
    state.setPermissionGranted,
    state.modelLoaded,
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
      {(!permissionGranted && modelLoaded && isIOS) &&
        <button
          className='enable-acc'
          onClick={() => _permission()}
        >
          Enable motion
        </button>
      }
    </>
  )
}


export default RequireSensorPermisson
