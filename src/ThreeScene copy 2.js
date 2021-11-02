import { Suspense, useEffect } from 'react'
import * as THREE from "three"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, OrbitControls, useTexture } from '@react-three/drei'
import { Physics, usePlane, useSphere, useCompoundBody } from "@react-three/cannon"
import { EffectComposer, SSAO } from "@react-three/postprocessing"

const mushies = [...Array(50)].map(() => ({ args: [0.6, 0.6, 0.8, 0.8, 1][Math.floor(Math.random() * 5)], mass: 1, angularDamping: 0.2, linearDamping: 0.95 }))

const baubleMaterial = new THREE.MeshLambertMaterial({ color: "#c0a090", emissive: "red" })
const capMaterial = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.15, color: "#8a300f", emissive: "#600000", envMapIntensity: 9 })
const sphereGeometry = new THREE.SphereGeometry(1, 28, 28)

function Mushy({ vec = new THREE.Vector3(), ...props }) {
  const texture = useTexture({
    bumpMap: 'Moss002_1K_Displacement.jpg',
    emissiveMap: 'Moss002_1K_Displacement.jpg',
    clearcoatRoughnessMap: 'Moss002_1K_Displacement.jpg',
  })

  // const [ref, api] = useSphere(() => ({ mass: 1, position: [0, 0, 1.2 * props.args], args: new THREE.Vector3().setScalar(props.args * 0.4).toArray(), isKinematic: true }));
  const [ref, api] = useCompoundBody(() => ({
    ...props,
    shapes: [
      { type: "Box", position: [0, 0, 1.2 * props.args], args: new THREE.Vector3().setScalar(props.args * 0.4).toArray() },
      { type: "Sphere", args: props.args },
    ],
  }))
  useEffect(() => api.position.subscribe((p) => api.applyForce(vec.set(...p).normalize().multiplyScalar(-props.args * 35).toArray(), [0, 0, 0])), [api])
  return (
    // // <group ref={ref} dispose={null}>
    //   <mesh castShadow receiveShadow ref={ref}>
    //     <sphereGeometry scale={props.args} />
    //     <MeshDistortMaterial
    //       distort={0.4}
    //       speed={1}
    //       color={"red"}
    //       envMapIntensity={0.4}
    //       clearcoat={0.9}
    //       clearcoatRoughness={0}
    //       transmission={0.8}
    //       emissive={"#ff737c"}
    //       sheen={1}
    //       {...texture} />
    //   </mesh>
    // // </group>
    <group ref={ref} dispose={null}>
      <mesh castShadow receiveShadow scale={props.args} geometry={sphereGeometry} material={baubleMaterial} />
    </group>
  )
}

function Collisions() {
  const viewport = useThree((state) => state.viewport)
  usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }))
  usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }))
  usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }))
  usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }))
  const [, api] = useSphere(() => ({ type: "Kinematic", args: 2 }))
  return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 2.5))
}

export default function ThreeScene() {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <ambientLight intensity={0.75} />
        <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} color="white" castShadow shadow-mapSize={[512, 512]} />
        <directionalLight position={[0, 5, -4]} intensity={1} />
        <directionalLight position={[0, -15, -0]} intensity={2} color="#fcba03" />
        <Physics gravity={[0, 0, 0]} iterations={1} broadphase="SAP">
          <Collisions />
          {mushies.map((props, i) => <Mushy key={i} {...props} />)}
          {/* <Mushy /> */}
        </Physics>
        {/* <OrbitControls autoRotate enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} /> */}
      </Suspense>
      {/* <EffectComposer multisampling={0}>
      <SSAO samples={11} radius={30} intensity={20} luminanceInfluence={0.6} color="red" />
      <SSAO samples={21} radius={5} intensity={30} luminanceInfluence={0.6} color="red" />
    </EffectComposer> */}
    </Canvas>
  )
}

// ReactDOM.render(<App />, document.getElementById('root'))