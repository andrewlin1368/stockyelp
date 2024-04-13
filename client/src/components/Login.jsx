import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/userApi";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { Input, initMDB } from "mdb-ui-kit";

export default function Login() {
  initMDB({ Input });
  const { token } = useSelector((state) => state.user);
  const [sendLogin] = useLoginMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

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
    const result = await sendLogin({ ...form });
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
              <h2>Login</h2>
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
              <button
                type="submit"
                data-mdb-button-init
                className="btn btn-primary btn-block mb-4"
                onSubmit={(e) => sendForm(e)}
              >
                Login
              </button>

              <div className="text-center">
                <p>
                  No account? <Link to="/register">Register</Link>
                </p>
              </div>
            </form>
            <Toaster />
          </div>
        </div>
      </div>
    </section>
  );
}
