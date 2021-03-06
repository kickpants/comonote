import React, { useState, useEffect } from "react";
import { firestore, timestamp } from "../../lib/firebase";
import styles from "../../styles/UserPage.module.css";
import List from "../../components/List";
import { useContext } from "react";
import { userContext, themeContext } from "../../lib/context";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineUnorderedList,
  AiOutlineEdit,
} from "react-icons/ai";
import { BiTrashAlt } from "react-icons/bi";
import { useRouter } from "next/router";
import IndexHeader from "../../components/IndexHeader";

const UserPage = ({ username, notes, userLists }) => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [listRename, setListRename] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [addList, setAddList] = useState(false);
  const [lists, setLists] = useState(userLists);
  const [selectedList, setSelectedList] = useState(
    userLists[0] === undefined ? null : userLists[0]
  );
  const [listName, setListName] = useState("");
  const [editAuth, setEditAuth] = useState(null);
  const context = useContext(userContext);
  const [theme, setTheme] = useContext(themeContext);
  const router = useRouter();

  useEffect(() => {
    //check if the user viewing the page is the owner
    //if so, grant permission to make edits
    if (context.username === username) {
      setEditAuth(true);
    } else {
      setEditAuth(false);
    }
    setLists(userLists);
    //console.log("my selected list is now " + userLists[0].id);
  }, [context, username]);

  useEffect(() => {
    //thank god this works now lol
    //fixed bug here: first list not rendering when clicking "My Lists"
    console.log(userLists);
    console.log(selectedList);
    
    //checks if user is creating first list, and sets their selected list
    let validateSelectedList = selectedList !== null ? userLists.filter(
      (list) => list.id === selectedList.id
    ) : [];
    console.log(validateSelectedList);
    setLists(userLists);
    //console.log("updating dom with new lists");
    setSelectedList(
      userLists[0] === undefined
        ? null
        : validateSelectedList.length === 0
        ? userLists[0]
        : selectedList
    );
    //console.log(userLists[0].id);
  }, [userLists, selectedList]);

  const onRemove = (id) => {
    const userRef = firestore.collection("usernames").doc(username);
    const notesQuery = userRef.collection("posts").where("belongsTo", "==", id);

    notesQuery.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        userRef.collection("posts").doc(doc.id).delete();
      });
    });

    //finds index of list to be deleted (as a reference)
    const index = lists.findIndex((list) => list.id === id);

    //checks to see if the list being deleted is currently selected
    if (selectedList.id == lists[index].id) {
      //checks to left and right of to-be-deleted list to find suitable replacement
      if (lists[index + 1] !== undefined) {
        setSelectedList(lists[index + 1]);
      } else if (lists[index - 1] !== undefined) {
        setSelectedList(lists[index - 1]);
      }
    }
    //if none is found, useEffect hook will notice there are no remaining lists on DOM refresh

    userRef
      .collection("lists")
      .doc(id)
      .delete()
      .then(() => {
        console.log("list successfully deleted");
        refreshData();
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userRef = firestore.collection("usernames").doc(username);
    const listRef = userRef.collection("lists");

    /*
    !IMPORTANT NOTE! :
    lists creation cannot be managed client side like everything else.
    notes in lists rely on list ID's that are auto generated server-side.
    this means that the page must be refreshed on list creation to obtain
    the ID.
    */
    listRef
      .add({
        listName: listName,
        createdAt: timestamp,
      }).then(() => {
        refreshData();
      })

    //console.log(lists);
    //clean up input
    setListName("");
    setAddList(!addList);
  };

  const onRename = (e, list) => {
    e.preventDefault();

    const userRef = firestore
      .collection("usernames")
      .doc(username)
      .collection("lists")
      .doc(list.id);

    if (renameValue.length > 0) {
      userRef
        .update({
          listName: renameValue,
        })
        .then(() => {
          console.log("document listname updated");
          setListRename(null);
          setRenameValue("");
        });
    }
    
    refreshData();
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const changeList = (list) => {
    setSelectedList(list);
    refreshData();
    console.log(selectedList);
  };

  const filterNotes = (notes) => {
    console.log("I am filtering for list " + selectedList.id);
    return notes.filter((note) => note.belongsTo === selectedList.id);
  };

  //add logic here to select seperate list collections
  return (
    <div className={theme}>
      <IndexHeader username={username} />
      <div
        className={styles.open_drawer}
        onClick={() => setDrawerOpened(!drawerOpened)}
      >
        <AiOutlineUnorderedList />
      </div>
      <div className={styles.list_container}>
        <div
          className={styles.list_names}
          style={
            typeof window !== "undefined" &&
            window.innerWidth < 900 &&
            drawerOpened
              ? { width: "400px" }
              : null
          }
        >
          <div className={styles.list_name_container}>
            {/* change title code later to adjust for user's names */}
            <h1 className={styles.user_title}>{username}&apos;s lists</h1>
            <div className={styles.user_lists}>
              {lists.map((list) => (
                <div key={list.id} className={styles.list_button}>
                  <div
                    className={
                      list.id === selectedList.id
                        ? styles.list_title_active
                        : styles.list_title
                    }
                    onClick={() => changeList(list)}
                  >
                    {listRename !== list.id ? (
                      <>
                        <div className={styles.dot} />
                        &nbsp;{list.listName}
                      </>
                    ) : (
                      <>
                        <div className={styles.dot} />
                        &nbsp;
                        <form onSubmit={(e) => onRename(e, list)}>
                          <input
                            autoFocus
                            value={renameValue}
                            className={styles.list_rename}
                            onChange={(e) => setRenameValue(e.target.value)}
                          />
                        </form>
                      </>
                    )}
                  </div>
                  &nbsp;
                  {editAuth && (
                    <div>
                      <BiTrashAlt
                        className={styles.list_delete}
                        onClick={() => onRemove(list.id)}
                      />
                      <AiOutlineEdit className={styles.list_delete}
                        onClick={() => setListRename(list.id)} />
                    </div>
                    )}
                </div>
              ))}
              <hr className={styles.list_input_spacer} />
              {editAuth &&
                (addList ? (
                  <form onSubmit={onSubmit} className={styles.list_input}>
                    <AiOutlinePlus
                      onClick={() => setAddList(!addList)}
                      className={styles.list_inputlistbutton}
                    />
                    &nbsp;
                    <input
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      autoFocus
                    />
                  </form>
                ) : (
                  <div
                    onClick={() => setAddList(!addList)}
                    className={styles.list_newlistbutton}
                  >
                    <AiOutlinePlus />
                    &nbsp;New List
                  </div>
                ))}
            </div>
          </div>
        </div>
        {selectedList ? (
          <List
            username={username}
            notes={() => filterNotes(notes)}
            listId={selectedList}
            editAuth={editAuth}
          />
        ) : (
          <div className={styles.intro_container}>
            <h1>To get started, add your first list!</h1>
            <div
              onClick={() => {
                setAddList(true);
                //bug fix #2
                setDrawerOpened(true);
              }}
            >
              <AiOutlineUnorderedList />
            </div>
            <h3>Add List</h3>
          </div>
        )}
      </div>
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
    const date = data.createdAt.toMillis();
    return { ...data, createdAt: date.toString(), id: doc.id };
  });
  console.log(notes);

  const listsQuery = usernameDoc.collection('lists').orderBy('createdAt');
  userLists = (await listsQuery.get()).docs.map((doc) => {
    const data = doc.data();
    const date = data.createdAt.toMillis();
    return { ...data, createdAt: date.toString(), id: doc.id };
  });
  console.log(userLists);

  return {
    props: { username, notes, userLists },
  };
}

export default UserPage;
