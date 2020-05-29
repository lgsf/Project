import firebase from "firebase";
import firestore from "firebase/firestore"

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDcPbYSZw_pmc6nQl6MTTZ2LUIXwt6Tu_g",
    authDomain: "projectzero-9bff2.firebaseapp.com",
    databaseURL: "https://projectzero-9bff2.firebaseio.com",
    projectId: "projectzero-9bff2",
    storageBucket: "projectzero-9bff2.appspot.com",
    messagingSenderId: "793390803395",
    appId: "1:793390803395:web:6526a11dff48740bb03576"
  };
 const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize Firebase
export default firebaseApp.firestore();