import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, extend } from 'react-three-fiber'
import * as THREE from 'three';
import { Sky } from "@react-three/drei";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Image from "./Image";
import Text from "./Text";
import ARObject from '../schema/arobject';
import { AppBar, createStyles, CssBaseline, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';

import { Inbox as InboxIcon, Mail as MailIcon } from "@material-ui/icons"

extend({ OrbitControls })

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default
    },
  }),
);

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
    const classes = useStyles();
    // const [height, setHeight] = useState(773);

    useEffect(() => {
        // setHeight(window.innerHeight);

        // window.addEventListener("resize", () => {
        //     setHeight(window.innerHeight);
        // })

        document.body.style.height = "100%"
        document.body.style.margin = "0"
    }, [])

    return (
        <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div style={{height: window.innerHeight, zIndex: 5}}>
            <Canvas onCreated={state => state.gl.setClearColor("#ebe8e8")}>
                <Scene objects={objects} />
            </Canvas>
        </div>
      </main>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right"
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
        // <div>
        //     {/* options */}
        //     <Drawer>

        //     </Drawer>

        //     {/* editor */}
        //     <div style={{height: window.innerHeight, zIndex: 5}}>
        //         <Canvas onCreated={state => state.gl.setClearColor("#ebe8e8")}>
        //             <Scene objects={objects} />
        //         </Canvas>
        //     </div>
        // </div>
    )
}

export default Editor;