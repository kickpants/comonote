import styles from "../styles/UserPage.module.css";

const Note = (props) => {
  return (
    <li className={styles.note}>
      <div className={styles.dot}></div>&nbsp;{props.noteContent}
    </li>
  );
};

export default Note;
