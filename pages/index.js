import React, { useContext } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import SignInButton from '../components/SignIn'
import { themeContext } from '../lib/context'

export default function Home() {
  const [theme, setTheme] = useContext(themeContext);
  const darkimage = '/monote-smile-dark.png';
  const lightimage = '/monote-smile-light.png';

  return (
    <div className={theme}>
      <div className={styles.container}>
        <div className={styles.logo}><img src={theme === "light" ? lightimage : darkimage} alt="" className={styles.logoimg}/></div>
        <div className={styles.monote}>
          <h1>Welcome to monote</h1>
          <h2>monote.app is a website to quickly create and share To-Do lists with friends or co-workers</h2>
          <br/>
          <span>Wanna try it out?</span>
          <br/>
          <span>make your first note</span>
          <br/>
          <div className={styles.here}><SignInButton className={styles.button}>Here</SignInButton></div>
        </div>
      </div>
    </div>
  )
}
