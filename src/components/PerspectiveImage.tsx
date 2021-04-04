import { createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    perspective: {
        transition: "box-shadow 0.1s, transform 0.1s;",
        border: "10px black",

        '&:hover': {
            boxShadow: "0px 0px 60px rgba(0,0,0, 0.2)",
            cursor: "pointer"
        }
    }
  }),
);


const PerspectiveImage:React.FC<{src: string, oid:string}> = ({src, oid}) => {
    const classes = useStyles();

    useEffect(() => {
        const el = document.getElementById(oid);
        
        if(!el)
            return;
        
        const height = el.clientHeight
        const width = el.clientWidth

        /*
        * Add a listener for mousemove event
        * Which will trigger function 'handleMove'
        * On mousemove
        */
        el.addEventListener('mousemove', handleMove)

        /* Define function a */
        function handleMove(e:any) {
            /*
                * Get position of mouse cursor
                * With respect to the element
                * On mouseover
                */
            /* Store the x position */
            const xVal = e.layerX
            /* Store the y position */
            const yVal = e.layerY
            
            /*
            * Calculate rotation valuee along the Y-axis
            * Here the multiplier 20 is to
            * Control the rotation
            * You can change the value and see the results
            */
            const yRotation = 20 * ((xVal - width / 2) / width)
            
            /* Calculate the rotation along the X-axis */
            const xRotation = -20 * ((yVal - height / 2) / height)
            
            /* Generate string for CSS transform property */
            const string = 'perspective(500px) scale(1.1) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'
            
            /* Apply the calculated transformation */
            el!.style.transform = string
        }

        /* Add listener for mouseout event, remove the rotation */
        el.addEventListener('mouseout', function() {
            el.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)'
        })

        /* Add listener for mousedown event, to simulate click */
        el.addEventListener('mousedown', function() {
            el.style.transform = 'perspective(500px) scale(0.9) rotateX(0) rotateY(0)'
        })

        /* Add listener for mouseup, simulate release of mouse click */
        el.addEventListener('mouseup', function() {
            el.style.transform = 'perspective(500px) scale(1.1) rotateX(0) rotateY(0)'
        })
    }, []);

    return (
        <img src={src} id={oid} className={classes.perspective} />
    )
}

export default PerspectiveImage;