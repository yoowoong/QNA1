// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSvCpxigqbmJR342v043K8d52GcJbp7zq5aI",
    authDomain: "dubai6-173806.firebaseapp.com",
    projectId: "dubai6-173806",
    storageBucket: "dubai6-173806.firebasestoreage.app",
    messagingSenderId: "107582305427",
    appId: "1:107582305427:web:37aaa9c838b6492e42bdef",
    measurementId: "G-VFFXHQCBRW"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase 서비스 초기화
const auth = firebase.auth();
const db = firebase.firestore();

// Firestore 설정
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
