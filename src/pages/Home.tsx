import React, { Suspense, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, Fade, Backdrop, Modal, Fab, AppBar, IconButton, Toolbar, Typography, Tooltip } from '@material-ui/core';
import { Menu as MenuIcon } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import logo from "../assets/logo.png";
import create from "../assets/how_it_works/create.png";
import rotateTranslate from "../assets/how_it_works/rotate_translate.gif";
import addText from "../assets/how_it_works/addtext.gif";
import addImage from "../assets/how_it_works/addimage.gif";
import edit from "../assets/how_it_works/edit.gif";
import saveAndShare from "../assets/how_it_works/saveandshare.gif";

import PerspectiveImage from "../components/PerspectiveImage";

// import withFirebaseAuth from 'react-with-firebase-auth'
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

import "../index.css";
import classes from '*.module.css';

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      fontFamily: "Nunito",
      textAlign: "center"
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    kbd: {
      backgroundColor: "#eee",
      borderRadius: "3px",
      border: "1px solid #b4b4b4",
      boxShadow: "0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset",
      color: "#333",
      // display: "inline-block",
      fontSize: ".85em",
      fontWeight: 700,
      // lineHeight: "1",
      padding: "2px 4px",
      // whiteSpace: "nowrap"
    }
  }),
);

function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loginWithGoogle = () => {
    firebase.auth()
      .signInWithPopup(providers.googleProvider)
      .then((result) => {
        // redirect to dashboard
        history.push("/dashboard");
      }).catch((error) => {
        console.log(error)
      });
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Get Started
      </Button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h1>Welcome!</h1>
            To create a card, you must have an account. 

            <br/>
            <br/>

            <Button variant="contained" color="default" onClick={loginWithGoogle}>
              Sign in with Google
              <div style={{width: 15}}></div>
              <img src="https://google.com/favicon.ico"></img>
            </Button>

            <br/>
            <br/>

            Click outside to dismiss.
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Tooltip title="lol this button doesn't do anything">
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title}>
          ACardFrom.Me
          </Typography>
          
          {
            firebase.auth().currentUser ?
            <Button color="inherit" href="/dashboard">View Dashboard</Button> 
            :
            <Tooltip title="use the 'get started' button at the bottom">
              <Button color="inherit">Login</Button> 
            </Tooltip>
          }
        </Toolbar>
      </AppBar>
      <div style={{textAlign: "center", fontFamily: "Montserrat"}}>
        <h2>Your all-in-one <strong>Augmented Reality Card Suite</strong> </h2>
        <img src={logo} style={{width: "20%"}}/>
        <p>Augmented Reality Cards - The Future of Celebration</p>
        
        <hr style={{width: "50%"}}></hr>

        <h3>How it works:</h3>
        <PerspectiveImage src={create} oid="perspective"></PerspectiveImage>
        <br/>
        <p>Create a card with a nice name.</p>
        
        <br></br>

        <PerspectiveImage src={rotateTranslate} oid="perspective2"></PerspectiveImage>
        <p>Activate Translation controls with <kbd className={classes.kbd}>T</kbd> and Rotation controls with <kbd className={classes.kbd}>R</kbd> </p>

        <br></br>

        <PerspectiveImage src={addText} oid="perspective3"></PerspectiveImage>
        <p>Add Text Objects to your scene...</p>

        <br></br>

        <PerspectiveImage src={addImage} oid="perspective4"></PerspectiveImage>
        <p>...But don't forget images too!</p>

        <br></br>

        <PerspectiveImage src={edit} oid="perspective5"></PerspectiveImage>
        <p>Edit and delete objects as you please.</p>

        <br></br>

        <PerspectiveImage src={saveAndShare} oid="perspective6"></PerspectiveImage>
        <p>Save your card and share the QR Code!.</p>
        
        <br/>

        <TransitionsModal />

        <br/>

        <footer style={{backgroundColor: "#489FB5", color: "white"}}>
          <br/>
          Copyright <span>&#169;</span> 2021 Sanjith Udupa
          <br/>
          What is this? <a href="https://youtube.com/sanjithar" style={{color: "inherit",}}>Explanation</a>
          <br></br>
          This project is open source: <a href="https://github.com/sanjithudupa/a-card-from-me" style={{color: "inherit",}}>Contributions/Issues.</a>
          <br/>
          <br/>
        </footer>
      </div>
    </div>
  );
}

export default App;