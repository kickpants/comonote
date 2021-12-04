import '../styles/globals.css';
import '../styles/app.css';
import Navbar from '../components/Navbar';
import { userContext, ThemeProvider } from '../lib/context';
import { useUserAuth } from '../lib/hooks';
import DefaultHeader from '../components/DefaultHeader';

function MyApp({ Component, pageProps }) {
  
  //uses custom hook to determine if a user is logged in
  const userData = useUserAuth();
  
  return (
    //context api provides entire app with user data
    <userContext.Provider value={userData}>
      <ThemeProvider>
        <DefaultHeader />
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </userContext.Provider>
  );
}

export default MyApp
