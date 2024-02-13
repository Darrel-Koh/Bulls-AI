import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgetPassword = async () => {
    try {
      if (!email) {
        throw new Error("Please enter your email.");
      }

      await axios.post(`${process.env.REACT_APP_BASE_URL}/forget-password`, {
        email,
      });
      setMessage(
        "Password reset initiated. Check your email for instructions."
      );
    } catch (error) {
      console.error("Password reset failed:", error.message);
      setMessage("Password reset failed. Please try again later.");
    }
  };

  const redirectToLogin = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>Forget Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgetPassword}>Reset Password</button>
      <button onClick={redirectToLogin}>Back to Login</button>{" "}
      {/* Button to navigate to login page */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgetPassword;
