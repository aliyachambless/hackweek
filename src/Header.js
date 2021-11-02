import { Suspense, useState, useEffect, useRef } from 'react'
import * as THREE from "three"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader, useThree } from '@react-three/fiber'
import { RoundedBox, MeshDistortMaterial, Html, useTexture } from '@react-three/drei'
import { Physics, usePlane, useSphere, useBox, useCompoundBody } from "@react-three/cannon"
import lerp from "lerp"

function HeaderBlob({ vec = new THREE.Vector3(), ...props }) {
  const [hidden, setVisible] = useState(false)
  const { viewport } = useThree()
  const headerOrigin = [props.x, viewport.height/2-props.y, props.z];
  const originScalar = new THREE.Vector3().set(...headerOrigin);

  const [ref, api] = useBox(() => ({ type: props.dynamic? 'Dynamic' : 'Static', mass: 1000, angularDamping: 0.2, linearDamping: 0.95, args: [props.width, props.height, 0.1], position: headerOrigin }))
  useEffect(() => api.position.subscribe((p) => api.applyForce(vec.set(...p).sub(originScalar).normalize().multiplyScalar(-1000).toArray(), [0, 0, 0])), [api])

  const repeatX = 0.25;
  const repeatY = 0.25;

  const base = useLoader(THREE.TextureLoader, "layered-fungus-ue/layered-fungus1_albedo.png");
  base.wrapS = THREE.RepeatWrapping;
  base.wrapT = THREE.RepeatWrapping;
  base.repeat.set(repeatX, repeatY);

  const bump = useLoader(THREE.TextureLoader, "layered-fungus-ue/layered-fungus1_height.png");
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(repeatX, repeatY);

  const ao = useLoader(THREE.TextureLoader, "layered-fungus-ue/layered-fungus1_ao.png");
  ao.wrapS = THREE.RepeatWrapping;
  ao.wrapT = THREE.RepeatWrapping;
  ao.repeat.set(repeatX, repeatY);

  const normal = useLoader(THREE.TextureLoader, "layered-fungus-ue/layered-fungus1_normal-dx.png");
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  normal.repeat.set(repeatX, repeatY);

  const rough = useLoader(THREE.TextureLoader, "layered-fungus-ue/layered-fungus1_roughness.png");
  rough.wrapS = THREE.RepeatWrapping;
  rough.wrapT = THREE.RepeatWrapping;
  rough.repeat.set(repeatX, repeatY);

  return (
    <RoundedBox ref={ref} radius={0.5} smoothness={4} args={[props.width, props.height, 0.1]} >
      <MeshDistortMaterial
        distort={0.15}
        map={base}
        color={"black"}
        bumpMap={bump}
        aoMap={ao}
        normalMap={normal}
        roughness={0.4}
        roughnessMap={rough}
        transmission={0.8}
      />
      <Html
        style={{
          // transition: 'all 0.2s',
          opacity: hidden ? 0 : 1,
          transform: `scale(5)`,
          color: `#ff7777`,
          // opacity: 0.5,
          fontFamily: 'Ladi Gross',
          maxWidth: '200px'
        }}
        distanceFactor={1.5}
        position={[0, 0, 0.6]}
        transform
        occlude
        onOcclude={setVisible}>
        <span>{props.text}</span>
        {/* <Slider style={{ width: 100 }} min={0.5} max={1} step={0.01} value={size} onChange={set} /> */}
      </Html>
    </RoundedBox>
  )
}

export default function Header() {
  const { viewport } = useThree()
  return (
    <>
      <HeaderBlob text={"THIS IS THE HEADER OF A TEETH WEBSITE"} dynamic={true} x={0} y={1} z={0} width={viewport.width / 1.1} height={2}/>
      <HeaderBlob text={"IM AFRAID OF TEETH"} x={-4} y={2} z={-10} width={30} height={20}/>
      <HeaderBlob text={"TEETH TEETH THEETH TEEH ETEEH"} x={3} y={3} z={-3} width={4} height={6}/>
      <HeaderBlob text={"WHY ARE TEETH SO FUCKING CREEPY"} x={5} y={3} z={-3} width={10} height={20}/>
      <HeaderBlob text={"HOW MANY TEETH DO YOU HAVE"} dynamic={true} x={-5} y={5} z={1} width={15} height={2}/>
      <HeaderBlob text={"ARE YOU AFRAID OF TEETH"} x={-1} y={3} z={-1} width={5} height={5}/>
      <HeaderBlob text={"WHY ARE TEETH SO FUCKING CREEPY"} x={5} y={3} z={-1} width={20} height={20}/>
    </>
  )
}
