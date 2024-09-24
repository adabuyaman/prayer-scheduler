import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCp4vhCKfhIlZbxxuFT7qbucHSMaYRq6qI",
    authDomain: "prayer-scheduler-a38d9.firebaseapp.com",
    projectId: "prayer-scheduler-a38d9",
    storageBucket: "prayer-scheduler-a38d9.appspot.com",
    messagingSenderId: "944044517072",
    appId: "1:944044517072:web:7553eb795d09c7278920d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };