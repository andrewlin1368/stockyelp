import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./form.css";
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
  const { error } = useSelector((state) => state.user);
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
    <>
      <form className="login_reg_Form" onSubmit={(e) => sendForm(e)}>
        <h1 className="display-4">Login.</h1>
        <div className="form-group mt-3 mb-3">
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Username"
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
        {/* {error && <p className="lead mt-2 mb-0 text-danger">{error}</p>} */}
        <button type="submit" className="btn btn-primary mt-2">
          Login
        </button>
        <p className="lead mt-2">
          No account?{" "}
          <Link to="/register" style={{ textDecoration: "none" }}>
            Register.
          </Link>
        </p>
      </form>
      <ToastContainer></ToastContainer>
    </>
  );
}
