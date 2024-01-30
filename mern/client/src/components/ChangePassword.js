import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm new password must match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5050/change-password",
        {
          currentPassword,
          newPassword,
        }
      );

      console.log("Password changed successfully:", response.data);
      // Optionally, you can redirect the user to another page after successful password change.
      // For example, navigate('/mainPage');
    } catch (error) {
      console.error("Password change failed:", error.message);
      setError("Password change failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Change Password</button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
