import React from "react";
import styles from "../styles/Navbar.module.css";
import SignInButton from "./SignIn";

const Navbar = props => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h3>Hello</h3>
            </div>
            <div className={styles.signupbutton}>
                <SignInButton />
            </div>
        </div>
    );
}

export default Navbar;