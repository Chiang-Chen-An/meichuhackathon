import React, { useState } from "react";
import "./Register.css"; // Assuming you save the CSS in Register.css
import "../route/user";
import { register } from "../route/user";

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [id, setId] = useState("");

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
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="page-title">Register</h2>

        <div className="phone-number">
          <label className="phone-number-label">Phone Number</label>
          <input
            type="text"
            className="phone-number-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="email">
          <label className="email-label">Email</label>
          <input
            type="email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="password">
          <label className="password-label">Password</label>
          <input
            type="password"
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
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
          Register
        </button>
      </form>

      {successMessage && <div className="message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </>
  );
};

export default Register;
