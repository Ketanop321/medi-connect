import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";
import { notify } from "./notification";
import "../../styles/Login.css";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    type: "hospital",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "male",
  });
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/register") setIsRegistering(true);

    if (location.pathname === "/login") setIsRegistering(false);
  }, [location.pathname]);
  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering && formData.password !== formData.confirmPassword) {
      notify("Passwords do not match", "warn");
      return;
    }

    const endpoint = isRegistering ? "/auth/register" : "/auth/login";
    const payload = isRegistering
      ? { ...formData }
      : {
          type: formData.type,
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(
        `https://medi-connect-f671.onrender.com${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          notify("Registration successful", "success");
          toggleAuthMode();
        } else {
          localStorage.setItem("token", data.token);
          notify("Login successful", "success");
          window.location.href = "/";
        }
      } else {
        notify(data.message, "warn");
        console.error(data.message);
      }
    } catch (error) {
      notify("Error connecting to the server", "error");
      console.error(error);
    }
  };

  return (
    <div className="login_background">
      <Navbar />
      <div className="auth-maindiv">
        <div className="auth-container">
          <h2>{isRegistering ? "Register" : "Login"}</h2>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-section">
              <label>User Type:</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="user">User</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>

            {isRegistering && (
              <>
                <div className="form-section">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-section">
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="9898989898"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-section">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-section">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-section">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {isRegistering && (
              <div className="form-section">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="register-button">
              <button type="submit" className="auth-button">
                {isRegistering ? "Register" : "Login"}
              </button>
            </div>
          </form>

          <button onClick={toggleAuthMode} className="toggle-auth-button">
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
