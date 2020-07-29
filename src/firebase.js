import firebase from 'firebase'

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyC6YmizQcfn5plQ_y7fqmQ2l-1Sjlttxcw",
    authDomain: "instagram-clone-a9ccd.firebaseapp.com",
    databaseURL: "https://instagram-clone-a9ccd.firebaseio.com",
    projectId: "instagram-clone-a9ccd",
    storageBucket: "instagram-clone-a9ccd.appspot.com",
    messagingSenderId: "576140979739",
    appId: "1:576140979739:web:95ad9696a8bedf32bc52be",
    measurementId: "G-584WNHB4PX"
})

const db=firebase.firestore();
const auth=firebase.auth();
const storage=firebase.storage();
export {db,auth,storage};