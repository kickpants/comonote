import { createContext, useState, useEffect } from "react";

export const userContext = createContext({ user: null, username: null });
export const themeContext = createContext();

export const ThemeProvider = (props) => {
  const [theme, setTheme] = useState("");
  let temp;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      temp = localStorage.getItem('theme');
      if (temp) {
        setTheme(temp);
      } else {
        setTheme("light");
      }
    }  
  }, [])

  return (
    <themeContext.Provider value={[theme, setTheme]}>
      {props.children}
    </themeContext.Provider>
  );
};
