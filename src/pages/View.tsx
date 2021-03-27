import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import CardSchema from "../schema/card";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { CircularProgress } from '@material-ui/core';
import ARCanvas from '../components/ARCanvas';

function View() {
    const { id } = useParams<{id: string}>();

    const db = firebase.firestore();

    const [card, setCard] = useState<CardSchema>({
        createdAt: undefined,
        displayName: "NULL_CARD",
        owner: "NULL_OWNER",
        objects: [],
        id: "NULL_ID"
    });

    async function fetchData() {
        console.trace("hi")
        const data = await db.collection("cards")
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

    useEffect(() => {
        fetchData()
        console.log(card)
    }, [])

    return ( 
    <div style={{height: window.innerHeight}}>
        <ARCanvas />
    </div>
        
    //   <div>
    //     {
    //         card.id == "NULL_ID" ?
    //         // <div style={{height: window.innerHeight, position: "relative"}}>
    //             <div style={{textAlign: "center"}}>
    //                 <h1>Loading</h1>
    //                 <CircularProgress />
    //             {/* </div>  */}
    //         </div> :

    //         <ARCanvas></ARCanvas>
    //     }
    //   </div>
    );
}

export default View;