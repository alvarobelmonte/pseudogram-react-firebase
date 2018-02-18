import React, { Component } from "react";
import firebase from "firebase";

import FileUpload from "./FileUpload";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      pictures: [],
      uploadValue: 0
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user: user
      });
    });

    firebase
      .database()
      .ref("pictures")
      .on("child_added", snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });
      });
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} has login`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(result => console.log(`${result.user.email} logged out`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/photos/${file.name}`);
    const task = storageRef.put(file);

    task.on(
      "state_changed",
      snapshot => {
        let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        this.setState({
          uploadValue: percentage
        });
      },
      error => {
        console.log(error.message);
      },
      () => {
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL
        };

        const dbRef = firebase.database().ref("pictures");
        const newPicture = dbRef.push();
        newPicture.set(record);
      }
    );
  }

  renderLoginButton() {
    //Si usuario esta logueado
    if (this.state.user) {
      return (
        <div>
          <img
            class="App-profile"
            src={this.state.user.photoURL}
            alt={this.state.user.displayName}
          />

          <p>{this.state.user.displayName}</p>
          <button class="App-btn" onClick={this.handleLogout}>
            Exit
          </button>

          <FileUpload
            onUpload={this.handleUpload}
            uploadValue={this.state.uploadValue}
          />
          <div class="App-container">
            {this.state.pictures
              .map(picture => (
                <div className="App-card">
                  <figure className="App-card-image">
                    <img width="320" src={picture.image} />
                    <figCaption className="App-card-footer">
                      <img
                        className="App-card-avatar"
                        src={picture.photoURL}
                        alt={picture.displayName}
                      />
                      <span className="App-card-name">
                        {picture.displayName}
                      </span>
                    </figCaption>
                  </figure>
                </div>
              ))
              .reverse()}
          </div>
        </div>
      );
    } else {
      //Si no lo esta
      return (
        <button class="App-btn" onClick={this.handleAuth}>
          Login with Google
        </button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pseudogram</h1>
        </header>
        <p className="App-intro">{this.renderLoginButton()}</p>
      </div>
    );
  }
}

export default App;
