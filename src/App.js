import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react'

import * as THREE from 'three'

import { Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import styled from 'styled-components';

import gltf from './resources/gltf/bottleAnimation.glb'

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


const BottleAnimation = ()=>{
  const {nodes} = useLoader(GLTFLoader, gltf, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.decoderPath = '/draco-gltf/'
    loader.setDRACOLoader(dracoLoader)
  })

  console.log(nodes)

  return(
    <group>
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
          camera={{ position: [0, 0, 40] , fov:50}}
          shadowMap
          colorManagement
        >
          <Controls
            //autoRotate
            enablePan={true}
            enableZoom={true}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={1}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          
          <pointLight 
            position={[0,10,0]}
            intensity={0}
          />

          <Suspense fallback={null}>
            <BottleAnimation/>
          </Suspense>

        </Canvas>
      </Wrapper>
  );
}

export default App;
