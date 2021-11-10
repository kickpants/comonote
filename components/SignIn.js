import React from "react";
import { auth, googleAuthProvider } from '../lib/firebase';
import { FcGoogle } from "react-icons/fc";
import styles from "../styles/Navbar.module.css";
import { useRouter } from "next/router";

const SignInButton = () => {
    const router = useRouter();

    const googleSignIn = async () => {
        await auth.signInWithPopup(googleAuthProvider);
        router.push('/signup');
    }

    return (
        <button className={styles.sign_in} onClick={googleSignIn}>
            <FcGoogle />&nbsp;Sign In
        </button>
    );
}

export default SignInButton;