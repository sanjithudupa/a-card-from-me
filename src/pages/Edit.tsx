import React, { Suspense, useEffect, useState } from 'react';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';

import CardSchema from "../schema/card";
import Editor from "../components/Editor";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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
        else
          history.push("/")
      });
      // getData()
      console.log(card);
    }, [])

    // if(user) {
      return (
        <div>
          <h1>{id}</h1>

          {
            card.id != "NULL_ID" ?

              <div>
                <h2>
                  {card.displayName}
                </h2> 
                
                <Editor objects={card.objects}/>
              </div>
              :

              <div>
                <h1>Loading Editor...</h1>
                <img src="https://media4.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"></img>
                <p>
                  If you think error has ocurred, please try signing in again.
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