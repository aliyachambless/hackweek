import { createContext, createRef, forwardRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSphere, useBox, useConeTwistConstraint } from '@react-three/cannon'
import { useFBX } from '@react-three/drei'

const parent = createContext(createRef())

const Handle = forwardRef((props, ref) => {
  return (
    <group>
      <mesh ref={ref}>
        <sphereBufferGeometry args={[props.radius, 64, 64]} />
        <meshStandardMaterial />
      </mesh>
      <parent.Provider value={ref}>{props.children}</parent.Provider>
    </group>
  )
})

const ChainLink = forwardRef((props, ref) => {
  const fbx = useFBX("tooth.fbx");

  let children;
  if (props.numChildren > 0) {
    children = <ChainLink size={props.size * 0.9} numChildren={props.numChildren - 1} />
  } else {
    props.constraintApi.disable()
  }

  return (
    <>
      <mesh ref={ref}>
        <primitive ref={ref} object={fbx.clone()} scale={props.size} />
        <meshStandardMaterial />
      </mesh>
      {/* <parent.Provider value={ref}>{children}</parent.Provider> */}
    </>
  )
})

const Pointer = (props) => {
  const [teeth, setTeeth] = useState([])

  const [parentRef, { position }] = useSphere(() => ({ type: 'Static', args: [0.1], position: [0, 0, 0] }))
  useFrame(({ mouse: { x, y }, viewport: { height, width } }) =>
    position.set((x * width) / 2, (y * height) / 2, 0),
  )

  // for(let i = 0; i < props.numChildren; i++) {
    const chainSize = [0.1, Math.random() / 3 + 0.2, 0.1]
    const [ref] = useBox(() => ({
      mass: 1,
      linearDamping: 0.8,
      args: chainSize,
    }))
  
    const [, , constraintApi] = useConeTwistConstraint(parentRef, ref, {
      pivotA: [0, -chainSize[1] / 2, 0],
      pivotB: [0, chainSize[1] / 2, 0],
      axisA: [0, 1, 0],
      axisB: [0, 1, 0],
      twistAngle: 0,
      angle: Math.PI / 8,
    })
  // }

  return (
    <Handle radius={0.1} ref={parentRef}>
      <ChainLink size={0.002} ref={ref} constraintApi={constraintApi} />
    </Handle>
  )
}

export default Pointer