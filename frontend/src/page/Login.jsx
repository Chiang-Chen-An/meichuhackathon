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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!phoneNumberOrEmail || !password) {
      setErrorMessage("Both phone number/email and password are required.");
      return;
    }

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // 根據後端 API，使用 phone_number 作為參數名
      const loginData = {
        phone_number: phoneNumberOrEmail,
        password: password
      };
      
      const response = await login(loginData);
      console.log('Login successful:', response);
      
      setSuccessMessage(response.message);
      
      // 登入成功後導航到首頁或儀表板
      setTimeout(() => {
        navigate("/"); // 或者導航到 "/dashboard" 或其他頁面
      }, 1000);
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            type="submit"  // 改為 submit 以觸發表單提交
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>

          <button
            className="login-register-button"
            type="button"  // Use type="button" to avoid form submission
            onClick={() => navigate("/register")}  // Navigate to register page on click
            disabled={isLoading}
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
