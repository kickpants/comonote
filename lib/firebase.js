import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDyrP2IbNVNsY4D6DGG2NLbkmqjrWxpdus",
    authDomain: "comonote-dev-38d5d.firebaseapp.com",
    projectId: "comonote-dev-38d5d",
    storageBucket: "comonote-dev-38d5d.appspot.com",
    messagingSenderId: "934545550252",
    appId: "1:934545550252:web:98338d3d92dbf80796e809",
    measurementId: "G-5N1MSPH9XS"
  };

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const timestamp = firebase.firestore.FieldValue.serverTimestamp();