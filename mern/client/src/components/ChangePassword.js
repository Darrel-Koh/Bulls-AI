import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { userId } = useContext(AuthContext);
  const handleChangePassword = async (event) => {
    event.preventDefault();
    console.log(userId);
    // Validation checks
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    try {
      // Send request to backend to change password
      const response = await axios.post(
        "http://localhost:5050/changepassword",
        {
          currentPassword,
          newPassword,
          userId,
        }
      );
      console.log(response.data); // Log the response

      // Reset form fields and error message
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrorMessage("");

      // Display success message to user
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error.message);
      setErrorMessage("Failed to change password. Please try again.");
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
