import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react'

import * as THREE from 'three'

import { Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import styled from 'styled-components';

import bottle from './resources/gltf/bottleAnimation.glb'
import { AmbientLight } from 'three'

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
  const group = useRef()

  const [mixer] = useState(() => new THREE.AnimationMixer())

  useEffect(() => void mixer.clipAction(gltf.animations[0], group.current).play(), [gltf.animations, mixer])

  useFrame((state, delta) => {
    mixer.update(delta *1)
  })
  
  console.log(gltf)
  //console.log(Object.values(gltf.nodes))
  //console.log(nodeToMesh(Object.values(gltf.nodes)))
  
  return(
    <group ref={group}>
      {nodeToMesh(Object.values(gltf.nodes))}
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
            //autoRotate
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
          </Suspense>

        </Canvas>
      </Wrapper>
  );
}

export default App;
