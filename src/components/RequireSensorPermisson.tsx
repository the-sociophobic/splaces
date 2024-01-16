import { useEffect, useState } from "react";

const RequireSensorPermisson = () => {
  const [showButton, setShowButton] = useState(true)

  const _permission = () => {
    if (typeof (DeviceMotionEvent) !== "undefined" && typeof ((DeviceMotionEvent as any).requestPermission) === "function") {
      (DeviceMotionEvent as any).requestPermission()
        .then((response: any) => {
          if (response === 'granted')
            setShowButton(false)
        })
        .catch(console.error)
    } else {
      alert("DeviceMotionEvent is not defined");
    }
  }

  useEffect(() => {
    _permission()
  }, [])

  return (
    <>
      {showButton &&
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
