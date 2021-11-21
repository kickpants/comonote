import React, { useState, useContext } from "react";
import styles from "../styles/UserPage.module.css";
import { AiOutlineDown, AiOutlinePlus } from "react-icons/ai";
import { firestore } from "../lib/firebase";
import { userContext } from "../lib/context";
import { v4 as uuidv4 } from "uuid";
import TextareaAutosize from "react-textarea-autosize";

const Note = (props) => {
  const [drop, setDrop] = useState(false);
  const [addSubNote, setAddSubNote] = useState(false);
  const [subNoteContent, setSubNoteContent] = useState("");
  //set client side list to include server fetched list
  const [currSubNotes, setCurrSubNotes] = useState(props.note.subnotes); 
  const context = useContext(userContext);

  const onAddSubNote = (e) => {
    e.preventDefault();
    setAddSubNote(!addSubNote); //hide user input bar
    //console.log(subNoteContent);

    //enusre something is even typed in
    if (subNoteContent.length > 0) {
      const userRef = firestore.collection("usernames").doc(context.username);
      const postsRef = userRef.collection("posts").doc(props.note.id);
      //console.log(currSubNotes);

      //given the user already has at least one sub note...
      if (currSubNotes) {
        //update client
        setCurrSubNotes([...currSubNotes, subNoteContent]);
        //update server
        postsRef.update({
          subnotes: [...currSubNotes, subNoteContent],
        });
      } else {
        setCurrSubNotes([subNoteContent]);
        postsRef.update({
          subnotes: [subNoteContent],
        });
      }

      setSubNoteContent("");
    }
  };

  return (
    <li className={styles.note}>
      <div className={styles.note_title}>
        <AiOutlineDown
          className={drop ? styles.arrow_rotated : styles.arrow_rotate}
          onClick={() => setDrop(!drop)}
        />
        &nbsp;<span className={styles.spacer}>{props.note.noteContent}</span>
      </div>
      {drop ? (
        <ul className={styles.subnote_container}>
          {currSubNotes &&
            currSubNotes.map((item) => (
              <div key={item.id} className={styles.subnote}>
                <div className={styles.dot} style={{ flex: "none" }} />
                <span className={styles.spacer}>{item}</span>
              </div>
            ))}
          {props.editAuth &&
            (!addSubNote ? (
              <div
                className={styles.new_subnote}
                onClick={() => setAddSubNote(!addSubNote)}
              >
                <AiOutlinePlus />
                &nbsp;New SubNote
              </div>
            ) : (
              <div className={styles.new_subnote}>
                <AiOutlinePlus onClick={() => setAddSubNote(!addSubNote)} />
                &nbsp;
                <form onSubmit={onAddSubNote}>
                  <input
                    className={styles.input_subnote}
                    value={subNoteContent}
                    onChange={(e) => setSubNoteContent(e.target.value)}
                  />
                </form>
              </div>
            ))}
        </ul>
      ) : null}
    </li>
  );
};

export default Note;
