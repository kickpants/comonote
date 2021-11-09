import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { userContext } from '../lib/context';
import { useUserAuth } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  
  const userData = useUserAuth();
  
  return (
    <userContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
    </userContext.Provider>
  );
}

export default MyApp
