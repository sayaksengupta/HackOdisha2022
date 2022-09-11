import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import  Axios  from 'axios';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNgK2hGTPQKq3tXZtfDMzmnIbhHzYMDkk",
  authDomain: "auth-4bd0f.firebaseapp.com",
  projectId: "auth-4bd0f",
  storageBucket: "auth-4bd0f.appspot.com",
  messagingSenderId: "462931069141",
  appId: "1:462931069141:web:eb1d0d60777917aeadba5c"
};

const credCheck = async function(res){
    
    const result = await Axios.post('https://devmeet-server.herokuapp.com/login-with-google',{
            email : res.user.email
    }).catch((e) => {
        alert("Please Register.");
    });
    if(result){
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user_info", JSON.stringify(result.data.user));
        window.open("/","_self");
        console.log(result);
    }else{
       window.open("/signup", "_self");
    }
}



export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const storage = getStorage();


const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
    signInWithPopup(auth,provider).then((res) => {
        credCheck(res);
        console.log(res.user.email);
    }).catch((e) => {
        console.log(e);
    })
}