import React, { useEffect, useState } from "react";

import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

// const USERS = [
//   {
//     id: "u1",
//     name: "ankit",
//     image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1931&q=80",
//     places: 4,
//   },
// ];

const Users = () => {
  
  const [loadedUsers, setLoadedUsers] = useState();

  const {isLoading , error , sendRequest , clearError} = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/users");

        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err);
      }
      
    };
    fetchUsers();
  }, [sendRequest]);

  
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className="centered"><LoadingSpinner/></div>}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </>
  );
};
export default Users;
