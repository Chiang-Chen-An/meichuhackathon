import React, { useState, useEffect, useRef } from "react";
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

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) =>
          Math.max(prev - 1, 0)
        );
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setFocusedIndex((prev) =>
          Math.min(prev + 1, buttonRefs.current.length - 1)
        );
        e.preventDefault();
      } else if (e.key === "Enter") {
        const el = buttonRefs.current[focusedIndex];
        if (!el) return;

        if (el.tagName === "BUTTON") {
          e.preventDefault();
          el.click();
          setFocusedIndex(-1);
        } else if (el.tagName === "INPUT") {
          el.focus();
        }
      } else if (e.key === "Shift" || e.key === "LSK") {
        setFocusedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex]);

  const setRef = (index, element) => {
    buttonRefs.current[index] = element;
  };

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
          ref={(el) => setRef(5, el)}
          className={`register-back-arrow ${focusedIndex === 5 ? 'focused' : ''}`}
          type="button"  // Use type="button" to avoid form submission
          onClick={() => {navigate("/"); toggleMode;}}
        >
          <IoIosArrowBack size={20} />
        </button>
        <h2 className="register-page-title">Register</h2>

        <div className="register-phone-number">
          <label className="register-phone-number-label">Phone Number</label>
          <input
            type="text"
            className={`"register-phone-number-input" ${focusedIndex === 4 ? 'focused' : ''}`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            ref={(el) => setRef(4, el)}
          />
        </div>

        <div className="register-email">
          <label className="register-email-label">Email</label>
          <input
            type="email"
            className={`"register-email-input" ${focusedIndex === 3 ? 'focused' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={(el) => setRef(3, el)}
          />
        </div>

        <div className="register-password">
          <label className="register-password-label">Password</label>
          <input
            type="password"
            className={`"register-password-input" ${focusedIndex === 2 ? 'focused' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={(el) => setRef(2, el)}
          />
        </div>
        
        <div className="register-button-group">
          <button
            ref={(el) => setRef(1, el)}
            className={`"register-login-button" ${focusedIndex === 1 ? 'focused' : ''}`}
            type="button"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
          <button
            ref={(el) => setRef(0, el)}
            className={`"register-button" ${focusedIndex === 0 ? 'focused' : ''}`}
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
