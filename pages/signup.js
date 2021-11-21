import React, { useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import { userContext } from "../lib/context";
import { firestore } from "../lib/firebase";
import debounce from "lodash.debounce";
import styles from "../styles/SignUp.module.css";
import Loader from "../components/Loader";
import { useRouter } from "next/router";

const SignUp = (props) => {
  const { user, username } = useContext(userContext);
  const [displayName, setDisplayName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const validStyle = {};
  const router = useRouter();

  const onChange = (e) => {
    //user input sanitization
    const input = e.target.value.toLowerCase();
    const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    //input less than 3 characters not allowed for a username
    if (input.length < 3) {
      setDisplayName(input);
      setIsValid(false);
      setIsLoading(false);
    }
    //if username is at least 3 chars and passes reg test,
    //database is queried
    if (regex.test(input)) {
      setDisplayName(input);
      setIsValid(false);
      setIsLoading(true);
    }
  };

  //debouncing database query
  const nameCheck = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.collection("usernames").doc(`${username}`);
        const { exists } = await ref.get();

        setIsValid(!exists);
        setIsLoading(false);
      }
    }, 500),
    []
  );
  
  //queries database when DOM is updated and displayName's state is changed
  useEffect(() => {
    nameCheck(displayName);
  }, [displayName]);

  //stores display name in database
  const onSubmit = (e) => {
    e.preventDefault();

    const userRef = firestore.collection("users").doc(`${user.uid}`);
    const usernameRef = firestore.collection("usernames").doc(`${displayName}`);

    const batch = firestore.batch();

    batch.set(userRef, {
      displayName: displayName,
      profilePicture: user.photoURL,
    });
    batch.set(usernameRef, { uid: user.uid });

    batch.commit();

    //brings user to personal list page
    router.push(`/${displayName}`);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h1 className={styles.title}>What should we call you?</h1>
        <h3 className={styles.title2}>Choose a name</h3>
        <div className={styles.inputbox}>
          <span className={styles.input_title}>Email:</span>
          <br />
          <input
            className={styles.signupinput}
            text="text"
            name="email"
            placeholder={user.email}
            disabled={true}
          />
        </div>
        <div className={styles.inputbox}>
          <span className={styles.input_title}>Username:</span>
          <br />
          <input
            className={styles.signupinput}
            text="text"
            name="username"
            value={displayName}
            onChange={onChange}
          />
        </div>
        <div className={validStyle, styles.name_checker}>
          {displayName ? (
            isloading == false ? (
              isValid ? (
                <span style={{color: "hsl(108, 65%, 57%)"}}>{displayName} is available</span>
              ) : (
                <span style={{color: "hsl(0, 65%, 57%)"}}>{displayName} is not available</span>
              )
            ) : (
              <Loader />
            )
          ) : (
            ""
          )}
        </div>
        <button type="submit" className={styles.submit_button} disabled={!isValid}>
          Let's go
        </button>
      </form>
    </div>
  );
};

export default SignUp;
