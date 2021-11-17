import { firestore } from "../lib/firebase";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import Loader from "../components/Loader";

const Authorized = ({ username }) => {
  const router = useRouter();

  useEffect(() => {
    if (username != null) {
        return router.push(`/${username}`);
    } else {
        return router.push("/signup");
    }
  })

  return <></>
}

export async function getServerSideProps({ query }) {
  const [user] = useAuthState(auth);
  let username;

  const ref = firestore.collection('users').doc(user.uid);
    ref.onSnapshot(doc => {
      username = doc.data()?.displayName;
    })

  return {
    props: { username }
  }
}

export default Authorized;