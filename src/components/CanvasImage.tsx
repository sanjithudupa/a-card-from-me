import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { MeshProps, useLoader, useThree, } from 'react-three-fiber'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import type { Mesh } from "three"

import * as THREE from 'three';

interface ImageProps extends MeshProps {
  src: string;
  orbit: any;
  updatePosition: (key: number, x: number, y: number, z: number) => void;
  updateRotation: (key: number, x: number, y: number, z: number) => void;
  idx: number,
  mode: string,
}

const Image: React.FC<ImageProps> = (imageProps) => {
  
  const { camera, gl, scene } = useThree();
  const meshRef = useRef<THREE.Mesh>();
  const [transformControl, setTControl] = useState<TransformControls | undefined>();
  
  const { src, orbit, updatePosition, updateRotation, idx, mode, ...meshProps} = imageProps;
  
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)

  const texture:THREE.Texture = useMemo(() => 
    new THREE.TextureLoader().load(src, (texture: THREE.Texture) => {
        const minimum = Math.min(texture.image.width, texture.image.height);
        setScaleX(texture.image.width/minimum);
        setScaleY( texture.image.height/minimum);
    }), 
  []);

  useEffect(() => {      
      if (!transformControl && meshRef.current) {
          let transformC = new TransformControls(camera, gl.domElement);
          transformC.attach(meshRef.current);

          // updateReferences(idx, scene, transformC);

          scene.add(transformC);
          setTControl(transformC);
      }

      const callback = (event: any) => {
        orbit.current.enabled = !event.value
        if(meshRef.current) {
          const curMode = mode == "translate";
          const {x, y, z} = meshRef.current[curMode ? "position" : "rotation"];

          if(curMode)
            updatePosition(idx, x, y, z);
          else
            updateRotation(idx, x, y, z);
        }
      }
      
      transformControl?.setMode(mode);
      
      transformControl?.addEventListener("dragging-changed", callback)

      return () =>  {
        transformControl?.removeEventListener("dragging-changed", callback)
        if(!meshRef.current && transformControl)
          scene.remove(transformControl)
      }
      // return () => {
      //     if (transformControl) {
      //         scene.remove(transformControl);
      //         setTControl(undefined);
      //     }
      // };
  }/*, [transformControl, camera, scene, gl]*/);
  

  return (
    <mesh
      {...meshProps}
      ref={meshRef}>
      <boxBufferGeometry args={[scaleX, scaleY, 0.01]} />
      <meshBasicMaterial map={texture} attach="material" />  
    </mesh>
  )
}

export default Image;