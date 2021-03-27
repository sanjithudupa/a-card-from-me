import React, { Suspense } from 'react';
import { ZapparCamera, ImageTracker, ZapparCanvas } from '@zappar/zappar-react-three-fiber';
import targetFile from '../assets/card_logo.zpt'
import sanjith from "../assets/sanjithar.png"
import { MeshProps, useLoader } from 'react-three-fiber'

import Image from "./Image"
import Text from "./CanvasText"

import * as THREE from 'three';
import Font from "../assets/font.json";

import "../index.css"

function ARCanvas() {
    return (
      <ZapparCanvas>
        <ZapparCamera rearCameraMirrorMode="none" />
        <ImageTracker
          onNotVisible={(anchor) => console.log(`Not visible ${anchor.id}`)}
          onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
          onVisible={(anchor) => console.log(`Visible ${anchor.id}`)}
          targetImage={targetFile}
        >

          <Suspense fallback={null}>
              
            <Image src={sanjith} position={[0, 0, -5]}></Image>
            {/* <gridHelper args={[10, 10]} position={[0, 0, -5]} /> */}
            {/* <Text position={[0, 0, -4]}></Text> */}


          </Suspense>


        </ImageTracker>
        <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
      </ZapparCanvas>
    );
}

export default ARCanvas;
