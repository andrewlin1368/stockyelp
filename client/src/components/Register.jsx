import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRegisterMutation } from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="wrapper fadeInDown mt-3">
      <div id="formContent">
        <div className="fadeIn first">
          <h1 className="display-6 mt-3 mb-3">Register</h1>
        </div>
        <form onSubmit={(e) => sendForm(e)}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="formz mb-2"
            onChange={(e) => updateForm(e)}
          />
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            className="formz mb-2"
            onChange={(e) => updateForm(e)}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            className="formz mb-2"
            onChange={(e) => updateForm(e)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="formz mb-2"
            onChange={(e) => updateForm(e)}
          />
          <input
            type="text"
            name="admincode"
            placeholder="Admin Code (Not required)"
            className="formz mb-2"
            onChange={(e) => updateForm(e)}
          />
          <input
            type="submit"
            className="formz fadeIn fourth"
            value="Register"
          />
        </form>
        <div id="formFooter" className="lead">
          Already have an account?{" "}
          <Link className="logina" to="/login">
            Login
          </Link>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
