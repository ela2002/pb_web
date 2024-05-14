import React, { useState } from "react";
import { auth } from "../../../firebase/firebase";
import styles from "./ForgotPassword.module.css";
import { sendPasswordResetEmail } from "@firebase/auth";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(
        "Password Reset Email Sent",
        "Check your email to reset your password."
      );
    } catch (error) {
      alert("Forgot Password Error", error.message);
      console.error("Forgot password error:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password</h1>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={styles.button} onClick={handleForgotPassword}>
          Send Reset Email
        </button>
        <p className={styles.signInText}>
          Remembered your password?{" "}
          <a href="/signin" className={styles.signInLink}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
