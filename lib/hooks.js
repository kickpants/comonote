import { auth, firestore } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useContext } from 'react';
import { userContext } from './context';

export const useUserAuth = () => {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
  
    useEffect(() => {
      let unsubscribe; 
      
      if (user) {
        const ref = firestore.collection('users').doc(user.uid)
        unsubscribe = ref.onSnapshot((doc) => {
          setUsername(doc.data()?.displayName);
        });
      } else {
        setUsername(null);
      }
  
      return unsubscribe;
  
    }, [user]);

    return { user, username };
}

export const useTheme = () => {
  let theme

  if (typeof window !== 'undefined') {
    theme = localStorage.getItem('theme');
  } else {
    theme = null;
  }

  if (!theme) {
    return 'light';
  }

  return theme;
}
