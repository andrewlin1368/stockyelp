import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { useLoginMutation } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { token } = useSelector((state) => state.user);
  useEffect(() => {
    const checkLoggedIn = () => {
      navigate("/");
    };
    token && checkLoggedIn();
  });
  const [form, setForm] = useState({ username: "", password: "" });
  useSelector((state) => state.user);
  const [sendLogin] = useLoginMutation();
  const navigate = useNavigate();
  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const sendForm = async (e) => {
    e.preventDefault();
    const result = await sendLogin({ ...form });
    !result.error && navigate("/");
    result.error &&
      toast.error(result.error.data.error, {
        position: "top-right",
      });
  };

  return (
    <div className="wrapper fadeInDown mt-5">
      <div id="formContent">
        <div className="fadeIn first">
          <h1 className="display-6 mt-3 mb-3">Login</h1>
        </div>
        <form onSubmit={(e) => sendForm(e)}>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            className="formz mb-3"
            onChange={(e) => updateForm(e)}
          />

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="formz mb-3"
            onChange={(e) => updateForm(e)}
          />

          <input type="submit" className="formz fadeIn fourth" value="Login" />
        </form>
        <div id="formFooter" className="lead">
          No account?{" "}
          <Link className="logina" to="/register">
            Register
          </Link>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
