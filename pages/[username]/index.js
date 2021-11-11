import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import styles from "../../styles/UserPage.module.css";

const userList = ({ username }) => {
    return (
        <div className={styles.list_container}>
            <div className={styles.list_elements}>
                <div className={styles.new_note}>
                    <AiOutlinePlus />&nbsp;New note
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ query }){
    const { username } = query;

    return {
        props: { username }
    }
}

export default userList;