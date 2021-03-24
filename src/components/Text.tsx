import React, { Suspense } from 'react';
import { MeshProps, useLoader } from 'react-three-fiber'


import * as THREE from 'three';
import Font from "../assets/font.json";

interface TextProps extends MeshProps {
  text: string; 
  color?: string;
}

const Text: React.FC<TextProps> = (textProps) => {
  const font = new THREE.FontLoader().parse(Font);

  const { text, color, ...meshProps} = textProps;

  const textOptions = {
    font,
    size: 0.5,
    height: 0.01,
  };

  return (
    <mesh
      {...meshProps}>
      <textGeometry attach='geometry' args={[text, textOptions]} />
      <meshStandardMaterial color={color ?? "black"} />
    </mesh>
  )
}

export default Text;