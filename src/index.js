import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

firebase.initializeApp({
  apiKey: "AIzaSyBIZapx8iuG5JStPJh9evZsXa57P3bbhdU",
  authDomain: "pseudogram-abe2f.firebaseapp.com",
  databaseURL: "https://pseudogram-abe2f.firebaseio.com",
  projectId: "pseudogram-abe2f",
  storageBucket: "pseudogram-abe2f.appspot.com",
  messagingSenderId: "1018898597568"
});

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
