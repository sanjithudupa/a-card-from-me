import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, extend } from 'react-three-fiber'
import * as THREE from 'three';
import { Sky } from "@react-three/drei";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Image from "./Image";
import Text from "./Text";
import ARObject from '../schema/arobject';
import { AppBar, Button, createStyles, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Modal, Theme, Toolbar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';

import { Inbox as InboxIcon, Mail as MailIcon, CancelOutlined as CancelIcon, Image as ImageIcon, TextFields as TextIcon } from "@material-ui/icons"
import { useHistory } from 'react-router-dom';
import CardSchema from '../schema/card';

import Transition from "./Transition"

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

const Editor: React.FC<{passedCard: CardSchema}> = ({passedCard}) => {
    const classes = useStyles();
    const history = useHistory();
    // const [height, setHeight] = useState(773);

    const [card, setCard] = useState<CardSchema>(passedCard)
    const [openCancel, setOpenCancel] = React.useState(false);

    const handleClickOpenCancel = () => {
        setOpenCancel(true);
    };

    const handleCloseCancel = () => {
        setOpenCancel(false);
    };

    const [openAdd, setOpenAdd] = React.useState(false);

    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const [type, setType] = React.useState('text');

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType((event.target as HTMLInputElement).value);
    };

    const [value, setValue] = React.useState('');

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        // setHeight(window.innerHeight);

        // window.addEventListener("resize", () => {
        //     setHeight(window.innerHeight);
        // })

        document.body.style.height = "100%"
        document.body.style.margin = "0"
    }, []);

    const handleElementClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    const addObject = () => {
        let newCard = Object.assign({}, card);
        newCard.objects.push({
            type: type,
            value: value,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        });

        setCard(newCard);
    }

    return (
        <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
              {card.displayName}      
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar} />


        <div style={{height: window.innerHeight, zIndex: 5}}>
            <Canvas onCreated={state => state.gl.setClearColor("#ebe8e8")}>
                <Scene objects={card.objects} />
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

        <IconButton aria-label="exit" style={{alignSelf: "flex-end"}} onClick={handleClickOpenCancel}>
            <CancelIcon style={{fontSize: 30}} />
        </IconButton>

        <div className={classes.toolbar} />
        
        <Divider />
        <List>
          {card.objects.map((object, index) => (
            <ListItem
                button
                selected={selectedIndex === 0}
                onClick={(event) => handleElementClick(event, 0)}
                key={index}
            >
                <ListItemIcon>
                    { object.type == "text" ? 
                        <TextIcon></TextIcon> :
                        <ImageIcon></ImageIcon>
                    }
                </ListItemIcon>
                <ListItemText primary={object.value} />
            </ListItem>
          ))}
        </List>
        
        <Button variant="contained" color="default" style={{margin: 15}} onClick={handleClickOpenAdd}>
            Add an Object
        </Button>

        <br/>

        <Divider />
        
        <Typography variant="subtitle1" noWrap style={{textAlign: "center", margin: 15 }}>
            Object: {card.objects[selectedIndex-1].value}
        </Typography>
        
        <Typography variant="caption" noWrap style={{textAlign: "center", marginTop: 10}}>
            Position
        </Typography>

        <div style={{margin: 15, marginTop: 0, display: 'flex', flexDirection: 'row', padding: 5}}>
            <TextField
                autoFocus
                margin="dense"
                label="X"
                fullWidth
                variant="outlined"
                // value={value}
                // onChange={handleValueChange}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Y"
                fullWidth
                variant="outlined"
                // value={value}
                // onChange={handleValueChange}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Z"
                fullWidth
                variant="outlined"
                // value={value}
                // onChange={handleValueChange}
            />

        </div>

        <Typography variant="caption" noWrap style={{textAlign: "center", marginTop: 10}}>
            Rotation
        </Typography>

        <div style={{margin: 15, marginTop: 0, display: 'flex', flexDirection: 'row', padding: 5}}>
            <TextField
                autoFocus
                margin="dense"
                label="X"
                fullWidth
                variant="outlined"
                // value={value}
                // onChange={handleValueChange}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Y"
                fullWidth
                variant="outlined"
                // value={value}
                // onChange={handleValueChange}
            />
            <TextField
                autoFocus
                margin="dense"
                label="Z"
                fullWidth
                variant="outlined"
                // value={value}
                // onChange={handleValueChange}
            />

        </div>

        <Divider />

        <Button variant="contained" color="secondary" style={{margin: 15}}>
            Save
        </Button>
      </Drawer>


    {/* close dialog */}
      <Dialog
        open={openCancel}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseCancel}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Exit design?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you would like to exit your design? Confirm that it is saved before you go.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel} color="primary">
            No, don't exit
          </Button>
          <Button onClick={() => {
              handleCloseCancel()
              setTimeout(() => history.push("/dashboard"), 500)            
          }} color="secondary">
            Exit
          </Button>
        </DialogActions>
      </Dialog>

      {/* add dialog */}

      <Dialog open={openAdd} onClose={handleCloseAdd} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">Add an Object</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create an element, first choose what <strong>type</strong> of object you want(text or image), then specify the respective value (image address or text).
          </DialogContentText>

          <FormControl component="fieldset">
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup aria-label="gender" name="type" value={type} onChange={handleTypeChange}>
                <FormControlLabel value="image" control={<Radio />} label="Image" />
                <FormControlLabel value="text" control={<Radio />} label="Text" />
            </RadioGroup>
        </FormControl>

          <TextField
            autoFocus
            margin="dense"
            label="Value"
            fullWidth
            value={value}
            onChange={handleValueChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
              addObject();
              setValue("");
              setType("");
              handleCloseAdd();
          }} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
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