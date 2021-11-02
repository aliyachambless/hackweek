import { createContext, createRef, useContext, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSphere, useBox, useConeTwistConstraint } from '@react-three/cannon'
import { useFBX } from '@react-three/drei'

const parent = createContext(createRef())

const Handle = ({ children, radius }) => {
  const [ref, { position }] = useSphere(() => ({ type: 'Static', args: [radius], position: [0, 0, 0] }))
  useFrame(({ mouse: { x, y }, viewport: { height, width } }) =>
    position.set((x * width) / 2, (y * height) / 2, 0),
  )
  return (
    <group>
      <mesh ref={ref}>
        <sphereBufferGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial />
      </mesh>
      <parent.Provider value={ref}>{children}</parent.Provider>
    </group>
  )
}

const Pointer = (props) => {
  const [teeth, setTeeth] = useState([])
  const parentRef = useContext(parent);
  console.log(parentRef)

  let createTeeth = (numChildren) => {
    // console.log(parentRef)
    return <ChainLink size={0.002} parentRef={parentRef} />
  }

  let ChainLink = (props) => {
    console.log(props.numChildren);
    const chainSize = [0.1, Math.random() / 3 + 0.2, 0.1]
    const [ref] = useBox(() => ({
      mass: 1,
      linearDamping: 0.8,
      args: chainSize,
    }))
    // teethRefs.append(ref);
  
    const [, , constraintApi] = useConeTwistConstraint(props.parentRef, ref, {
      pivotA: [0, -chainSize[1] / 2, 0],
      pivotB: [0, chainSize[1] / 2, 0],
      axisA: [0, 1, 0],
      axisB: [0, 1, 0],
      twistAngle: 0,
      angle: Math.PI / 8,
    })
  
    const fbx = useFBX("tooth.fbx");
  
    let children;
    if (props.numChildren > 0) {
      children = <ChainLink size={props.size*0.9} numChildren={props.numChildren - 1} />
    } else {
      constraintApi.disable()
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
  }

  return (
    <Handle radius={0}>
      {createTeeth()}
    </Handle>
  )
}

export default Pointer