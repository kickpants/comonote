import React, { useState } from "react";
import { firestore } from "../lib/firebase";
import { auth, googleAuthProvider } from "../lib/firebase";
import { FcGoogle } from "react-icons/fc";
import styles from "../styles/Navbar.module.css";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const SignInButton = () => {
  const router = useRouter();

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
    <button className={styles.sign_in} onClick={googleSignIn}>
      <FcGoogle />
      &nbsp;Sign In
    </button>
  );
};

export default SignInButton;
