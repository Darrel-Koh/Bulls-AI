import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
 const [form, setForm] = useState({
    name: "",
    position: "",
    password: "", 
 });
 const navigate = useNavigate();

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
// testing CICD 2
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();

   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };

   await fetch("http://localhost:5050/user", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   setForm({ first_name: "", email: "", password: "" });
   navigate("/");
 }

 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Record</h3>
     <form onSubmit={onSubmit}>
        <div className="form-group">
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={form.first_namename}
          onChange={(e) => updateForm({ first_name: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={form.email}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={form.password}
          onChange={(e) => updateForm({ password: e.target.value })}
        />
      </div>
      <div className="form-group">
        <input
          type="submit"
          value="Create User"
          className="btn btn-primary"
        />
      </div>
     </form>
   </div>
 );
}
