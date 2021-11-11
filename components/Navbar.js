import React from "react";
import styles from "../styles/Navbar.module.css";
import SignInButton from "./SignIn";
import { useContext } from "react";
import { userContext } from "../lib/context";
import ProfileButton from "./ProfileButton";

const Navbar = () => {
    const { user, username } = useContext(userContext);

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h3>Hello</h3>
            </div>
            <div className={styles.signupbutton}>
                { username ?
                    <ProfileButton /> : <SignInButton />
                }   
            </div>
        </div>
    );
}

export default Navbar;