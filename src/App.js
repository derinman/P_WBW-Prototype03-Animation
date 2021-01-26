import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react'

import * as THREE from 'three'

import { Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import styled from 'styled-components';

import bottle from './resources/gltf/bottleAnimation.glb'
import tree from './resources/gltf/bottleAnimationTree.glb'

const Wrapper = styled.div`
  position: relative;
  height:100vh;
  width: 100vw;
  background: rgba(170,170,170,1);
  overflow: hidden;
`;

//you can apply the mapping Blender (x,y,z) -> glTF(x,z,-y)
//Blender跟gltf的世界座標軸 mapping (x,y,z) -> glTF(x,z,-y)
//Light跟Light_Orientation，Light_Orientation是因為blender匯出gltf坐標軸不同產生的

// Set receiveShadow on any mesh that should be in shadow,
// and castShadow on any mesh that should create a shadow.

const nodeToMesh =(nodes)=>{
  
  //動畫應該寫在這邊
  return(
  nodes.map(
    (data)=>
      
      <mesh
        key={data.name}
        geometry={data.geometry}
        material={data.material}
        position={[data.position.x,data.position.y,data.position.z]}
      />
      
      ))
}

const BottleAnimation = ()=>{
  const gltf = useLoader(GLTFLoader, bottle, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.decoderPath = '/draco-gltf/'
    loader.setDRACOLoader(dracoLoader)
  })

  //console.log(gltf)
  //console.log(nodeToMesh(Object.values(gltf.nodes)))
  
  return(
    <group>
      {nodeToMesh(Object.values(gltf.nodes))}
    </group>
  )
}

const BottleAnimationTree=()=>{
  const gltf = useLoader(GLTFLoader, tree, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.decoderPath = '/draco-gltf/'
    loader.setDRACOLoader(dracoLoader)
  })

  //console.log(gltf)
  const leaf1 = useRef()
  const leaf2 = useRef()
  const leaf3 = useRef()
  const leaf4 = useRef()

  const [mixerLeaf1] = useState(() => new THREE.AnimationMixer())
  const [mixerLeaf2] = useState(() => new THREE.AnimationMixer())
  const [mixerLeaf3] = useState(() => new THREE.AnimationMixer())
  const [mixerLeaf4] = useState(() => new THREE.AnimationMixer())

  useEffect(() => void mixerLeaf1.clipAction(gltf.animations[0], leaf1.current).play(), [gltf.animations, mixerLeaf1])
  useEffect(() => void mixerLeaf2.clipAction(gltf.animations[1], leaf2.current).play(), [gltf.animations, mixerLeaf2])
  useEffect(() => void mixerLeaf3.clipAction(gltf.animations[2], leaf3.current).play(), [gltf.animations, mixerLeaf3])
  useEffect(() => void mixerLeaf4.clipAction(gltf.animations[3], leaf4.current).play(), [gltf.animations, mixerLeaf4])

  useFrame((state, delta) => {
    mixerLeaf1.update(delta *1)
    mixerLeaf2.update(delta *1)
    mixerLeaf3.update(delta *1)
    mixerLeaf4.update(delta *1)
  })
  
  return(
    <group>
      <mesh 
        geometry={gltf.nodes.Trunk1001.geometry}
        material={gltf.nodes.Trunk1001.material}
        position={[gltf.nodes.Trunk1001.position.x,gltf.nodes.Trunk1001.position.y,gltf.nodes.Trunk1001.position.z]}
      />
      <mesh 
        geometry={gltf.nodes.Trunk2001.geometry}
        material={gltf.nodes.Trunk2001.material}
        position={[gltf.nodes.Trunk2001.position.x,gltf.nodes.Trunk2001.position.y,gltf.nodes.Trunk2001.position.z]}
      />
      <mesh 
        geometry={gltf.nodes.Trunk3001.geometry}
        material={gltf.nodes.Trunk3001.material}
        position={[gltf.nodes.Trunk3001.position.x,gltf.nodes.Trunk3001.position.y,gltf.nodes.Trunk3001.position.z]}
      />
      <mesh 
        geometry={gltf.nodes.Trunk4001.geometry}
        material={gltf.nodes.Trunk4001.material}
        position={[gltf.nodes.Trunk4001.position.x,gltf.nodes.Trunk4001.position.y,gltf.nodes.Trunk4001.position.z]}
      />

      <mesh
        ref={leaf1}
        geometry={gltf.nodes.Leaf1001.geometry}
        material={gltf.nodes.Leaf1001.material}
        position={[gltf.nodes.Leaf1001.position.x,gltf.nodes.Leaf1001.position.y,gltf.nodes.Leaf1001.position.z]}
      />
      <mesh
        ref={leaf3}
        geometry={gltf.nodes.Leaf2001.geometry}
        material={gltf.nodes.Leaf2001.material}
        position={[gltf.nodes.Leaf2001.position.x,gltf.nodes.Leaf2001.position.y,gltf.nodes.Leaf2001.position.z]}
      />
      <mesh
        ref={leaf2}
        geometry={gltf.nodes.Leaf3001.geometry}
        material={gltf.nodes.Leaf3001.material}
        position={[gltf.nodes.Leaf3001.position.x,gltf.nodes.Leaf3001.position.y,gltf.nodes.Leaf3001.position.z]}
      />
      <mesh
        ref={leaf4}
        geometry={gltf.nodes.Leaf4001.geometry}
        material={gltf.nodes.Leaf4001.material}
        position={[gltf.nodes.Leaf4001.position.x,gltf.nodes.Leaf4001.position.y,gltf.nodes.Leaf4001.position.z]}
      />
    </group>
  )
}

extend({ OrbitControls })
const Controls = (props) => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}

function App() {
  return (
      <Wrapper>
        <Canvas
          camera={{ position: [0, 0, 18] , fov:50}}
          shadowMap
          colorManagement
        >
          <Controls
            autoRotate
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={1}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          
          <pointLight intensity={1} position={[4, 0, 4]} color={'#fff'} decay={2}/>
          <pointLight intensity={0.7} position={[-4,0, 4]} color={'#fff'} decay={2}/>
          <pointLight intensity={0.7} position={[4, 0, -4]} color={'#fff'} decay={2}/>
          <pointLight intensity={1} position={[-4, 0, -4]} color={'#fff'} decay={2}/>
          
          <pointLight intensity={2} position={[0, -3, 0]} color={'#fff'} decay={2}/>

          <Suspense fallback={null}>
            <BottleAnimation/>
            <BottleAnimationTree/>
          </Suspense>

        </Canvas>
      </Wrapper>
  );
}

export default App;
