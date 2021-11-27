import React, { useState, useContext } from "react";
import { firestore } from "../lib/firebase";
import { auth, googleAuthProvider } from "../lib/firebase";
import styles from "../styles/Navbar.module.css";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { themeContext } from "../lib/context";

const SignInButton = props => {
  const router = useRouter();
  const [theme, setTheme] = useContext(themeContext);

  const googleSignIn = async () => {
    await auth.signInWithPopup(googleAuthProvider).then(result => {
      console.log(result.user.uid);
      const ref = firestore.collection('users').doc(result.user.uid);
      ref.onSnapshot(doc => {
        if(doc.data()?.displayName != null) {
          router.push(`/${doc.data()?.displayName}`);
        } else {
          router.push('/signup');
        }
      });
    });
  };

  return (
    <div className={theme}>
      <button className={props.className} onClick={googleSignIn}>
        {props.children}
      </button>
    </div>
  );
};

export default SignInButton;
