import React, { Suspense, useEffect, useRef, useState } from 'react';
import { MeshProps, useLoader, useThree, } from 'react-three-fiber'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import type { Mesh } from "three"

import * as THREE from 'three';
import Font from "../assets/font.json";

interface TextProps extends MeshProps {
  text: string; 
  color?: string;
  orbit: any;
}

const Text: React.FC<TextProps> = (textProps) => {
  const font = new THREE.FontLoader().parse(Font);
  
  const { camera, gl, scene } = useThree();
  const meshRef = useRef<THREE.Mesh>();
  const [transformControl, setTControl] = useState<TransformControls | undefined>();
  
  const { text, color, orbit, ...meshProps} = textProps;
  
  useEffect(() => {
      if (!transformControl && meshRef.current) {
          let transformC = new TransformControls(camera, gl.domElement);
          transformC.attach(meshRef.current);

          
          scene.add(transformC);
          setTControl(transformC);

      }

      const callback = (event: any) => {
        orbit.current.enabled = !event.value
      }

      
      transformControl?.addEventListener("dragging-changed", callback)

      return () =>  {
        transformControl?.removeEventListener("dragging-changed", callback)
      }
      // return () => {
      //     if (transformControl) {
      //         scene.remove(transformControl);
      //         setTControl(undefined);
      //     }
      // };
  }/*, [transformControl, camera, scene, gl]*/);
  

  const textOptions = {
    font,
    size: 0.5,
    height: 0.01,
  };

  return (
    <mesh
      {...meshProps}
      ref={meshRef}
      >
      <textGeometry attach='geometry' args={[text, textOptions]} />
      <meshStandardMaterial color={color ?? "black"} />
    </mesh>
  )
}

export default Text;