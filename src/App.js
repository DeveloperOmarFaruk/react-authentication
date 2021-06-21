import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import validator from 'validator'


firebase.initializeApp(firebaseConfig);


function App() {

   // Authentication Area Start
   const googleProvider = new firebase.auth.GoogleAuthProvider();

   const fbProvider = new firebase.auth.FacebookAuthProvider();

   const [newUser, setNewUser] = useState(false);

   const [user, setUser] = useState({
      isSignedIn: false,
      name: '',
      email: '',
      photo: '',
      password: ''
   })

   const handleSignIn = () => {
      firebase.auth().signInWithPopup(googleProvider)
         .then(result => {
            const { displayName, photoURL, email } = result.user
            const signedInUser = {
               isSignedIn: true,
               name: displayName,
               email: email,
               photo: photoURL
            }

            setUser(signedInUser)
         })

         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = error.credential;
         })
   }


   const handleFbSignIn = () =>{
      firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
      var credential = result.credential;
      var user = result.user;
      var accessToken = credential.accessToken;
   })
      .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
   });
   }


   const handleSignOut = () => {
      firebase.auth().signOut()
         .then(result => {
            const signOutUser = {
               isSignedIn: false,
               name: '',
               photo: '',
               email: '',
               error: '',
               success: false
            }
            setUser(signOutUser)
         })

         .catch(error => {
            // An error happened.
         })
   }
   // Authentication Area End



   // Input From Area Start

 


   const handleBlur = (e) =>{
      let isFormValid = true;

      if(e.target.name === 'email'){
         isFormValid = /\S+@\S+\.\S+/.test(e.target.value)
      }

      if(e.target.name === 'password'){
         const isPasswordsValid = e.target.value.length > 6
         const passwordHasNumber = /\d{1}/.test(e.target.value)
         isFormValid = isPasswordsValid && passwordHasNumber
      }
      
      if(isFormValid){
         const newUserInfo = {...user}
         newUserInfo[e.target.name] = e.target.value
         setUser(newUserInfo)
      }
   }



   const handleSubmit = (e) => {
      if(newUser && user.email && user.password){
         firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
         .then(result => {
         const newUserInfo = {...user}
         newUserInfo.error = ''
         newUserInfo.success = true
         setUser(newUserInfo)
         updateUserName(user.name)
         })
         .catch(error => {
         const newUserInfo = {...user}
         newUserInfo.error = error.message
         newUserInfo.success = false
         setUser(newUserInfo)
   });
      }

      if(!newUser && user.email && user.password){
         firebase.auth().signInWithEmailAndPassword(user.email, user.password)
         .then((result) => {
            const newUserInfo = {...user}
            newUserInfo.error = ''
            newUserInfo.success = true
            setUser(newUserInfo)
         })
         .catch((error) => {
            const newUserInfo = {...user}
            newUserInfo.error = error.message
            newUserInfo.success = false
            setUser(newUserInfo)
         });
      }

      e.preventDefault()
   }


   const updateUserName = (name) =>{
      const user = firebase.auth().currentUser;

      user.updateProfile({
      displayName: name
      })
      .then(() => {
         console.log('successfully update')
      })
      .catch((error) => {
         console.log('error')
   });
   }




   // const [emailError, setEmailError] = useState([])

   // const [passError, setPassError] = useState([])



   // const validateEmail = (e) => {
   //    const email = e.target.value

   //    if (validator.isEmail(email)) {
   //       setEmailError('Email is Valid')
   //    }

   //    else {
   //       setEmailError('Your Email Not Valid')
   //    }
   // }


   // onChange={(e) => validateEmail(e)} 
   // <span>{emailError}</span>



   // const validatePass = (value) => {
   //    if (validator.isStrongPassword(value, {
   //       minLength: 8,
   //       minLowerCase: 1,
   //       minUpperCase: 1,
   //       minNumbers: 1,
   //       minSymbols: 1
   //    })) {
   //       setPassError('Is Strong Password')
   //    }
   //    else {
   //       setPassError('Is Not Strong Password')
   //    }
   // }


   // onChange={(e) => validatePass(e.target.value)}

   // <span>{passError}</span>

   // Input From Area End

   return (
      <Router>
         <div className="container">
            <h1>React - Authentication</h1>
            {
               user.isSignedIn ? <Button variant="warning" className='sign-in-btn' onClick={handleSignOut}>Sign Out</Button> :
                  <Button variant="warning" className='sign-in-btn' onClick={handleSignIn}>
                     <i className="fab fa-google"></i> Sign In</Button>
            }

                  <Button 
                  variant="warning" 
                  className='sign-in-btn' 
                  onClick={handleFbSignIn}>
                  <i className="fab fa-facebook-f"></i> Sign In</Button>
            {
               user.isSignedIn && <div className='info'>
                  <p>Welcome, {user.name}</p>
                  <p>Your email: {user.email}</p>
                  <img src={user.photo} alt='' className='image' />
               </div>
            }

            <h2>Our own Authentication</h2>

            <div className="user-permission">
            <input 
            className="user-permission-input" 
            type='checkbox' 
            name='newUser' 
            id=''
            onChange={() => setNewUser(!newUser)}/>
            <label htmlFor="newUser">New User Sign up</label>
            </div>
{/* 
            <h3>Name: {user.name}</h3>

            <h3>Email: {user.email}</h3>

            <h3>Password: {user.password}</h3> */}

            <form onSubmit={handleSubmit}>

            {
               newUser &&
               <input
               name='name'
               type='text'
               placeholder='Enter your Full Name...'
               required
               onBlur={handleBlur}/>
            }
               <br/><br />

               <input
                  name='email'
                  type='text'
                  placeholder='Enter your email...'
                  required
                  onBlur={handleBlur}/>
               <br/><br />


               <input
                  name='password'
                  type='password'
                  placeholder='Enter your password...'
                  required
                  onBlur={handleBlur}/>
               <br/><br/>


               <input type='submit' value={newUser ? 'Sign Up' : 'Sign In'} /><br/>
               <span>{user.error}</span>
               {user.success && <span style={{color: 'green'}}>User {newUser ? "Created" : "Logged In"} Successfully</span>}
            </form>
            
         </div>
      </Router>
   );
}
export default App;







