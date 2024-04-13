import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../api/userApi";
import toast, { Toaster } from "react-hot-toast";
import { Input, initMDB } from "mdb-ui-kit";

export default function Register() {
  initMDB({ Input });
  const { token } = useSelector((state) => state.user);
  const [setRegister] = useRegisterMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    admincode: "",
  });

  useEffect(() => {
    const checkLoggedIn = () => {
      navigate("/");
    };
    token && checkLoggedIn();
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
    <section className="mt-5" style={{ paddingBottom: "95px" }}>
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://res.cloudinary.com/day4sl0qg/image/upload/v1713034677/Blogs_Paytm_Bond-Market-vs.-Stock-Market_-Whats-the-Difference_-1_boudbx.webp"
              className="img-fluid stock_img"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 mt-4">
            <div style={{ textAlign: "center" }}>
              <h2>Register</h2>
            </div>

            <div className="divider d-flex align-items-center my-4"></div>

            <form className="mt-5" onSubmit={(e) => sendForm(e)}>
              <div className="input mb-3">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  onChange={(e) => updateForm(e)}
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  aria-label="First name"
                  className="form-control"
                  onChange={(e) => updateForm(e)}
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  aria-label="Last name"
                  className="form-control"
                  onChange={(e) => updateForm(e)}
                />
              </div>
              <div className="input mb-3">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon1"
                  onChange={(e) => updateForm(e)}
                />
              </div>
              <div className="input mb-3">
                <input
                  type="text"
                  id="admincode"
                  name="admincode"
                  className="form-control"
                  placeholder="Admin Code (Not required)"
                  aria-label="Admin Code (Not required)"
                  aria-describedby="basic-addon1"
                  onChange={(e) => updateForm(e)}
                />
              </div>
              <button
                type="submit"
                data-mdb-button-init
                data-mdb-ripple-init
                className="btn btn-primary btn-block mb-4"
                onSubmit={(e) => sendForm(e)}
              >
                Register
              </button>

              <div className="text-center">
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </form>
            <Toaster />
          </div>
        </div>
      </div>
    </section>
    // <div className="login_register_form">
    //   <h1 className="mt-5">Register</h1>

    //   <Toaster />
    // </div>
  );
}
