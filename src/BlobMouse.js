import * as THREE from "three"
import { createContext, createRef, forwardRef, useState, useContext, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useSphere, useBox, useConeTwistConstraint } from '@react-three/cannon'
import { useTexture, MeshDistortMaterial } from '@react-three/drei'

const parent = createContext(createRef())

function Handle({ vec = new THREE.Vector3(), ...props }) {
  const { viewport } = useThree()

  const [ref, api] = useBox(() => ({ mass: 100, angularDamping: 0.2, linearDamping: 0.95, args: [3, 3, 3], position: [0,0,0] }))

  const [mousePosition, setMousePosition] = useState(new THREE.Vector3().set([0,0,0]))

  useFrame(({ mouse: { x, y }, viewport: { height, width } }) => {
    // setMousePosition([(x * width) / 2,(y * height) / 2,0])
    // console.log(mousePosition)
    api.position.set((x * width) / 2, (y * height) / 2 - height, 0, 1000)

    // const currentPosition = ref.current.position
    // const mousePosition = new THREE.Vector3().set(x, y, 0)
    // const force = mousePosition.sub(currentPosition).multiplyScalar(1)
    // api.applyImpulse(force.toArray(), [0,0,0])
    // api.applyForce(currentPosition.sub(mousePosition).normalize().multiplyScalar(-50).toArray(), [0, 0, 0])
    
  })
  // useEffect(() => {
  //   api.position.subscribe((p) => {
  //     console.log("mousePosition later", mousePosition)
  //     api.applyForce(vec.set(...p).sub(mousePosition).normalize().multiplyScalar(-1).toArray(), [0, 0, 0])
  //   })
  // }, [api])

  // useEffect(() => api.position.subscribe((p) => api.applyForce(vec.set(...p).sub(mousePosition).normalize().multiplyScalar(-1).toArray(), [0, 0, 0])), [api])

  const texture = useTexture({
    bumpMap: 'Moss002_1K_Displacement.jpg',
    emissiveMap: 'Moss002_1K_Displacement.jpg',
    clearcoatRoughnessMap: 'Moss002_1K_Displacement.jpg',
  })

  return (
    <mesh castShadow receiveShadow ref={ref} scale={0.2}>
      <sphereGeometry />
      <MeshDistortMaterial
        distort={0.7}
        speed={1}
        color={"black"}
        envMapIntensity={0.4}
        clearcoat={0.9}
        clearcoatRoughness={0}
        transmission={0.8}
        emissive={"black"}
        sheen={1}
        {...texture} />
    </mesh>

  // return (
  //   <group>
  //     <mesh ref={ref}>
  //       <sphereBufferGeometry args={[props.radius, 64, 64]} />
  //       <meshStandardMaterial />
  //     </mesh>
  //     {/* <parent.Provider value={ref}>{props.children}</parent.Provider> */}
  //   </group>
  )
}


const BlobMouse = (props) => {

  return (
    <Handle radius={0.07} />
  )
}

export default BlobMouse