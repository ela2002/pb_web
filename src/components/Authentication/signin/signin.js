import React, { useState, useContext, useEffect } from "react";
import styles from "./signin.module.css";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../../../AppContext/AppContext";
import { auth, onAuthStateChanged } from "../../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { loginWithEmailAndPassword } = useContext(AuthContext);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const { userData, loading } = useContext(AuthContext);

  useEffect(() => {
    setAuthLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (userData && userData.role === "employee") {
          navigate("/insightzone");
        } else if (userData && userData.role === "company") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        console.log("User not authenticated");
        navigate("/signin");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [userData, navigate]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    setAuthLoading(true);
    try {
      await loginWithEmailAndPassword(values.email, values.password, navigate);
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in. Please try again.");
    }
    setAuthLoading(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  if (loading || authLoading) {
    return (
      <div className={styles.loading}>
        <ClipLoader color="#367fd6" size={50} speedMultiplier={0.5} />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.signinContainer}>
        <div className={styles.space}></div>
        <div className={styles.signinContainer}>
          <div className={styles.glassEffect}>
            <h3 className={styles.h3}>Sign in to your account</h3>
            <p className={styles.p}>
              Login to your account for a faster Checkout
            </p>
            <div className={styles.part2}>
              <h5 className={styles.h5}>
                _________ And, Sign in with your email _________
              </h5>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <label className={styles.labels} style={{ marginRight: "260px" }}>
                Your Email
              </label>
              <input
                className={styles.inputs}
                name="email"
                placeholder="Enter your Email"
                type="email"
                autoComplete="email"
                required
                {...formik.getFieldProps("email")}
              />
              <br />
              {formik.touched.email && formik.errors.email && (
                <span className={styles.error}>{formik.errors.email}</span>
              )}
              <br />
              <label className={styles.labels} style={{ marginRight: "222px" }}>
                Your Password
              </label>
              <input
                className={styles.inputs}
                type="password"
                name="password"
                placeholder="Enter your Password"
                autoComplete="current-password"
                required
                {...formik.getFieldProps("password")}
              />
              <br />
              {formik.touched.password && formik.errors.password && (
                <span className={styles.error}>{formik.errors.password}</span>
              )}
              <div className={styles.check}>
                <p
                  className={styles.p}
                  style={{ marginLeft: "60px", color: "#7D55C7" }}
                >
                  <Link to="/forgot-password" className={styles.a}>
                    Forgot Password
                  </Link>
                </p>
              </div>
              <br />
              <button type="submit" className={styles.signinbutton}>
                Sign in
              </button>
              <h5 className={styles.h5}>
                Don't you have an account?{" "}
                <Link className={styles.link} to={"/signup"}>
                  Sign up
                </Link>
              </h5>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
