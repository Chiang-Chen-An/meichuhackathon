import React, { useState } from "react";
import "./Login.css"; // Assuming you save the CSS in Login.css
import "../route/user";  // Assuming this contains your login function
import { login } from "../route/user"; // Assuming this contains the login function
import { useNavigate } from "react-router-dom"; // Add this import
import { IoIosArrowBack } from 'react-icons/io';

const Login = () => {
  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState(""); // Phone number or email
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [id, setId] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!phoneNumberOrEmail || !password) {
      setErrorMessage("Both phone number/email and password are required.");
      return;
    }

    // Simulating successful login
    setErrorMessage("");

    // You can replace this with actual form submission logic
    login({ phone_number_or_email: phoneNumberOrEmail, password })
      .then((msg) => {
        console.log(msg);
        alert(msg.message);
        setSuccessMessage(msg.message);
        setId(msg.user_id);
      })
      .catch((err) => {
        console.error(err);
        alert("Login failed");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-content-page">
        <button 
          className="login-back-arrow"
          type="button"  // Use type="button" to avoid form submission
          onClick={() => navigate("/")}
        >
          <IoIosArrowBack size={20} />
        </button>
        <h2 className="login-page-title">Login</h2>

        <div className="login-phone-or-email">
          <label className="login-phone-or-email-label">Phone Number or Email</label>
          <input
            type="text"
            className="login-phone-or-email-input"
            value={phoneNumberOrEmail}
            onChange={(e) => setPhoneNumberOrEmail(e.target.value)}
          />
        </div>

        <div className="login-password">
          <label className="login-password-label">Password</label>
          <input
            type="password"
            className="login-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


        <div className="login-button-group">
          <button
            className="login-button"
            type="button"  // Use type="button" to avoid form submission
            onClick={() => navigate("/login")}  // Navigate to login page on click
          >
            Log In
          </button>

          <button
            className="login-register-button"
            type="button"  // Use type="button" to avoid form submission
            onClick={() => navigate("/register")}  // Navigate to login page on click
          >
            Sign Up
          </button>
        </div>
      </form>

      {successMessage && <div className="message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </>
  );
};

export default Login;
