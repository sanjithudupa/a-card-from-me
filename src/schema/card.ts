import ARObject from "./arobject";
import firebase from 'firebase/app';

export default interface Card {
    createdAt: firebase.firestore.Timestamp | undefined,
    id: string,
    displayName: string,
    objects: ARObject[],
    owner: string
}