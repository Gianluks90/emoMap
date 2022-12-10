import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, addDoc, GeoPoint } from "firebase/firestore";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, signInAnonymously} from "firebase/auth";
import ParseService from "./parse-service";

export default class FirebaseService {

  FIREBASE_KEYS = {
    apiKey: "AIzaSyASnMtNGmerW903hs1_ioXlNrmH5GG4GTU",
    authDomain: "emomap-261122.firebaseapp.com",
    projectId: "emomap-261122",
    storageBucket: "emomap-261122.appspot.com",
    messagingSenderId: "743599726772",
    appId: "1:743599726772:web:00fcf9d99f548ec6d7f7e1"
  };

  constructor() {
    
    if (FirebaseService._instance) {
      return FirebaseService._instance;
    }
    FirebaseService._instance = this;

    this.app = initializeApp(this.FIREBASE_KEYS);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);

    if(!this.auth.currentUser) {
      signInAnonymously(this.auth).then((user) => {
        console.log('user', user);
        this.auth.setPersistence('local').then(() => {
          console.log('persistence set');
        });
      }).catch((error) => console.log(error));
    
    }
  }


  static instance() {
    return FirebaseService._instance || new FirebaseService();
  }

  get isAuth() {
    return this.auth.currentUser !== null;
  }

  getCodes() {
    const q = query(collection(this.db, "codes"));
    onSnapshot(q, (querySnapshot) => {
      this.dispatchCodes(querySnapshot.docs.map(doc => doc.data()));
    });
  }

  observeAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.dispatchAuthState(true, user);
      } else {
        this.dispatchAuthState(false);
      }
    });
  }

  async isLogged() {
      return new Promise((resolve, reject) =>
        onAuthStateChanged( this.auth,
          user => {
            console.log(user);
            if (user) {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          error => reject(error)
        )
      )
  }

  dispatchAuthState(isLogged, user = null) {
    const event = new CustomEvent("fb-auth-state", {detail: {isLogged, user}});
    document.dispatchEvent(event);
  }

  dispatchCodes(codes) {
    const event = new CustomEvent("fb-codes", {detail: {codes}});
    document.dispatchEvent(event);
  }

  authWithGoogle() {
    setPersistence(this.auth, "local");{
      const provider = new GoogleAuthProvider();
      return signInWithPopup(this.auth, provider);
    }
  }

  logout() {
    window.location.hash = "/login";
    return signOut(this.auth);
  }

  getEmotions(callback){
    const q = query(collection(this.db, "emotions"));
    onSnapshot(q, (querySnapshot) => {
      callback(ParseService.createGeoJSON(querySnapshot.docs.map(doc => doc.data())));
    });
  }

  getEmotionsByLocation(lat, lon, callback){
    const q = query(collection(this.db, "emotions"));
    onSnapshot(q, (querySnapshot) => {
      callback(ParseService.createGeoJSON(querySnapshot.docs.map(doc => doc.data())));
    });
  }

  setEmotion(emotion){
    const emotionsRef = collection(this.db, "emotions");
    //addDoc(emotionsRef, emotion);
    emotion.latLon = new GeoPoint(emotion.latLon[0], emotion.latLon[1]);
    addDoc(emotionsRef, emotion)
  }

  getUserByUid(uid){
    return {
      name: "Pippo",
      description: "Ciao sono Pippo",
    }
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

  getUpdateUser(user){
    return user;
  }



}