import { createContext, createRef, useContext } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSphere, useBox, useConeTwistConstraint } from '@react-three/cannon'
import { useFBX } from '@react-three/drei'

const parent = createContext(createRef())

const ChainLink = ({ children }) => {
  const parentRef = useContext(parent)
  const chainSize = [0.1, .5, 0.1]
  const [ref] = useBox(() => ({
    mass: 1,
    linearDamping: 0.8,
    args: chainSize,
  }))
  useConeTwistConstraint(parentRef, ref, {
    pivotA: [0, -chainSize[1] / 2, 0],
    pivotB: [0, chainSize[1] / 2, 0],
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    twistAngle: 0,
    angle: Math.PI / 8,
  })
  const fbx = useFBX("tooth.fbx");
  return (
    <>
      <mesh ref={ref}>
        {/* <cylinderBufferGeometry args={[chainSize[0], chainSize[0], chainSize[1], 8]} /> */}
        <primitive object={fbx} scale={0.004} /> 
        <meshStandardMaterial />
      </mesh>
      <parent.Provider value={ref}>{children}</parent.Provider>
    </>
  )
}

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

const ChainScene = () => {
  return (
    // <Canvas shadows camera={{ position: [0, 5, 20], fov: 50 }}>
    //   <color attach="background" args={['#171720']} />
    //   <ambientLight intensity={0.5} />
    //   <pointLight position={[-10, -10, -10]} />
    //   <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
    //   <Physics gravity={[0, -40, 0]} allowSleep={false}>
        <Handle radius={0.2}>
          <ChainLink>
            <ChainLink>
              <ChainLink>
                <ChainLink>
                  <ChainLink>
                    <ChainLink>
                      <ChainLink />
                    </ChainLink>
                  </ChainLink>
                </ChainLink>
              </ChainLink>
            </ChainLink>
          </ChainLink>
        </Handle>
    //   </Physics>
    // </Canvas>
  )
}

export default ChainScene