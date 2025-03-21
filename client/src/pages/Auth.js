import React, { useState } from "react";
import "./Auth.css";
import LoopingWords from "./temp-assets/loop";  // Import component
import "./temp-assets/loop.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import gsap from "gsap";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: isLogin ? Yup.string() : Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin ? { username: values.username, password: values.password } : values;
  
      try {
        const response = await axios.post(`http://localhost:5000/api/auth${endpoint}`, payload);
        console.log(response.data);
  
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          alert("Login successful!");
  
          // Redirect based on role
          if (response.data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else if (response.data.user.role === "employee") {
            navigate("/employee-dashboard");
          } else {
            navigate("/user-dashboard");
          }
        } else {
          alert("Registration successful!");
          setIsLogin(true); // Switch to login after registration
        }
      } catch (error) {
        console.error(error);
        alert(isLogin ? "Login failed!" : "Registration failed!");
      }
    },
  });

  return (
    <div className="split-container">
      {/* Animation Side */}
      <div className="animation-side">
        <div>
          <LoopingWords />
        </div>
      </div>

      {/* Form Side */}
      <div className="form-side">
        <div className="container">
          <header>
            <h1 className="heading">Welcome</h1>
            <p className="title">Please {isLogin ? "login" : "register"} to continue</p>
          </header>

          {/* Toggle Buttons */}
          <div className="btn">
            <button className={`login ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
              Login
            </button>
            <button className={`signup ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
              Signup
            </button>
            <div className={`slider ${isLogin ? "" : "moveslider"}`}></div>
          </div>

          {/* Forms - Both exist but only one is visible */}
          <div className={`form-section ${isLogin ? "" : "form-section-move"}`}>
            {/* Login Form */}
            <form className={`login-box ${isLogin ? "visible" : "hidden"}`} onSubmit={formik.handleSubmit}>
              <input
                type="text"
                className="ele"
                placeholder="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="error">{formik.errors.username}</div>
              ) : null}

              <input
                type="password"
                className="ele"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}

              <button type="submit" className="clkbtn">
                Login
              </button>
            </form>

            {/* Signup Form */}
            <form className={`signup-box ${!isLogin ? "visible" : "hidden"}`} onSubmit={formik.handleSubmit}>
              <input
                type="text"
                className="ele"
                placeholder="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="error">{formik.errors.username}</div>
              ) : null}

              <input
                type="email"
                className="ele"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error">{formik.errors.email}</div>
              ) : null}

              <input
                type="password"
                className="ele"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error">{formik.errors.password}</div>
              ) : null}

              <button type="submit" className="clkbtn">
                Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
