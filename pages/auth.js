import { firestore } from "../lib/firebase";
import React, { useEffect } from "react";
import { useContext } from "react";
import { userContext } from "../lib/context";
import { useRouter } from "next/router";
import Loader from "../components/Loader";

const Authorized = () => {
  const { user, username } = useContext(userContext);
  const router = useRouter();

  useEffect(() => {

    if (user && username) {
        router.push(`/${username}`);
    } else {
        router.push("/signup");
    }
  }, [])

  return(
    <div>
      <Loader />
    </div>
  );
}

export default Authorized;