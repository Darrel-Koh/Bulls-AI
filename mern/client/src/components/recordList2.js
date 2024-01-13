import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const User = (props) => (
 <tr>
   <td>{props.user.first_name}</td>
   <td>{props.user.email}</td>
   <td>{props.user.password}</td>
   <td>
     <Link className="btn btn-link" to={`/edit/${props.user._id}`}>Edit</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteUser(props.user._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
);

export default function UserList() {
 const [users, setUsers] = useState([]);

 // This method fetches the users from the database.
 useEffect(() => {
   async function getUsers() {
     const response = await fetch(`http://localhost:5050/user/`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const users = await response.json();
     setUsers(users);
   }

   getUsers();

   return;
 }, [users.length]);

 // This method will delete a user
 async function deleteUser(id) {
   await fetch(`http://localhost:5050/user/${id}`, {
     method: "DELETE"
   });

   const newUsers = users.filter((el) => el._id !== id);
   setUsers(newUsers);
 }

 // This method will map out the users on the table
 function userList() {
   return users.map((user) => {
     return (
       <User
         user={user}
         deleteUser={() => deleteUser(user._id)}
         key={user._id}
       />
     );
   });
 }

 // This following section will display the table with the users.
 return (
   <div>
     <h3>User List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Name</th>
           <th>Email</th>
           <th>Password</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>{userList()}</tbody>
     </table>
   </div>
 );
}