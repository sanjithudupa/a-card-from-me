import React, { Suspense, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Button, Fade, Backdrop, Modal, Fab, AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import logo from "../assets/logo.png";
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
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          ACardFrom.Me
          </Typography>
          {
            firebase.auth().currentUser ?
            <Button color="inherit">View Dashboard</Button> 

            :

            <Button color="inherit">Login</Button> 
          }
        </Toolbar>
      </AppBar>
      <div style={{textAlign: "center", fontFamily: "Montserrat"}}>
        <h2>Your all-in-one <strong>Augmented Reality Card Suite</strong> </h2>
        <PerspectiveImage src={logo} id="perspective"></PerspectiveImage>
        <TransitionsModal />
      </div>
    </div>
  );
}

export default App;