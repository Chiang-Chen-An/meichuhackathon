import React, { useState, useRef } from "react";
import "./Register.css";
import "../route/user";
import { register } from "../route/user";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !email || !password) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await register({
        phone_number: phoneNumber,
        email: email,
        password: password,
      });

      console.log("Registration successful:", response);
      setSuccessMessage(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="register-content-page">
        <button
          className="register-back-arrow"
          type="button"
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
            className="register-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>

          <button
            className="register-login-button"
            type="button"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            Log In
          </button>
        </div>
      </form>

      {successMessage && <div className="message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </>
  );
};

export default Register;
