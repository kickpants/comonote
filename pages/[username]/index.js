import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { firestore } from "../../lib/firebase";
import styles from "../../styles/UserPage.module.css";

const userList = ({ username }) => {
  const [addNote, setAddNote] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [count, setCount] = useState(0);
  const [prevNotes, setPrevNotes] = useState({});

  const inputState = () => {
    setAddNote(!addNote);
  };

  const onAddNote = (e) => {
    e.preventDefault();

    if (noteContent.length > 0) {
      const usernameRef = firestore.collection("usernames").doc(username);
      usernameRef.onSnapshot((doc) => {
          setPrevNotes(doc.data()?.notes);
          setCount(doc.data()?.noteCount + 1);
      })

      console.log(count);
      console.log(prevNotes);

      usernameRef.update({
        notes: { ...prevNotes, [count]: noteContent },
        noteCount: count,
      });
    }
  };

  const onChange = (e) => {
    setNoteContent(e.target.value);
  };

  return (
    <div className={styles.list_container}>
      <div className={styles.list_elements}>
        {addNote ? (
          <div className={styles.new_note} onClick={inputState}>
            <AiOutlinePlus />
            &nbsp;New note
          </div>
        ) : (
          <div className={styles.new_note_input}>
            <AiOutlinePlus />
            &nbsp;
            <form onSubmit={onAddNote}>
              <input
                className={styles.note_input}
                value={noteContent}
                onChange={onChange}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { username } = query;

  return {
    props: { username },
  };
}

export default userList;
