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
    let ctx: CanvasRenderingContext2D
    let video: HTMLVideoElement;
    let canvas: HTMLCanvasElement;

    let detector: any;

    const drawCorners = (markers: any[])  => {
        var corners, corner, i, j;
    
        ctx.lineWidth = 3;

        for (i = 0; i !== markers.length; ++ i){
            corners = markers[i].corners;
            
            ctx.strokeStyle = "red";
            ctx.beginPath();
            
            for (j = 0; j !== corners.length; ++ j){
                corner = corners[j];
                ctx.moveTo(corner.x, corner.y);
                corner = corners[(j + 1) % corners.length];
                ctx.lineTo(corner.x, corner.y);
            }

            ctx.stroke();
            ctx.closePath();
            
            ctx.strokeStyle = "green";
            ctx.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
        }
    }

    const drawId = (markers: any[]) => {
        var corners, corner, x, y, i, j;
        
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        
        for (i = 0; i !== markers.length; ++ i){
            corners = markers[i].corners;
            
            x = Infinity;
            y = Infinity;
            
            for (j = 0; j !== corners.length; ++ j){
                corner = corners[j];
                
                x = Math.min(x, corner.x);
                y = Math.min(y, corner.y);
            }

            ctx.strokeText(markers[i].id, x, y)
        }
    }


    const snapshot = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let markers = detector.detect(imageData);
        drawCorners(markers);
        drawId(markers);
    }

    useEffect(() => {
        video = document.getElementById("feed")! as HTMLVideoElement;
        canvas = document.getElementById('canvas')! as HTMLCanvasElement;
        ctx = canvas.getContext('2d')!;

        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');

        detector = new (window as any).AR.Detector();        
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
            if(video.readyState == video.HAVE_ENOUGH_DATA)
                snapshot();
        }, 1000 / 30);


    }, []);

    return (
        <div style={{overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Canvas style={{position: "absolute", zIndex: 20}} camera={{position: [0, 0, 10]}}>
                <Camera position={[0, 0, 10]} rotation={[0, 0, 0]}/>
                <Image src="https://i.kym-cdn.com/photos/images/facebook/000/352/246/937.png" position={[0, 0, 0]}></Image>
            </Canvas>
            <canvas id="canvas" style={{position: "absolute", zIndex: 10}}></canvas>
            <video id="feed"></video>
        </div>
    );
}

export default App;