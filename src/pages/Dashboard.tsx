import React, { Suspense, useEffect, useState, useRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { AppBar, Button, Toolbar, Typography, Card, CardActions, CardContent, makeStyles, Fab, ListItemAvatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar } from '@material-ui/core';
import { Add as AddIcon } from "@material-ui/icons";
import { useHistory, Link } from 'react-router-dom';
import CardSchema from '../schema/card';
import Transition from '../components/Transition';
import Share from "../components/SharePopup";

import logo from "../assets/images/card_logo.png"

import ReactToPrint from "react-to-print";

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  }
});

const ProjectCard:React.FC<{title: string, timestamp: Date, id: string, removeCard: Function, onShareClick: Function}> = ({title, timestamp, id, removeCard, onShareClick}) => {
  const classes = useStyles();
  const history = useHistory();

  const db = firebase.firestore();

  const deleteCard = async() => {
    await db.collection("cards").doc(id).delete();
    setSnackbar(true)
  }

  const [snackbar, setSnackbar] = useState(false);

  const openSnackbar = () => {
    setSnackbar(true)
  }
  
  return (
    <div style={{padding: 10}}>
      <Card className={classes.root}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Created on {timestamp.toDateString()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="default" onClick={() => history.push(`/edit/${id}`)}>
            Open
          </Button>
          <Button variant="contained" color="primary" onClick={() => onShareClick()}>
            Share
          </Button>
          <Button variant="contained" color="secondary" onClick={deleteCard}>
            Delete
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbar}
        onClose={() => setSnackbar(false)}
        message={"Deleted project. Reload for changes to take effect."}
      />
    </div>
  )
}

function CardList() {
  const user = (firebase.auth().currentUser);
  const db = firebase.firestore();

  const [cards, setCards] = useState<CardSchema[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardSchema>();

  const [openView, setOpenView] = React.useState(false);
  const handleClickOpenView = () => {
      setOpenView(true);
  };

  const handleCloseView = () => {
      setOpenView(false);
  };

  const printRef = useRef();

  const removeCard = (id: string) => {
    let oldCards = cards;
    
    let index = 0;
    oldCards.forEach(oldCard => {
      if(oldCard.id == id)
        oldCards.splice(index, 1);
      index++
    })
  }

  function getData() {
    if(user) {
      return db.collection("cards")
        .where("owner", "==", user.uid)
        .get()
        .then((querySnapshot) => {
          let cards_tmp: CardSchema[] = [];
          querySnapshot.forEach((doc) => {
              const card_tmp = doc.data() as CardSchema;
              card_tmp.id = doc.id;
              cards_tmp.push(card_tmp);
              console.log("d");
              // setCards(arr => [...arr, doc.data() as CardSchema]);
          });
          
          return cards_tmp
      });
    } else {
      // signOut();
    }
  }

  useEffect(() => {
    let mounted = true;
    getData()!
      .then(data => {
        if(mounted && data) {
          setCards(data)
          console.log("recieved")
          console.log(data)
        }
      })
  }, [])


  return (
    <div>
      {cards.map(item => 
        <ProjectCard title={item.displayName} timestamp={item.createdAt!.toDate()} id={item.id!} removeCard={removeCard} onShareClick={() => {
          setSelectedCard(item)
          handleClickOpenView();
        }}></ProjectCard>
      )}


      {/* View Dialog */}
      <Dialog open={openView} onClose={handleCloseView} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">Print: "<strong>{selectedCard?.displayName}</strong>"</DialogTitle>
        <DialogContent>
          <Share
            // @ts-ignore
            ref={printRef} 
            id={selectedCard?.id!}
            logo={logo}
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
    </div>
  )
}

function App() {
  const user = (firebase.auth().currentUser);
  const db = firebase.firestore();

  const history = useHistory();
  
  function signOut() {
    firebase.auth().signOut();
    history.push("/");
    return;
  }

  const createCard = async (newName: string) => {
    if(!user)
      return history.push("/")

    db.collection("cards").add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: newName,
      objects: [{
        type: "text",
        value: "Hello",
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
      }],
      owner: user.uid
    } as CardSchema).then((document) => {
      const id = document.id;
      db.collection("cards").doc(id).update({
        "id": id
      }).then(() => {
        history.push(`/edit/${id}`)
      })
    })
  }

  const [openCreate, setOpenCreate] = useState(false);
  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const [createValue, setCreateValue] = React.useState('');
  const handleCreateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateValue((event.target as HTMLInputElement).value);
  };

  if(user) {
    return (
        <div>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" >
                Dashboard
              </Typography>
            </Toolbar>
          </AppBar>

          <div style={{padding: 10}}>

            {/* <h2>Signed in as: {user?.displayName}</h2> */}
            
            <h2>{user?.displayName}'s Projects:</h2>

            <hr/>
            
            {/* {renderCards()} */}
            <CardList />
            {/* <ProjectCard title="Project 1" timestamp={new Date()}></ProjectCard>
            <ProjectCard title="Project 1" timestamp={new Date()}></ProjectCard> */}

            <div style={{width: '100%', position: 'fixed', bottom: 90}}>
              {/* <div style={{position: 'fixed', left: 30}}>
                <Button variant="contained" color="secondary" onClick={signOut}>
                  Sign Out
                </Button>
              </div> */}

              <div style={{position: 'fixed', right: 50}}>
                <Fab color="primary" aria-label="add" onClick={handleClickOpenCreate}>
                  <AddIcon />
                </Fab>
              </div>

            </div>


            <div style={{position: "relative", bottom: -20, left: 20, width: "98%"}}>
              <hr></hr>
              <br/>
              <Button variant="contained" color="secondary" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Create dialog */}

          <Dialog open={openCreate} onClose={handleCloseCreate} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
            <DialogTitle id="form-dialog-title">Create a new Card:</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Choose a name for your new card.
              </DialogContentText>

              <TextField
                autoFocus
                margin="dense"
                label="Card Name"
                fullWidth
                value={createValue}
                onChange={handleCreateChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCreate} color="primary">
                Cancel
              </Button>
              <Button onClick={() => {
                createCard(createValue)
              }} color="primary">
                Create
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      );
  } else {
    return (
      <div style={{textAlign: "center"}}>
        <h1>You must be logged in to view your dashboard</h1>
        <Link to="/">Home</Link>
      </div>
    )
  }
}

export default App;