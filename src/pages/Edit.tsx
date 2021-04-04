import React, { Suspense, useEffect, useState } from 'react';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';

import CardSchema from "../schema/card";
import Editor from "../components/Editor";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { CircularProgress } from '@material-ui/core';

function App() {
    const { id } = useParams<{id: string}>();
    
    const [user, setUser] = useState(firebase.auth().currentUser);
    const history = useHistory();

    const db = firebase.firestore();

    let fetched = false;

    const [card, setCard] = useState<CardSchema>({
      createdAt: undefined,
      displayName: "NULL_CARD",
      owner: "NULL_OWNER",
      objects: [],
      id: "NULL_ID"
    });

    async function saveCard(card: CardSchema) {
      await db.collection("cards").doc(id).set(
        card,
        {merge: true}
      );
    }

    async function fetchData(user: firebase.User) {
      console.trace("hi")
      const data = await db.collection("cards")
        .where("owner", "==", user!.uid)
        .where(firebase.firestore.FieldPath.documentId(), '==', id)
        .get();
      let count = 0;
      let card_tmp: CardSchema | undefined;
      data.forEach(obj => {
        if (count > 0)
          return;

        card_tmp = obj.data() as CardSchema;
        // card_tmp.id = id;
        
        count++;
      });
      if (card_tmp)
        setCard(card_tmp);
    }

    async function getData() {
      if(fetched)
        return
      console.log(`de ${user}`)
      if(user) {
        fetched = true;
        fetchData(user);
      } else {
        return {};
      }
    }

    

    useEffect(() => {
      firebase.auth().onAuthStateChanged(user => {
        console.log("au")
        if(user) {
          setUser(user)
          fetchData(user)
          // if(!fetched)
            // getData()
        }
        // else
        //   alert(JSON.stringify(firebase.auth()))
      });
      // getData()
      console.log(card);
    }, [])

    // if(user) {
      return (
        <div>
          {
            card.id != "NULL_ID" ?

              <div>
                <Editor passedCard={card} saveCard={saveCard} />
              </div>
              :

              <div style={{textAlign: "center"}}>
                <h1>Loading Editor...</h1>
                <CircularProgress />
                <p>
                  If the editor does not load for some time, you might not own this card or you might not be signed in.
                </p>

                <Link to="/">Return to Home</Link>
              </div>
          }
          
        </div>
      );
    // } else {
    //   return (
    //     <Redirect to="/" />
    //   )
    // }
}

export default App;