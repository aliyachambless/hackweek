import { Suspense, useState, useEffect, useRef } from 'react'
import * as THREE from "three"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import { Physics, usePlane, useSphere, useBox, useCompoundBody } from "@react-three/cannon"
import lerp from "lerp"

// function Model({ url, ...props }) {
//   // useGLTF suspends the component, it literally stops processing
//   const { scene } = useGLTF(url)
//   // By the time we're here the model is gueranteed to be available
//   return <primitive object={scene} {...props} />
// }

function ToothMouse() {
  // Make it a physical object that adheres to gravitation and impact
  const [ref, api] = useBox(() => ({ type: "Kinematic", args: [2, 2, 2] }))
  // use-frame allows the component to subscribe to the render-loop for frame-based actions
  let values = useRef([0, 0])
  useFrame((state) => {
    // The paddle is kinematic (not subject to gravitation), we move it with the api returned by useBox
    values.current[0] = lerp(values.current[0], (state.mouse.x * Math.PI) / 5, 0.2)
    values.current[1] = lerp(values.current[1], (state.mouse.x * Math.PI) / 5, 0.2)
    api.position.set(state.mouse.x * 10, state.mouse.y * 5, 0)
    api.rotation.set(0, 0, values.current[1])
    // Left/right mouse movement rotates it a liitle for effect only
    // model.current.rotation.x = lerp(model.current.rotation.x, 0, 0.2)
    // model.current.rotation.y = values.current[0]
  })

  const fbx = useFBX("tooth.fbx");
  return (
    // <Model url="/tooth.gltf" ref={ref}/>
    // <mesh ref={ref} castShadow receiveShadow geometry={nodes.shoe.geometry} material-envMapIntensity={0.8} />
    <primitive ref={ref} object={fbx} scale={0.002} />  

    )
}

export default function Tooth() {
  return (
    // <div width={'100vw'} height={'180px'}>
      <ToothMouse />
     // <OrbitControls autoRotate enableZoom={false} enablePan={false} minAzimuthAngle={0} maxAzimuthAngle={0} /> */}
    // </div>
  )
}
