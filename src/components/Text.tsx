import * as THREE from 'three';
import {MeshProps, useLoader, useThree } from 'react-three-fiber'
import { useEffect, useMemo, useRef, useState } from 'react';

import Font from "../assets/font.json";
import { TransformControls } from '@react-three/drei';
import { Mesh } from 'three';

interface TextProps extends MeshProps {
    text: string; 
    color?: string;
}

const Text: React.FC<TextProps> = (textProps) => {
    const font = new THREE.FontLoader().parse(Font);

    const meshRef = useRef<Mesh>();
    
    const { text, color, ...meshProps} = textProps;
    
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