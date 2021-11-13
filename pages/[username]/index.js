import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { firestore, timestamp, fromMillis } from "../../lib/firebase";
import styles from "../../styles/UserPage.module.css";
import { v4 as uuidv4 } from "uuid";

const userList = ({ username, posts }) => {
  const [addNote, setAddNote] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [currentNotes, setCurrentNotes] = useState(posts);

  const inputState = () => {
    setAddNote(!addNote);
  };

  const onAddNote = (e) => {
    e.preventDefault();
    inputState();

    if (noteContent.length > 0) {
      const usernameRef = firestore.collection("usernames").doc(username);
      const postsRef = usernameRef.collection("posts");
      const id = uuidv4();

      setCurrentNotes([...currentNotes, {noteContent: noteContent}])

      postsRef.doc(id).set({
        noteContent: noteContent,
        createdAt: timestamp
      });
    }

  };

  const onChange = (e) => {
    setNoteContent(e.target.value);
  };

  return (
    <div className={styles.list_container}>
      <div className={styles.list_elements}>
        {currentNotes.map(post => (
          <div>{post.noteContent}</div>
        ))}
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

  let posts = null;

  const usernameDoc = firestore.collection('usernames').doc(username);
  const postsQuery = usernameDoc.collection('posts').orderBy('createdAt', 'desc');

  posts = (await postsQuery.get()).docs.map(doc => {
    const data = doc.data();
    const date = data.createdAt.toDate();
    return { ...data, createdAt: date.toString() }
  });
  console.log(posts);

  return {
    props: { username, posts },
  };
}

export default userList;
