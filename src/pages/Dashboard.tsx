import React, { Suspense, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { AppBar, Button, Toolbar, Typography, Card, CardActions, CardContent, makeStyles, Fab, ListItemAvatar } from '@material-ui/core';
import { Add as AddIcon } from "@material-ui/icons";
import { useHistory, Link } from 'react-router-dom';
import CardSchema from '../schema/card';

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  }
});

const ProjectCard:React.FC<{title: string, timestamp: Date, id: string}> = ({title, timestamp, id}) => {
  const classes = useStyles();
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
          <Button variant="contained" color="default" href={`/edit/${id}`}>
            Open
          </Button>
          <Button variant="contained" color="primary">
            Share
          </Button>
          <Button variant="contained" color="secondary">
            Delete
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

function CardList() {
  const user = (firebase.auth().currentUser);
  const db = firebase.firestore();

  const [cards, setCards] = useState<CardSchema[]>([]);

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
        <ProjectCard title={item.displayName} timestamp={item.createdAt!.toDate()} id={item.id}></ProjectCard>
      )}
    </div>
  )
}

function App() {
  const user = (firebase.auth().currentUser);

  const history = useHistory();
  
  function signOut() {
    firebase.auth().signOut();
    history.push("/");
    return;
  }

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
                <Fab color="primary" aria-label="add">
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