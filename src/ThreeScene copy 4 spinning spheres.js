import { Suspense, useState, useEffect, useRef } from 'react'
import * as THREE from "three"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, MeshWobbleMaterial, Html, useTexture } from '@react-three/drei'
import { Physics, usePlane, useSphere, useBox, useCompoundBody } from "@react-three/cannon"
import lerp from "lerp"
import './styles.css'

import Header from './Header';
import Tooth from './Tooth'
import ChainScene from './Chain'

const mushies = [...Array(10)].map(() => ({ args: [0.7, 0.9, 1, 0.4, 0.3][Math.floor(Math.random() * 5)], mass: 1, angularDamping: 0.2, linearDamping: 0.95 }))

function Mushy({ vec = new THREE.Vector3(), ...props }) {
  const { viewport } = useThree()

  const texture = useTexture({
    bumpMap: 'Moss002_1K_Displacement.jpg',
    emissiveMap: 'Moss002_1K_Displacement.jpg',
    clearcoatRoughnessMap: 'Moss002_1K_Displacement.jpg',
  })

  // const [ref, api] = useCompoundBody(() => ({
  //   ...props,
  //   shapes: [
  //     { type: "Box", position: [0, 0, -1.2 * props.args], args: new THREE.Vector3().setScalar(props.args * 0.4).toArray() },
  //     { type: "Sphere", args: props.args },
  //   ],
  // }))
  // useEffect(() => api.position.subscribe((p) => api.applyForce(vec.set(...p).normalize().multiplyScalar(-props.args * 5).toArray(), [0, 0, 0])), [api])
  
  const [ref, api] = useSphere(() => ({ mass: 1, args: [props.args], position: [0, 0, 0] }))
  useEffect(() => api.position.subscribe((p) => api.applyForce(vec.set(...p).normalize().multiplyScalar(-props.args * 5).toArray(), [0, 0, 0])), [api])

  return (
    <mesh castShadow receiveShadow ref={ref} scale={props.args/1.5}>
      <sphereGeometry />
      <MeshDistortMaterial
        distort={0.7}
        speed={1}
        color={"red"}
        envMapIntensity={0.4}
        clearcoat={0.9}
        clearcoatRoughness={0}
        transmission={0.8}
        emissive={"#ff737c"}
        sheen={1}
        {...texture} />
    </mesh>
  )
}

function ScrollContainer({ scroll, children }) {
  const { viewport } = useThree()
  const group = useRef()
  useFrame((state, delta) => {
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, viewport.height * scroll.current, 4, delta)
    // Or: group.current.position.lerp(vec.set(0, viewport.height * scroll.current, 0), 0.1)
  })
  return <group ref={group} class={"group"}>{children}</group>
}

function Plane({ color, ...props }) {
  usePlane(() => ({ ...props }))
  return null
}

function Borders() {
  const { viewport } = useThree()
  return (
    <>
      <Plane position={[0, -viewport.height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Plane position={[-viewport.width / 2 - 1, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <Plane position={[viewport.width / 2 + 1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Plane position={[0, 0, 0]} rotation={[0, 0, 0]} />
      {/* <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} /> */}
    </>
  )
}

export default function ThreeScene() {
  const scrollRef = useRef()
  const scroll = useRef(0)
  return (
    <>
      <Canvas
      onCreated={(state) => state.events.connect(scrollRef.current)}
      raycaster={{ computeOffsets: ({ clientX, clientY }) => ({ offsetX: clientX, offsetY: clientY }) }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.75} />
          <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} color="white" castShadow shadow-mapSize={[512, 512]} />
          <directionalLight position={[0, 5, -4]} intensity={1} />
          <directionalLight position={[0, -15, -0]} intensity={2} color="#fcba03" />
          <ScrollContainer scroll={scroll}>
            <Physics gravity={[0, 0, 0]} iterations={1} broadphase="SAP">
              {/* <Borders /> */}
              {mushies.map((props, i) => <Mushy key={i} {...props} />)}
              <ChainScene/>
              {/* <Mushy /> */}
              <Header />
            </Physics>
          </ScrollContainer>
          {/* <OrbitControls autoRotate enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} /> */}
        </Suspense>
      </Canvas>
      <div
        ref={scrollRef}
        onScroll={(e) => (scroll.current = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight))}
        className="scroll">
        <div style={{ height: `200vh`, pointerEvents: 'none' }}></div>
      </div>
    </>
  )
}

// ReactDOM.render(<App />, document.getElementById('root'))