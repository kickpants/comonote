import React, { useState, useEffect } from "react";
import { firestore, timestamp } from "../../lib/firebase";
import styles from "../../styles/UserPage.module.css";
import List from "../../components/List";
import { useContext } from "react";
import { userContext } from "../../lib/context";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { useRouter } from "next/router";

const userPage = ({ username, notes, userLists }) => {
  const [addList, setAddList] = useState(false);
  const [lists, setLists] = useState(userLists);
  const [selectedList, setSelectedList] = useState(
    userLists[0] === undefined ? null : userLists[0].id
  );
  const [listName, setListName] = useState("");
  const [editAuth, setEditAuth] = useState(null);
  const context = useContext(userContext);
  const router = useRouter();

  useEffect(() => {
    //check if the user viewing the page is the owner
    //if so, grant permission to make edits
    if (context.username === username) {
      setEditAuth(true);
    } else {
      setEditAuth(false);
    }
    //console.log(userLists[0].id);
  }, [context, username]);

  useEffect(() => {
    setLists(userLists);
    //console.log("updating dom with new lists");
    setSelectedList(userLists[0] === undefined ? null : selectedList);
  }, [userLists, selectedList]);

  const onRemove = id => {
    const userRef = firestore.collection("usernames").doc(username);
    const notesQuery = userRef.collection("posts").where("belongsTo", "==", id);
    
    notesQuery.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          userRef.collection('posts').doc(doc.id).delete();
      });
    });

    //finds index of list to be deleted (as a reference)
    const index = lists.findIndex(list => list.id === id);
    //checks to left and right of to-be-deleted list to find suitable replacement
    if(lists[index+1] !== undefined){
      setSelectedList(lists[index+1].id);
    } else if(lists[index-1] !== undefined) {
      setSelectedList(lists[index-1].id);
    }
    //if none is found, useEffect hook will notice there are no remaining lists on DOM refresh

    setLists(lists.filter(list => list.id !== id));

    userRef.collection('lists').doc(id).delete().then(() => {
      console.log('list successfully deleted');
      refreshData();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userRef = firestore.collection("usernames").doc(username);
    const listRef = userRef.collection("lists");

    listRef
      .add({
        listName: listName,
        createdAt: timestamp,
      })
      .then(() => {
        refreshData();
      });

    //console.log(lists);

    //clean up input
    setListName("");
    setAddList(!addList);
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const changeList = (list) => {
    setSelectedList(list.id);
    refreshData();
    //console.log(selectedList);
  };

  //add logic here to select seperate list collections
  return (
    <div className={styles.list_container}>
      <div className={styles.list_names}>
        <h1 className={styles.user_title}>{username}'s lists</h1>
        <div className={styles.user_lists}>
          {lists.map((list) => (
            <div className={styles.list_button}>
              <div
                className={styles.list_title}
                style={list.id === selectedList ? { backgroundColor: "hsl(0, 0%, 95%)"} : null}
                onClick={() => changeList(list)}
              >
                <div className={styles.dot} />
                &nbsp;{list.listName}
              </div>
              &nbsp;
              <div>{editAuth && <BiTrashAlt className={styles.list_delete} onClick={() => onRemove(list.id)}/>}</div>
            </div>
          ))}
          <hr className={styles.list_input_spacer} />
          {editAuth &&
            (addList ? (
              <form onSubmit={onSubmit}>
                <AiOutlinePlus onClick={() => setAddList(!addList)}/>
                &nbsp;
                <input
                  className={styles.list_input}
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  autoFocus
                />
              </form>
            ) : (
              <div onClick={() => setAddList(!addList)} className={styles.list_newlistbutton}>
                <AiOutlinePlus />
                &nbsp;New List
              </div>
            ))}
        </div>
      </div>
      {selectedList ? (
        <List
          username={username}
          notes={notes.filter((note) => note.belongsTo === selectedList)}
          listId={selectedList}
          editAuth={editAuth}
        />
      ) : (
        <div className={styles.intro_container}>
          <h1>To get started, add your first list!</h1>
          <div onClick={() => setAddList(true)}>
            <AiOutlineUnorderedList />
          </div>
          <h3>Add List</h3>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const { username } = query;

  let notes = null;
  let userLists = null;

  //get notes for current user's page, ordered by date posted
  const usernameDoc = firestore.collection('usernames').doc(username);
  const postsQuery = usernameDoc.collection('posts').orderBy('createdAt');
  notes = (await postsQuery.get()).docs.map((doc) => {
    const data = doc.data();
    //sanitize firebase and javascript timestamp formats, doesn't play nice with Next
    const date = data.createdAt.toDate();
    return { ...data, createdAt: date.toString(), id: doc.id };
  });
  console.log(notes);

  const listsQuery = usernameDoc.collection('lists').orderBy('createdAt');
  userLists = (await listsQuery.get()).docs.map((doc) => {
    const data = doc.data();
    const date = data.createdAt.toDate();
    return { ...data, createdAt: date.toString(), id: doc.id };
  });
  console.log(userLists);

  return {
    props: { username, notes, userLists },
  };
}

export default userPage;
