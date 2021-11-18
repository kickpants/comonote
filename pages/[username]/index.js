import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { firestore, timestamp } from "../../lib/firebase";
import styles from "../../styles/UserPage.module.css";
import Note from "../../components/Note";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { userContext } from "../../lib/context";

const userList = ({ username, notes }) => {
  const [addNote, setAddNote] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [editAuth, setEditAuth] = useState(null)
  const context = useContext(userContext);

  useEffect(() => {
    setCurrentNotes(notes);
    if(context.username === username){
      setEditAuth(true);
    } else {
      setEditAuth(false);
    }
    console.log(context.username + '' + username);
    console.log(notes);
  }, [context, username]);

  const inputState = () => {
    setAddNote(!addNote);
  };

  const onRemoveNote = (id) => {
    setCurrentNotes(currentNotes.filter(item => item.id !== id))
    console.log(id);

    const userRef = firestore.collection('usernames').doc(username);
    userRef.collection('posts').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    })
  };

  const onAddNote = (e) => {
    e.preventDefault();
    inputState();

    if (noteContent.length > 0) {
      const usernameRef = firestore.collection("usernames").doc(username);
      const postsRef = usernameRef.collection("posts");
      const id = uuidv4();

      setCurrentNotes([...currentNotes, { noteContent: noteContent, id: id }]);

      postsRef.doc(id).set({
        noteContent: noteContent,
        createdAt: timestamp,
      });
    }
  };

  const onChange = (e) => {
    setNoteContent(e.target.value);
  };

  return (
    <div className={styles.list_container}>
      <div className={styles.list_elements}>
        <ul>
          {currentNotes.map((note) => (
            <div key={note.id} className={styles.list_item}>
              <Note noteContent={note.noteContent} />
              &nbsp;
              {editAuth && 
                <AiOutlineClose
                  className={styles.delete}
                  onClick={() => onRemoveNote(note.id)}
                />
              }
            </div>
          ))}
        </ul>
        {editAuth ? (
          addNote ? (
            <div className={styles.new_note} onClick={inputState}>
              <AiOutlinePlus />
              &nbsp;New Note
            </div>
          ) : (
            <div className={styles.new_note_input}>
              <AiOutlinePlus onClick={inputState} />
              &nbsp;
              <form onSubmit={onAddNote}>
                <input
                  className={styles.note_input}
                  value={noteContent}
                  onChange={onChange}
                />
              </form>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { username } = query;

  let notes = null;
  let count = 0;

  const usernameDoc = firestore.collection('usernames').doc(username);
  const postsQuery = usernameDoc.collection('posts').orderBy('createdAt');

  notes = (await postsQuery.get()).docs.map((doc) => {
    const data = doc.data();
    const date = data.createdAt.toDate();
    return { ...data, createdAt: date.toString(), id: doc.id };
  });
  console.log(notes);

  return {
    props: { username, notes },
  };
}

export default userList;
