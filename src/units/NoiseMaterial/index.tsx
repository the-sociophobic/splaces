import { useRef } from 'react'
import { ShaderMaterial, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
// import ReactAccelerometer from 'react-accelerometer'
import ReactAccelerometer from 'react-accelerometer-field'

import { fragmentShader, vertexShader } from './shaders'


const NoiseMaterial = () => {
  const noiseK = useRef(0)
  // const increase = useRef(1)
  const shaderRef = useRef<ShaderMaterial>(null)
  const { camera } = useThree()
  const prevCamPos = useRef(new Vector3())

  useFrame(() => {
    // if (noiseK.current > 0)
    //   noiseK.current -= .05

    if (shaderRef.current) {
      // shaderRef.current.uniforms.noiseK.value = noiseK.current
      const posDelta = camera.position.clone().add(prevCamPos.current.clone().negate()).length()
      noiseK.current = Math.min(Math.max(noiseK.current, posDelta * 3), 2.5)
      shaderRef.current.uniforms.noiseK.value = noiseK.current
      prevCamPos.current.copy(camera.position)
    }

    if (noiseK.current > 0) {
      noiseK.current *= 0.97
    }
  })

  // useEffect(() => {
  //   const motion = (e: any) => {
  //     if (noiseK.current)
  //       noiseK.current = Math.sqrt(
  //         e.accelerationIncludingGravity.x ** 2 +
  //         e.accelerationIncludingGravity.y ** 2 +
  //         e.accelerationIncludingGravity.z ** 2
  //       )
  //   }

  //   window.addEventListener('devicemotion', motion, false)

  //   return () => window.removeEventListener('devicemotion', motion, false)
  // }, [])

  // useEffect(() => {
  //   if ('Gyroscope' in window) {
  //     let sensor = new Gyroscope();
  //     sensor.addEventListener('reading', function (e) {
  //       status.innerHTML = 'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
  //     });
  //     sensor.start();
  //   }
  //   else
  //     status.innerHTML = 'Gyroscope not supported';

  //   if (typeof Accelerometer === "function")
  //     let accelerometer: null | Accelerometer = null;
  //   try {
  //     accelerometer = new Accelerometer({ referenceFrame: "device" });
  //     accelerometer.addEventListener("error", (event) => {
  //       // Handle runtime errors.
  //       if (event.error.name === "NotAllowedError") {
  //         // Branch to code for requesting permission.
  //       } else if (event.error.name === "NotReadableError") {
  //         console.log("Cannot connect to the sensor.");
  //       }
  //     });
  //     accelerometer.addEventListener("reading", () => reloadOnShake(accelerometer));
  //     accelerometer.start();
  //   } catch (error: any) {
  //     // Handle construction errors.
  //     if (error.name === "SecurityError") {
  //       // See the note above about permissions policy.
  //       console.log("Sensor construction was blocked by a permissions policy.");
  //     } else if (error.name === "ReferenceError") {
  //       console.log("Sensor is not supported by the User Agent.");
  //     } else {
  //       throw error;
  //     }
  //   }
  // }, [])

  return (
    <ReactAccelerometer>
      {(position: any, rotation: any) => (
        <shaderMaterial
          ref={shaderRef}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={{
            noiseK: {
              value: position?.x || rotation?.x || 0
            }
          }}
        />
      )}
    </ReactAccelerometer>
  )
}


export default NoiseMaterial