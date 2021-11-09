import React, { useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import { userContext } from "../lib/context";
import { firestore } from '../lib/firebase';
import { debounce } from "lodash";
import homeStyles from "../styles/Home.module.css"

const SignUp = props => {
    const { user, username } = useContext(userContext);
    const [displayName, setDisplayName] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isloading, setIsLoading] = useState(false);

    const onChange = e => {
        const input = e.target.value.toLowerCase();
        const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        
        if (input.length < 3) {
            setDisplayName(input);
            setIsValid(false);
            setIsLoading(false);
        }
        if (regex.test(input)) {
            setDisplayName(input);
            setIsValid(false);
            setIsLoading(true);
        }
    }

    const nameCheck = useCallback(
        debounce(async (username) => {
          if (username.length >= 3) {
            const ref = firestore.doc(`usernames/${username}`);
            const { exists } = await ref.get();
            
            setIsValid(!exists);
            setIsLoading(false);
          }
        }, 500),
        []
      );

    useEffect(() => {
        nameCheck(displayName);
    }, [displayName])

    const onSubmit = e => {
        e.preventDefault();

        const userId = firestore.doc(`users/${user.uid}`);
        const username = firestore.doc('usernames')

    }

    return (
        <div className={homeStyles.container}>
            <form onSubmit={onSubmit} >
                <div>
                    Email:
                    <input text="text" name="email" placeholder="email" disabled={true} />
                </div>
                <div>
                    Username:
                    <input text="text" name="username" value={displayName} onChange={onChange}/>
                </div>
                <button>Sign up</button>

                <div>
                    {isloading == false ?
                        isValid ? displayName + " is available" : displayName + " is not available"
                        : "Loading..."}
                </div>
            </form>
        </div>
    );
}

export default SignUp;