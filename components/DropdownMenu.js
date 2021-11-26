import React, { useContext } from "react";
import styles from "../styles/Profile.module.css";
import Link from "next/link";
import { auth } from "../lib/firebase";
import { themeContext } from "../lib/context";

const DropdownMenu = (props) => {
  const [theme, setTheme] = useContext(themeContext);
  
	const signOut = () => {
		auth.signOut();
	}

  const changeTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  }

  return (
    <div className={theme}>
      <div className={styles.dropdown}>
        <div className={styles.dropdown_header}>
          <img src={props.picture} />
          <span>
            {props.username.length > 10
              ? props.username.substr(0, 9) + '...'
              : props.username}
          </span>
        </div>
        <hr className={styles.divider}/>
        <div className={styles.dropdown_main}>
          <Link href={`/${props.username}`}><div className={styles.lists_button}>My Lists</div></Link>
          <div className={styles.lists_button} onClick={signOut}>Sign Out</div>
          <div className={styles.lists_button} onClick={changeTheme}>Change Theme</div>
        </div>
      </div>	
    </div>
  );
};

export default DropdownMenu;
