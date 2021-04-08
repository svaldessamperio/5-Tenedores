import firebase from "firebase/app";

  var firebaseConfig = {
    apiKey: "AIzaSyDbWSUfHHuiW6Y1IExatX8G8VJIhn-BD04",
    authDomain: "tenedores-cd5b5.firebaseapp.com",
    databaseURL: "https://tenedores-cd5b5.firebaseio.com",
    projectId: "tenedores-cd5b5",
    storageBucket: "tenedores-cd5b5.appspot.com",
    messagingSenderId: "304115857693",
    appId: "1:304115857693:web:3d9eeef34eed84fbb1c9f4"
  };

  export const firebaseApp = firebase.initializeApp(firebaseConfig);
