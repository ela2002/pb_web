// SignIn.js
import React, { useState, useContext, useEffect } from "react";
import styles from "./signup.module.css";
import { auth, onAuthStateChanged } from "../../../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../../../AppContext/AppContext";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const { registerWithEmailAndPassword } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [navigate]);

  const initialValues = {
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Required")
      .min(4, "Must be at least 4 characters long")
      .matches(/^[a-zA-Z]+$/, "Name can only contain letters"),
    email: Yup.string().email("Invalid email address").required("Required"),
    role: Yup.string().required("Required"),
    password: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters long")
      .matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
    confirmPassword: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters long")
      .matches(/^[a-zA-Z]+$/, "Password can only contain letters")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    termsAccepted: Yup.boolean().oneOf(
      [true],
      "Terms and conditions must be accepted"
    ),
  });

  const handleRegister = async (values) => {
    console.log("Submitting form...", values);
    setLoading(true);
    try {
      await registerWithEmailAndPassword(
        values.fullName,
        values.email,
        values.role,
        values.password,
        values.confirmPassword
      );
      if (values.role === "company") {
        navigate("/signin");
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error.message || "Error registering user. Please try again.");
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleRegister,
  });

  const handleCheckboxChange = () => {
    formik.setFieldValue("termsAccepted", !formik.values.termsAccepted);
    const checkbox = document.getElementById("termsCheckbox");
    if (!checkbox.checked) {
      setError("Please agree to the terms and conditions!");
      return;
    }
  };

  const handleRoleChange = (formik) => {
    const role = formik.values.role;
    console.log("Selected Role:", role); // Log the selected role to check
    setSelectedRole(role); // Update selectedRole state with the selected role
    console.log("Updated selectedRole:", role); // Log the updated selected role
  };

  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if all input fields are filled out
    const isFormValid = Object.values(formik.values).every((value) => !!value);
    // Update the state
    setAllFieldsFilled(isFormValid);
  }, [formik.values]);

  return (
    <div>
      <div className={styles.signinContainer}>
        <div className={styles.space}></div>

        {loading ? (
          <div className={styles.loading}>
            <ClipLoader color="#367fd6" size={50} speedMultiplier={0.5} />
          </div>
        ) : (
          <div>
            <div className={styles.signinContainer}>
              <div className={styles.glassEffect}>
                <h3 className={styles.h3}>Create your account </h3>
                <p className={styles.p}>It’s totally free and super easy </p>
                <div className={styles.part2}>
                  <h5 className={styles.h5}>
                    _________ To, register with your email _________
                  </h5>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <label
                    className={styles.labels}
                    style={{ marginRight: "260px" }}
                  >
                    Full Name :
                  </label>
                  <input
                    className={styles.inputs}
                    type="text"
                    required
                    name="fullName"
                    placeholder="Enter your Full Name"
                    onBlur={formik.handleBlur}
                    {...formik.getFieldProps("fullName")}
                  />
                  <br />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <span className={`${styles.error} ${styles.textRed500}`}>
                      {formik.errors.fullName}
                    </span>
                  )}
                  <br /> <br />
                  <label
                    className={styles.labels}
                    style={{ marginRight: "290px" }}
                  >
                    Email :
                  </label>
                  <input
                    className={styles.inputs}
                    type="email"
                    onBlur={formik.handleBlur}
                    {...formik.getFieldProps("email")}
                    required
                    name="email"
                    placeholder="Enter your Email"
                  />
                  <br />
                  {formik.touched.email && formik.errors.email && (
                    <span className={`${styles.error} ${styles.textRed500}`}>
                      {formik.errors.email}
                    </span>
                  )}
                  <br /> <br />
                  <label
                    className={styles.labels}
                    style={{ marginRight: "170px" }}
                  >
                    You want to signup as :
                  </label>
                  <select
                    className={styles.selecttype}
                    name="role"
                    value={formik.values.role}
                    onChange={handleRoleChange} // Pass the handleRoleChange function here
                    required
                    {...formik.getFieldProps("role")}
                  >
                    <option value="no">Select a type</option>
                    <option value="employee">Employee</option>
                    <option value="company">Company</option>
                  </select>
                  <br />
                  {formik.touched.role && formik.errors.role && (
                    <span className={`${styles.error} ${styles.textRed500}`}>
                      {formik.errors.role}
                    </span>
                  )}
                  <br /> <br />
                  <label
                    className={styles.labels}
                    style={{ marginRight: "252px" }}
                  >
                    Password :
                  </label>
                  <input
                    className={styles.inputs}
                    name="password"
                    placeholder="Enter your Password"
                    type="password"
                    onBlur={formik.handleBlur}
                    {...formik.getFieldProps("password")}
                    required
                  />
                  <br />
                  {formik.touched.password && formik.errors.password && (
                    <span className={`${styles.error} ${styles.textRed500}`}>
                      {formik.errors.password}
                    </span>
                  )}
                  <br /> <br />
                  <label
                    className={styles.labels}
                    style={{ marginRight: "200px" }}
                  >
                    Confirm Password :
                  </label>
                  <input
                    className={styles.inputs}
                    type="password"
                    {...formik.getFieldProps(" confirmPassword")}
                    required
                    onBlur={formik.handleBlur}
                    name="confirmPassword"
                    placeholder="Confirm your Password"
                  />
                  <br />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <span className={`${styles.error} ${styles.textRed500}`}>
                        {formik.errors.confirmPassword}
                      </span>
                    )}
                  <div className={styles.check}>
                    <input
                      id="termsCheckbox"
                      style={{
                        marginLeft: "66px",
                        width: "20px",
                        height: "18px",
                      }}
                      type="checkbox"
                      required
                      checked={formik.values.termsAccepted}
                      onChange={() =>
                        formik.setFieldValue(
                          "termsAccepted",
                          !formik.values.termsAccepted
                        )
                      }
                    />

                    <span className={styles.span}>
                      By creating account means you agree to the
                      <a href="#0" className="text-primary hover:underline">
                        <br /> Terms and Conditions
                      </a>
                      , and our
                      <a href="#0" className="text-primary hover:underline">
                        {" "}
                      </a>{" "}
                      <a href="#0" className="text-primary hover:underline">
                        Privacy Policy{" "}
                      </a>
                    </span>
                  </div>
                  <br />
                  {error && error.includes("terms and conditions") && (
                    <span className={`${styles.error} ${styles.textRed500}`}>
                      {error}
                    </span>
                  )}
                  <br />
                  <button type="submit" className={styles.signinbutton}>
                    Sign up
                  </button>
                  <h5 className={styles.h5}>
                    Already have an account?{" "}
                    <Link className={styles.link} to={"/signin"}>
                      Sign in
                    </Link>{" "}
                  </h5>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
