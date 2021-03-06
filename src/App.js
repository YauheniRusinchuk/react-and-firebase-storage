import React, { Component } from 'react';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

const config = {
  apiKey: "AIzaSyAmsFoywn-plqVHn18OunMqFcKBqWLK_eg",
  authDomain: "anonchat-40e92.firebaseapp.com",
  databaseURL: "https://anonchat-40e92.firebaseio.com",
  projectId: "anonchat-40e92",
  storageBucket: "anonchat-40e92.appspot.com",
  messagingSenderId: "817121125187"
};
firebase.initializeApp(config);



class ProfilePage extends Component {
    state = {
      username: '',
      avatar: '',
      isUploading: false,
      progress: 0,
      avatarURL: '',
      images: []
    };


    handleChangeUsername = (event) => this.setState({username: event.target.value});
    handleUploadStart = () => this.setState({isUploading: true, progress: 0});
    handleProgress = (progress) => this.setState({progress});
    handleUploadError = (error) => {
      this.setState({isUploading: false});
      console.error(error);
    }

    handleUploadSuccess = (filename) => {
      this.setState({avatar: filename, progress: 100, isUploading: false});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => {
        const {images} = this.state;
        images.push(url)
        this.setState({
          avatarURL: url,
          images: images
        })
        console.log("IMAGES : ", this.state.images)
      });
    };


    render() {
        return (
            <div>
              <form>
                <label>Username:</label>
                  <input type="text" value={this.state.username} name="username" onChange={this.handleChangeUsername} />
                <label>Avatar:</label>
                {this.state.isUploading &&
                    <p>Progress: {this.state.progress}</p>
                }
                {
                  this.state.images && this.state.images.map((item,index)=>{
                    return (
                        <div key={index}>
                          <img src={item} />
                        </div>
                    );
                  })
                }

                <FileUploader
                  accept="image/*"
                  name="avatar"
                  randomizeFilename
                  storageRef={firebase.storage().ref('images')}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  onProgress={this.handleProgress}
                  />

              </form>
            </div>
          );
        }
}


export default ProfilePage;
