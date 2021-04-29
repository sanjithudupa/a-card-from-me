import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Euler, EventHandlers, Layers, Matrix4, Node, NonFunctionKeys, Quaternion, useFrame, useThree, Vector3 } from 'react-three-fiber';
import { PerspectiveCamera } from 'three';
import Image from "../components/Image"

const Camera: React.FC<{position:number[], rotation:number[]}> = ({position, rotation}) => {
    const ref = useRef()
    const { setDefaultCamera } = useThree()
    // Make the camera known to the system
    useEffect(() => void setDefaultCamera(ref.current!), [])
    // Update it every frame 
    // @ts-ignore
    useFrame(() => ref.current!.updateMatrixWorld())
    return <perspectiveCamera ref={ref} position={position} rotation={rotation} />
}

function App() {

    useEffect(() => {
        const video = document.getElementById("feed")! as HTMLVideoElement;
        const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;

        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');

        
        /* Setting up the constraint */
        var facingMode = "environment"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
        var constraints = {
            audio: false,
            video: {
                facingMode: facingMode
            }
        };
        
        /* Stream it to video element */
        navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
            video.srcObject = stream;
        });
        
        video.height = window.innerHeight;
        canvas.width = video.clientWidth;
        canvas.height = video.height;

        setInterval(() => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }, 1000 / 30)


        // setTimeout(() => {
        //     setInterval(() => {
        //         setCam(cam + 0.1);
        //     }, 100)
        // }, 6000)


    }, []);

    return (
        <div style={{overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Canvas style={{position: "absolute", zIndex: 0}} camera={{position: [0, 0, 10]}}>
                <Camera position={[0, 0, 10]} rotation={[0, 0, 0]}/>
                <Image src="https://i.kym-cdn.com/photos/images/facebook/000/352/246/937.png" position={[0, 0, 0]}></Image>
            </Canvas>
            <canvas id="canvas" style={{position: "absolute", zIndex: -1}}></canvas>
            <video id="feed"></video>
        </div>
    );
}

export default App;