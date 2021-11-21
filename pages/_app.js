import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { userContext } from '../lib/context';
import { useUserAuth } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  
  //uses custom hook to determine if a user is logged in
  const userData = useUserAuth();
  
  return (
    //context api provides entire app with user data
    <userContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
    </userContext.Provider>
  );
}

export default MyApp
