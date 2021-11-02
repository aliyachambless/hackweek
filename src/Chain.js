import { createContext, createRef, forwardRef, useState, useContext, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSphere, useBox, useConeTwistConstraint } from '@react-three/cannon'
import { useFBX } from '@react-three/drei'

const parent = createContext(createRef())

const Handle = (props) => {
  const [ref, { position }] = useSphere(() => ({ 
    type: 'Static', 
    args: [0.1], 
    position: [0, 0, 0] , 
    // onCollide: () => {
    //   props.dropTooth()
    // }
  }))

  useFrame(({ mouse: { x, y }, viewport: { height, width } }) =>
    position.set((x * width) / 2, (y * height) / 2, 0),
  )
  return (
    <group>
      <mesh ref={ref}>
        <sphereBufferGeometry args={[props.radius, 64, 64]} />
        <meshStandardMaterial />
      </mesh>
      <parent.Provider value={ref}>{props.children}</parent.Provider>
    </group>
  )
}

const ChainLink = (props) => {
  const parentRef = useContext(parent)
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

  let children;
  if (props.childNum < props.totalTeeth) {
    console.log("child change")
    children = <ChainLink 
                size={props.size * 0.95} 
                childNum={props.childNum + 1} 
                activeTeeth={props.activeTeeth} 
                totalTeeth={props.totalTeeth} 
                fbx={props.fbx}/>
  }

  useEffect(() => {
    if (props.childNum == props.activeTeeth) {
      constraintApi.disable()
    }
  }, [props.activeTeeth])

  return (
    <>
      <mesh ref={ref}>
        <primitive ref={ref} object={props.fbx.clone()} scale={props.size} />
        <meshStandardMaterial />
      </mesh>
      <parent.Provider value={ref}>{children}</parent.Provider>
    </>
  )
}

const Pointer = (props) => {
  const fbx = useFBX("tooth.fbx");

  const totalTeeth = 5;
  const [activeTeeth, setActiveTeeth] = useState(totalTeeth)

  // useEffect(() => void setTimeout(() => setActiveTeeth(activeTeeth - 1), 2000), [activeTeeth])
  useEffect(() => void setTimeout(() => {
    if(activeTeeth > 2){
      setActiveTeeth(activeTeeth - 1)
    }
  }, 5000), [activeTeeth])

  // useEffect(() => {
  //   setActiveTeeth(activeTeeth)
  // }, [activeTeeth])

  // console.log("b4", activeTeeth);
  // setActiveTeeth(activeTeeth - 1)
  // console.log("after", activeTeeth);

  return (
    <Handle 
      radius={0.07} 
      // dropTooth={() => {
      //   setActiveTeeth((activeTeeth) => (activeTeeth - 1))
      // }}
    >
      <ChainLink fbx={fbx} size={0.002} childNum={1} activeTeeth={activeTeeth} totalTeeth={totalTeeth}/>
    </Handle>
  )
}

export default Pointer