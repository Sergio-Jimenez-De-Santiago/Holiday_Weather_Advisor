import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCwsKjamRP5UXJONhT_7RvVnWfvPWn8Xvw",
    authDomain: "holiday-weather-advisor.firebaseapp.com",
    projectId: "holiday-weather-advisor",
    storageBucket: "holiday-weather-advisor.firebasestorage.app",
    messagingSenderId: "475891718535",
    appId: "1:475891718535:web:0f3dd56071abcfdd30db22"
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp }