import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    setErrors(newErrors);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Welcome ${data.user.name}!`);
        localStorage.setItem("token", data.token); // save token
        localStorage.setItem("user", JSON.stringify(data.user)); // store user info
        window.location.href = "/"; // redirect         
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };


  return (
    <div className={styles.loginPage}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}
        
        {/* Submit */}
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>

        <p className={styles.signup}>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
