import * as THREE from 'three';
import {MeshProps, useLoader } from 'react-three-fiber'
import { useMemo, useState } from 'react';

interface ImageProps extends MeshProps {
  src: string;
}

const Image: React.FC<ImageProps> = (imageProps) => {

    const {src, ...meshProps} = imageProps;
    
    const [scaleX, setScaleX] = useState(1)
    const [scaleY, setScaleY] = useState(1)

    const texture:THREE.Texture = useMemo(() => 
      new THREE.TextureLoader().load(src, (texture: THREE.Texture) => {
          const minimum = Math.min(texture.image.width, texture.image.height);
          setScaleX(texture.image.width/minimum);
          setScaleY( texture.image.height/minimum);
      }), 
    []);
    
    return (
      <mesh
        {...meshProps}>
        <boxBufferGeometry args={[scaleX, scaleY, 0.01]} />
        <meshBasicMaterial map={texture} attach="material" />  
      </mesh>
    )
}

export default Image;