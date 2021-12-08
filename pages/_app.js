import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import "../styles/app.css";
import Navbar from "../components/Navbar";
import { userContext, ThemeProvider } from "../lib/context";
import { useUserAuth } from "../lib/hooks";
import DefaultHeader from "../components/DefaultHeader";
import Progress from "../components/progress/Progress";

function MyApp({ Component, pageProps }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsAnimating(true);
    };
    const handleStop = () => {
      setIsAnimating(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);
  //uses custom hook to determine if a user is logged in
  const userData = useUserAuth();

  return (
    //context api provides entire app with user data
    <userContext.Provider value={userData}>
      <ThemeProvider>
        <Progress isAnimating={isAnimating} />
        <DefaultHeader />
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </userContext.Provider>
  );
}

export default MyApp;
