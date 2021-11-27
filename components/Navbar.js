import React from "react";
import styles from "../styles/Navbar.module.css";
import SignInButton from "./SignIn";
import { useContext } from "react";
import { userContext, themeContext } from "../lib/context";
import Image from "next/image";
import darkimage from "../public/monote-dark-mode.png";
import lightimage from "../public/monote-light-mode.png";
import ProfileButton from "./ProfileButton";
import { FcGoogle } from "react-icons/fc";

const Navbar = () => {
  const { user, username } = useContext(userContext);
  const [theme, useTheme] = useContext(themeContext);

  return (
    <div className={theme}>
      <div className={styles.container}>
        <div className={styles.title}>
          <Image
            src={theme === "light" ? lightimage : darkimage}
            width={114}
            height={42}
          />
        </div>
        <div className={styles.signupbutton}>
          {username ? (
            <ProfileButton />
          ) : (
            <SignInButton className={styles.sign_in}>
              <FcGoogle />
              &nbsp;Sign In
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
