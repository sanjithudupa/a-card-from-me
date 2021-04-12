import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, extend } from 'react-three-fiber'
import * as THREE from 'three';
import { Sky, TransformControls } from "@react-three/drei";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


import Image from "./CanvasImage";
import Text from "./CanvasText";
import FlatImage from "./Image";

import logo from "../assets/images/card_logo.png"

import ARObject from '../schema/arobject';
import { AppBar, Button, createStyles, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, makeStyles, Modal, Theme, Toolbar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, ListItemSecondaryAction, Snackbar } from '@material-ui/core';

import { Inbox as InboxIcon, Mail as MailIcon, CancelOutlined as CancelIcon, Image as ImageIcon, TextFields as TextIcon, Edit as EditIcon, Save as SaveIcon, Send as ShareIcon } from "@material-ui/icons"
import { useHistory } from 'react-router-dom';
import CardSchema from '../schema/card';
import ReactToPrint from "react-to-print";

import Transition from "./Transition"
import truncate from "../util/truncate";
import getRandomInt from '../util/random';
import sleep from "../util/sleep";

import Constants from "../constants";
import { delay } from 'lodash';
import Share from './SharePopup';

const radToDeg = 180/Math.PI;

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

const Scene: React.FC<{objects: ARObject[], updatePosition: (key: number, x: number, y: number, z: number) => void; updateRotation: (key: number, x: number, y: number, z: number) => void;}> = ({objects, updatePosition, updateRotation}) => {
    const {
        camera,
        gl: { domElement }
    } = useThree()

    console.log(objects[0].type)

    const orbit = useRef()

    const [mode, setMode] = useState("translate");

    const onDown = (e: KeyboardEvent) => {
      if(e.key == "r") {
        setMode("rotate")
      } else if(e.key == "t") {
        setMode("translate")
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', onDown); 

      return () => {
        window.removeEventListener('keydown', onDown);
      };
    });

    return (
        <>
        <Sky  distance={450000} // Camera distance (default=450000)
            sunPosition={[0, 1, 1]} // Sun position normal (defaults to inclination and azimuth if not set)
            inclination={0} // Sun elevation angle from 0 to 1 (default=0)
            azimuth={0.75} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        />
        <ambientLight />
        <orbitControls args={[camera, domElement]} ref={orbit} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[4]} />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
            {objects.map((object, i) => {
              // <Text text="hi" position={[0, 0, 0]} rotation={[0, 0, 0]} />
              // const orbit = useRef()
              // const transform = useRef()

              {
                let obj;
                if(object.type == "text")
                    obj = <Text text={object.value} color="black" orbit={orbit} updatePosition={updatePosition} updateRotation={updateRotation} key={i} idx={i} mode={mode} rotation={[object.rotation.x * Math.PI/180, object.rotation.z * Math.PI/180, object.rotation.y * Math.PI/180]} position={[object.position.x, object.position.z, object.position.y]}></Text>
                else
                    obj = <Image orbit={orbit} updatePosition={updatePosition} updateRotation={updateRotation} key={i} idx={i} mode={mode} rotation={[object.rotation.x * Math.PI/180, object.rotation.z * Math.PI/180, object.rotation.y * Math.PI/180]} src={object.value} position={[object.position.x, object.position.z, object.position.y]}></Image>
                
                return (
                  <>
                    {obj}
                    <FlatImage key={i} rotation={[Math.PI/2, 0, 0]} src={"https://i.kym-cdn.com/photos/images/facebook/000/352/246/937.png"} position={[0, 0, 0]}></FlatImage>
                  </>
                )
              }
            })}

            {/* <Text text="Hello" color="red" ></Text>
            <Image rotation={[Math.PI/2, 0, 0]} src="https://media-exp1.licdn.com/dms/image/C4D0BAQFsG8fmxly5lQ/company-logo_200_200/0/1573213004817?e=2159024400&v=beta&t=bqn4yrcLQvuDkG9pYT9MaWIfbkRet1FyNLFMLpYZE-E"></Image> */}
        
        </Suspense>
        </>
    )
}

const Editor: React.FC<{passedCard: CardSchema, saveCard: (card: CardSchema) => void}> = ({passedCard, saveCard}) => {
    const classes = useStyles();
    const history = useHistory();
    // const [height, setHeight] = useState(773);

    const [card, setCard] = useState<CardSchema>(passedCard)
    const [openCancel, setOpenCancel] = React.useState(false);
    // const [selectedObject, setSelectedObject] = useState(card.objects[0])

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

    const [openEdit, setOpenEdit] = React.useState(false);
    const handleClickOpenEdit = () => {
        setRenameValue(card.objects[selectedIndex].value)
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const [openSave, setOpenSave] = React.useState(false);
    const handleClickOpenSave = () => {
        setOpenSave(true);
    };

    const handleCloseSave = () => {
        setOpenSave(false);
    };

    const [openView, setOpenView] = React.useState(false);
    const handleClickOpenView = () => {
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
    };

    const [renameValue, setRenameValue] = React.useState('');

    const handleRename = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRenameValue((event.target as HTMLInputElement).value);
    };

    const renameObject = () => {
      let newCard = Object.assign({}, card);

      newCard.objects[selectedIndex].value = renameValue;
      setCard(newCard);
    };
    
    const updateReferences = (key: number, scene: THREE.Scene, controls: THREE.Object3D) => {
      let newCard = Object.assign({}, card);

      newCard.objects[selectedIndex].references = {scene: scene, controls: controls}
      setCard(newCard);
    }

    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const [type, setType] = React.useState('text');

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType((event.target as HTMLInputElement).value);
    };

    const [value, setValue] = React.useState('');

    const [codeReady, setCodeReady] = React.useState(false);

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const handlePosRotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const element = event.target as HTMLInputElement;

      let newCard = Object.assign({}, card);

      newCard.objects[selectedIndex][element.id.charAt(0) == "p" ? "position" : "rotation"][element.id.slice(-1) as "x" | "y" | "z"] = +element.value

      setCard(newCard);
    };

    const savePressed = async() => {
      handleCloseSave();
      handleClickOpenView();
      saveCard(card);
      setCodeReady(true);
    }

    const updatePosition = (key: number, x: number, y: number, z: number) => {
      let newCard = Object.assign({}, card);

      newCard.objects[key].position = {x: +x.toFixed(3), y: +z.toFixed(3), z: +y.toFixed(3)}
      setCard(newCard);
    }

    const updateRotation = (key: number, x: number, y: number, z: number) => {
      let newCard = Object.assign({}, card);

      newCard.objects[key].rotation = {x: +(x * radToDeg).toFixed(3), y: +(z * radToDeg).toFixed(3), z: +(y * radToDeg).toFixed(3)}
      setCard(newCard);
    }

    const [snackbar, setSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("text");

    const openSnackbar = (text: string) => {
      setSnackbarText(text)
      setSnackbar(true)
    }

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
        if(card.objects.length >= Constants.MAX_OBJECTS)
          return openSnackbar(`Sorry - scenes can have a maximum of ${Constants.MAX_OBJECTS} objects.`)

        let newCard = Object.assign({}, card);
        newCard.objects.push({
            type: type,
            value: value,
            position: {
                x: +(Math.random() * 2).toFixed(3),
                y: +(Math.random() * 2).toFixed(3),
                z: +(Math.random() * 2).toFixed(3)
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        });

        setCard(newCard);
    }

    // const shareRef = useRef();
    // const handlePrint = useReactToPrint({
    //   content: () => shareRef.current,
    // });

    const printRef = useRef();

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
                <Scene objects={card.objects} updatePosition={updatePosition} updateRotation={updateRotation} />
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
                selected={selectedIndex === index}
                onClick={(event) => handleElementClick(event, index)}
                key={index}
            >
                <ListItemIcon>
                    { object.type == "text" ? 
                        <TextIcon></TextIcon> :
                        <ImageIcon></ImageIcon>
                    }
                </ListItemIcon>
                <ListItemText disableTypography primary={
                  <Typography variant="body2" style={{ textOverflow: "ellipsis" }}>{truncate(object.value, 15)}</Typography>
                } />
                {
                  selectedIndex == index &&
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={handleClickOpenEdit}>
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>                  
                }
            </ListItem>
          ))}
        </List>
        
        <Button variant="contained" color="default" style={{margin: 15}} onClick={handleClickOpenAdd}>
            Add an Object
        </Button>

        <br/>

        <Divider />
        
        <Typography variant="subtitle1" style={{textAlign: "center", margin: 15, textOverflow: "ellipses" }}>
            Editing: <strong>{truncate(card.objects[selectedIndex].value ?? "deleted object", 15)}</strong>
        </Typography>
        
        <Typography variant="caption" style={{textAlign: "center", marginTop: 10}}>
            Position
        </Typography>

        <div style={{margin: 15, marginTop: 0, display: 'flex', flexDirection: 'row', padding: 5}}>
            <TextField
                margin="dense"
                label="X"
                fullWidth
                variant="filled"
                type="number"
                id="px"
                value={card.objects[selectedIndex].position.x}
                onChange={handlePosRotChange}
            />
            <TextField
                margin="dense"
                label="Y"
                fullWidth
                variant="filled"
                type="number"
                id="py"
                value={card.objects[selectedIndex].position.y}
                onChange={handlePosRotChange}
            />
            <TextField
                margin="dense"
                label="Z"
                fullWidth
                variant="filled"
                type="number"
                id="pz"
                value={card.objects[selectedIndex].position.z}
                onChange={handlePosRotChange}
            />

        </div>

        <Typography variant="caption" noWrap style={{textAlign: "center", marginTop: 10}}>
            Rotation
        </Typography>

        <div style={{margin: 15, marginTop: 0, display: 'flex', flexDirection: 'row', padding: 5}}>
            <TextField
                margin="dense"
                label="X"
                fullWidth
                variant="filled"
                type="number"
                id="rx"
                value={card.objects[selectedIndex].rotation.x}
                onChange={handlePosRotChange}
            />
            <TextField
                margin="dense"
                label="Y"
                fullWidth
                variant="filled"
                type="number"
                id="ry"
                value={card.objects[selectedIndex].rotation.y}
                onChange={handlePosRotChange}
            />
            <TextField
                margin="dense"
                label="Z"
                fullWidth
                variant="filled"
                type="number"
                id="rz"
                value={card.objects[selectedIndex].rotation.z}
                onChange={handlePosRotChange}
            />

        </div>

        <Divider />

        <div style={{margin: 0, width: "100%", textAlign: "center"}}>

          <IconButton aria-label="exit" onClick={handleClickOpenSave} style={{width: 63, border: "2px solid rgb(0,0,0,0.1)", display: "inline-block" /*backgroundColor: "white", boxShadow: "0 2 0 3px rgba(0,0,0,0.2)"*/, margin: 9}}>
              <SaveIcon style={{fontSize: 40}} />
          </IconButton>

          <IconButton aria-label="exit" onClick={handleClickOpenView} style={{width: 63, border: "2px solid rgb(0,0,0,0.1)", display: "inline-block" /*backgroundColor: "white", boxShadow: "0 2 0 3px rgba(0,0,0,0.2)"*/, margin: 9}}>
              <ShareIcon style={{fontSize: 40}} />
          </IconButton>

        </div>
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

      {/* Edit dialog */}

      <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">Edit: <strong>{card.objects[selectedIndex].value}</strong></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose to either change the <strong>value</strong> of the object or <strong>delete</strong> it. 
          </DialogContentText>


          <TextField
            autoFocus
            margin="dense"
            label="Update Value"
            fullWidth
            value={renameValue}
            onChange={handleRename}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            if(card.objects.length > 1) {
              let oldIndex = selectedIndex;

              setSelectedIndex(oldIndex > 0 ? oldIndex - 1 : oldIndex + 1);

              card.objects.splice(oldIndex, 1);
              handleCloseEdit();
            } else {
              openSnackbar("Could not delete - need at least one object.")
            }
          }} color="secondary">
            Delete
          </Button>
          <Button onClick={() => {
              renameObject();
              // setValue("");
              // setType("");
              handleCloseEdit();
          }} color="primary">
            Update Value
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={openSave} onClose={handleCloseSave} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">Save project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you would like to save? <strong>This will overwrite your previous version.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSave} color="secondary">
            Cancel
          </Button>
          <Button onClick={savePressed} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={handleCloseView} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">Print: "<strong>{card.displayName}</strong>"</DialogTitle>
        <DialogContent>
          <Share
            // @ts-ignore
            ref={printRef} 
            id={card.id!}
            logo="https://acardfrom.me/static/media/card_logo.2612bc05.png"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} color="primary">
            Close
          </Button>
          <ReactToPrint
            trigger={() => {
              return(
                <Button color="primary">
                  Print
                </Button>
              )
            }}
            content={() => printRef.current! }
          />
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar}
        onClose={() => setSnackbar(false)}
        message={snackbarText}
      />
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

function useReactToPrint(arg0: { content: () => any; }) {
  throw new Error('Function not implemented.');
}
