import firebase from 'firebase'
import firestore from 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyDBxFr9CexMI5-yvchO-diGgVei8D97MEY",
    authDomain: "konferencje-95600.firebaseapp.com",
    databaseURL: "https://konferencje-95600.firebaseio.com",
    projectId: "konferencje-95600",
    storageBucket: "",
    messagingSenderId: "777474069958",
    appId: "1:777474069958:web:c576fc89dc2c9588060ec7"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  export default firebaseApp.firestore()