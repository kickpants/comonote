import React, { useState } from "react";
import styles from "../styles/UserPage.module.css";
import { useRouter } from "next/router";
import { AiOutlineDown, AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import { firestore } from "../lib/firebase";

const Note = (props) => {
  const [drop, setDrop] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [addSubNote, setAddSubNote] = useState(false);
  const [subNoteContent, setSubNoteContent] = useState("");
  //set client side list to include server fetched list
  const [currSubNotes, setCurrSubNotes] = useState(props.note.subnotes);
  const [currNoteContent, setCurrNoteContent] = useState(props.note.noteContent);

  const router = useRouter();

  const onAddSubNote = (e) => {
    e.preventDefault();
    //console.log(subNoteContent);

    //enusre something is even typed in
    if (subNoteContent.length > 0) {
      const userRef = firestore.collection("usernames").doc(props.username);
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
        //update client
        setCurrSubNotes([subNoteContent]);
        //update server
        postsRef.update({
          subnotes: [subNoteContent],
        });
      }

      //clean up user input
      setAddSubNote(!addSubNote);
      setSubNoteContent("");
    }
  };

  const onRename = (e, noteId) => {
    e.preventDefault();

    const userRef = firestore.collection('usernames').doc(props.username);
    const postRef = userRef.collection('posts').doc(noteId);

    if(renameValue.length > 0) {
      postRef.update({
        noteContent: renameValue
      }).then(() => {
        console.log("note content updated");
        setCurrNoteContent(renameValue);
      })
      setEditNote(false);
      setRenameValue("");
    }
  };

  return (
    <li className={styles.note}>
      <div className={styles.note_title}>
        <AiOutlineDown
          className={drop ? styles.arrow_rotated : styles.arrow_rotate}
          onClick={() => setDrop(!drop)}
        />
        {editNote ? (
          <form onSubmit={(e) => onRename(e, props.note.id)}>
            &nbsp;
            <input className={styles.note_rename} value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus />
          </form>
        ) : (
          <>
            &nbsp;
            <span className={styles.spacer}>{currNoteContent}</span>
          </>
        )}
        {props.editAuth && (
          <AiOutlineEdit
            className={styles.delete}
            style={{ flex: "none", marginLeft: "auto" }}
            onClick={() => setEditNote(!editNote)}
          />
        )}
      </div>
      {drop ? (
        <ul className={styles.subnote_container}>
          {currSubNotes &&
            currSubNotes.map((item) => (
              <div key={item.id} className={styles.subnote}>
                <div className={styles.dot} style={{ flex: "none" }} />
                &nbsp;
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
                <AiOutlinePlus
                  onClick={() => setAddSubNote(!addSubNote)}
                  style={{ flex: "none" }}
                />
                &nbsp;
                <form onSubmit={onAddSubNote}>
                  <input
                    className={styles.input_subnote}
                    value={subNoteContent}
                    onChange={(e) => setSubNoteContent(e.target.value)}
                    autoFocus
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
