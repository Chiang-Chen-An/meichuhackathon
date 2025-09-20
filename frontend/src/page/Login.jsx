import React, { useState } from "react";
import './Login.css'; // Assuming you save the CSS in Login.css
import "../route/user"

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation
        if (!phoneNumber || !email || !password) {
            setErrorMessage("All fields are required.");
            return;
        }

        // Simulating successful registration
        // setSuccessMessage("Registration successful!");
        setErrorMessage("");

        // You can replace this with actual form submission logic
        console.log({ phoneNumber, email, password });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

                <label htmlFor="phone-number">Phone Number</label>
                <input
                    type="text"
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" onClick={() => {
                    let msg = login({ "phone_number": phoneNumber, "password": password, "email": email });
                    alert(msg.message);
                    setSuccessMessage(msg.message);
                }}>Login</button>
            </form>

            {successMessage && <div className="message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default Login;
