import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { firestore, timestamp } from "../lib/firebase";
import styles from "../styles/UserPage.module.css";
import Note from "../components/Note";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { userContext } from "../lib/context";

const List = ({ username, notes, editAuth, listId }) => {
  const [addNote, setAddNote] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  //set client side list to include server fetched list
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [currentList, setCurrentList] = useState(listId)
  const context = useContext(userContext);

  //when DOM updates, ensure current notes are from the correct
  //user's page
  useEffect(() => {
    setCurrentNotes(notes);
    setCurrentList(listId);
    console.log("my list id is" + listId);
    //console.log(context.username + '' + username);
    //console.log(notes);
  }, [context, username, notes]);

  //state flipping function
  const inputState = () => {
    setAddNote(!addNote);
  };

  //removes note from DOM and database
  const onRemoveNote = (id) => {
    //sets the visible state of the app to filter out the removed note
    setCurrentNotes(currentNotes.filter(item => item.id !== id))
    //console.log(id);

    //actually removes note from database using note id
    const userRef = firestore.collection('usernames').doc(username);
    userRef.collection('posts').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    })
  };

  //updates DOM to include new note and adds it to database
  const onAddNote = (e) => {
    e.preventDefault();
    inputState(); //hide input bar

    if (noteContent.length > 0) {
      const usernameRef = firestore.collection("usernames").doc(username);
      const postsRef = usernameRef.collection("posts");
      const id = uuidv4();

      //update client side to include new note
      setCurrentNotes([...currentNotes, { noteContent: noteContent, id: id, belongsTo: currentList }]);
      console.log(currentNotes);

      //update server side with new note
      postsRef.doc(id).set({
        noteContent: noteContent,
        createdAt: timestamp,
        belongsTo: currentList,
      });
    }
  };

  const onChange = (e) => {
    setNoteContent(e.target.value);
  };

  return (
    <div className={styles.list_elements}>
      <ul>
        {currentNotes.map((note) => (
          <div key={note.id} className={styles.list_item}>
            <Note note={note} editAuth={editAuth} subNotes={null} />
            &nbsp;
            {editAuth && 
              <AiOutlineClose
                className={styles.delete}
                style={{flex: 'none'}}
                onClick={() => onRemoveNote(note.id)}
              />
            }
          </div>
        ))}
      </ul>
      {editAuth && (
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
      )}
    </div>
  );
}; 

export default List;
