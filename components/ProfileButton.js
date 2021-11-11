import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { userContext } from "../lib/context";
import styles from "../styles/Profile.module.css";
import { firestore } from "../lib/firebase";
import Link from 'next/link';

const ProfileButton = () => {
  const { user, username } = useContext(userContext);
  const [picture, setPicture] = useState("");

  useEffect(() => {
    const userRef = firestore.collection("users").doc(user.uid);
    userRef.onSnapshot((doc) => {
      setPicture(doc.data()?.profilePicture);
    });
  }, [user]);

  return (
    <Link href={`/${username}`}>
      <div className={styles.imgcontainer}>
        <img src={picture} className={styles.img}/>
      </div>
    </Link>
  );
};

export default ProfileButton;
