import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { userContext } from "../lib/context";
import styles from "../styles/Profile.module.css";
import { firestore } from "../lib/firebase";
import Link from "next/link";
import DropdownMenu from "./DropdownMenu";

const ProfileButton = () => {
  const { user, username } = useContext(userContext);
  const [picture, setPicture] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const userRef = firestore.collection("users").doc(user.uid);
      userRef.onSnapshot((doc) => {
        setPicture(doc.data()?.profilePicture);
      });
    }
  }, [user]);

  return (
    <div className={styles.imgcontainer}>
      <img
        src={picture}
        className={styles.img}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <DropdownMenu username={username} user={user} picture={picture} />
      )}
    </div>
  );
};

export default ProfileButton;
