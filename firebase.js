import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';


const firebaseConfig = {
    apiKey: "AIzaSyAkMXMgGZb6KF8Rl4dIPNDuG8nR13A6LQQ",
    authDomain: "headstrong-ea612.firebaseapp.com",
    projectId: "headstrong-ea612",
    storageBucket: "headstrong-ea612.appspot.com",
    messagingSenderId: "199264210050",
    appId: "1:199264210050:web:564e1ebc06fa0396f8f89b",
    measurementId: "G-DXRR8TF6J1",
    databaseURL: "https://headstrong-ea612-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//waitlist database setup

export const addToWaitlist = async (email) => {
    try {
        await setDoc(doc(db, 'waitlist', email), {
            email,
            signupDate: new Date().toISOString(),
            platform: 'web'
        });
        return true;
    } catch (error) {
        console.error('error adding to waitlist', error);
        throw error;
    }
};

export const addQuizLead = async (email, score, dimensions) => {
    try {
        await setDoc(doc(db, 'quizLeads', email), {
            email,
            score,
            dimensions,
            signupDate: new Date().toISOString(),
            emailSent: false
        });
        return true;
    } catch (error) {
        console.error('error adding quiz lead', error);
        throw error;
    }
};