import React, { Suspense } from 'react'
import { Canvas, useThree, extend } from 'react-three-fiber'
import * as THREE from 'three';
import { Sky } from "@react-three/drei";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Image from "./Image";
import Text from "./Text";
import ARObject from '../schema/arobject';

extend({ OrbitControls })

const Scene: React.FC<{objects: ARObject[]}> = ({objects}) => {
    const {
        camera,
        gl: { domElement }
    } = useThree()

    console.log(objects[0].type)
    return (
        <>
        <Sky  distance={450000} // Camera distance (default=450000)
            sunPosition={[0, 1, 1]} // Sun position normal (defaults to inclination and azimuth if not set)
            inclination={0} // Sun elevation angle from 0 to 1 (default=0)
            azimuth={0.75} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        />
        <ambientLight />
        <orbitControls args={[camera, domElement]} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[4]} />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
            {objects.map((object, i) => {
                {
                    return object.type == "text" ?
                    <Text text={object.value} color="black" key={i}></Text>
                    :
                    <Image key={i} rotation={[object.rotation.x, object.rotation.y, object.rotation.z]} src={object.value} position={[object.position.x, object.position.z + 5, object.position.y]}></Image>
                }
            })}

            {/* <Text text="Hello" color="red" ></Text>
            <Image rotation={[Math.PI/2, 0, 0]} src="https://media-exp1.licdn.com/dms/image/C4D0BAQFsG8fmxly5lQ/company-logo_200_200/0/1573213004817?e=2159024400&v=beta&t=bqn4yrcLQvuDkG9pYT9MaWIfbkRet1FyNLFMLpYZE-E"></Image> */}
        
        </Suspense>
        </>
    )
}

const Editor: React.FC<{objects: ARObject[]}> = ({objects}) => {
    return (
        <div style={{height: "400px"}}>
            <Canvas onCreated={state => state.gl.setClearColor("#ebe8e8")}>
                <Scene objects={objects} />
            </Canvas>
        </div>
    )
}

export default Editor;