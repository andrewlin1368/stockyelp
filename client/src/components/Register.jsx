import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./form.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRegisterMutation } from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "../assets/bglr.jpg";

export default function Register() {
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    const checkLoggedIn = () => {
      navigate("/");
    };
    token && checkLoggedIn();
  });
  const { error } = useSelector((state) => state.user);
  const [setRegister] = useRegisterMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    admincode: "",
  });
  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const sendForm = async (e) => {
    e.preventDefault();
    const result = await setRegister({ ...form });
    !result.error && navigate("/");
    result.error &&
      toast.error(result.error.data.error, {
        position: "top-right",
      });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundImage: `url(${bg})`,
      }}
    >
      <form
        className="login_reg_Form"
        onSubmit={(e) => sendForm(e)}
        style={{ backgroundColor: "#fcfcfd" }}
      >
        <h1 className="display-4">
          <i className="bi bi-coin"></i> Register.
        </h1>
        <p>
          <small className="lead">
            If an admin code is provied to you. Enter it in the admin code
            field.
          </small>
        </p>
        <div className="form-group mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Username"
            onChange={(e) => updateForm(e)}
          />
        </div>
        <div className="form-group mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            name="firstname"
            placeholder="First Name"
            onChange={(e) => updateForm(e)}
          />
        </div>
        <div className="form-group mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            name="lastname"
            placeholder="Last Name"
            onChange={(e) => updateForm(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            onChange={(e) => updateForm(e)}
          />
        </div>
        <div className="form-group mt-3">
          <input
            type="text"
            className="form-control"
            name="admincode"
            placeholder="Admin Code"
            onChange={(e) => updateForm(e)}
          />
        </div>
        {/* {error && <p className="lead mt-2 mb-0 text-danger">{error}</p>} */}
        <button type="submit" className="btn btn-primary mt-3">
          Register
        </button>
        <p className="lead mt-2">
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login.
          </Link>
        </p>
      </form>
      <ToastContainer></ToastContainer>
    </div>
  );
}
