import React, { useEffect, useRef } from "react";
import Text from "./Text";
import Image from "./Image";
import ARObject from "../schema/arobject";
import ReactThree, { Sky, TransformControls } from "@react-three/drei";

const Object:React.FC<{object: ARObject, i: number}> = ({object, i}) => {

    const orbit = useRef()
    const transform = useRef()

    // useEffect(() => {
    //     if (transform.current) {
    //         const controls:any = transform.current!
    //         const orbitC:any = orbit.current!

    //         controls.setMode("translate")
    //         const callback = (event:any) => (orbitC.enabled = !event.value)
    //         controls.addEventListener("dragging-changed", callback)
    //         return () => controls.removeEventListener("dragging-changed", callback)
    //     }
    // })

    // let obj;
    // if(object.type == "text") {
    //     obj = <Text text={object.value} color="black" key={i} rotation={[object.rotation.x * Math.PI/180, object.rotation.z * Math.PI/180, object.rotation.y * Math.PI/180]} position={[object.position.x, object.position.z, object.position.y]}></Text>
    // } else {
    //     obj = <Image key={i} rotation={[object.rotation.x * Math.PI/180, object.rotation.z * Math.PI/180, object.rotation.y * Math.PI/180]} src={object.value} position={[object.position.x, object.position.z, object.position.y]}></Image>
    // }

    console.log("hiii")

    return (
        <>
        </>
        // <Text text="hi" />
    )
}

export default Object;