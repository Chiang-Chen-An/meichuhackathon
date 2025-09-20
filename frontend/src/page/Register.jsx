import React, { useState } from "react";
import "./Register.css"; // Assuming you save the CSS in Register.css
import "../route/user";
import { register } from "../route/user";
import { useNavigate } from "react-router-dom"; // Add this import
import { IoIosArrowBack } from 'react-icons/io';


const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [id, setId] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!phoneNumber || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    // Simulating successful registration
    setSuccessMessage("Registration successful!");
    setErrorMessage("");

    // You can replace this with actual form submission logic
    console.log({ phoneNumber, email, password });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="register-content-page">
        <button 
          className="register-back-arrow"
          type="button"  // Use type="button" to avoid form submission
          onClick={() => navigate("/")}
        >
          <IoIosArrowBack size={20} />
        </button>
        <h2 className="register-page-title">Register</h2>

        <div className="register-phone-number">
          <label className="register-phone-number-label">Phone Number</label>
          <input
            type="text"
            className="register-phone-number-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="register-email">
          <label className="register-email-label">Email</label>
          <input
            type="email"
            className="register-email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="register-password">
          <label className="register-password-label">Password</label>
          <input
            type="password"
            className="register-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="register-button-group">
          <button
            className="register-login-button"
            type="button"  // Use type="button" to avoid form submission
            onClick={() => navigate("/login")}  // Navigate to login page on click
          >
            Log In
          </button>

          <button
            className="register-button"
            type="submit"
            onClick={() => {
              register({ phone_number: phoneNumber, password, email })
                .then((msg) => {
                  console.log(msg);
                  alert(msg.message);
                  setSuccessMessage(msg.message);
                  setId(msg.user_id);
                })
                .catch((err) => {
                  console.error(err);
                  alert("Register failed");
                });
            }}
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

export default Register;
