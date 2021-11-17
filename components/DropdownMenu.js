import React from "react";
import styles from "../styles/Profile.module.css";
import Link from "next/link";
import { auth } from "../lib/firebase";
import router, { useRouter } from "next/router";

const DropdownMenu = (props) => {
	const router = useRouter();

	const signOut = () => {
		auth.signOut();
		router.push('/');
	}

  return (
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
				<Link href={`/${props.username}`} prefetch={false}><div className={styles.lists_button}>My Lists</div></Link>
				<div className={styles.lists_button} onClick={signOut}>Sign Out</div>
      </div>
    </div>	
  );
};

export default DropdownMenu;
