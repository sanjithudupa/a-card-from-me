import React, { Suspense } from 'react';
import { ZapparCamera, ImageTracker, ZapparCanvas } from '@zappar/zappar-react-three-fiber';
import targetFile from '../assets/card_logo.zpt'
import sanjith from "../assets/sanjithar.png"
import { MeshProps, useLoader } from 'react-three-fiber'

import Image from "./Image"
import Text from "./Text"

import * as THREE from 'three';
import Font from "../assets/font.json";

import "../index.css"
import ARObject from '../schema/arobject';

const ARCanvas:React.FC<{objects: ARObject[]}> = ({objects}) => {
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
              
          {objects.map((object, i) => {
              // <Text text="hi" position={[0, 0, 0]} rotation={[0, 0, 0]} />
              // const orbit = useRef()
              // const transform = useRef()

              {
                let obj;
                if(object.type == "text")
                    obj = <Text key={i} text={object.value} color="black" rotation={[object.rotation.x * Math.PI/180, object.rotation.z * Math.PI/180, object.rotation.y * Math.PI/180]} position={[object.position.x, object.position.z, object.position.y-5]}></Text>
                else
                    obj = <Image key={i} rotation={[object.rotation.x * Math.PI/180, object.rotation.z * Math.PI/180, object.rotation.y * Math.PI/180]} src={object.value} position={[object.position.x, object.position.z, object.position.y-5]}></Image>
                
                return (
                  <>
                    {obj}
                  </>
                )
              }
            })}


          </Suspense>


        </ImageTracker>
        <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
      </ZapparCanvas>
    );
}

export default ARCanvas;
