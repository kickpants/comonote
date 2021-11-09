import React from "react";

const userList = ({ username }) => {
    return (
        <div>
            {username}
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