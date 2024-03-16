import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import person from "../assets/person.png";
import "./profile.css";
import { useGetAllStocksQuery } from "../api/stocksApi";
import { useUpdateMutation } from "../api/userApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "../assets/bglr.jpg";

export default function Profile() {
  const { token, error } = useSelector((state) => state.user);
  const { stocks } = useSelector((state) => state.stocks);
  const [updateUser] = useUpdateMutation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async (e) => {
    e.preventDefault();
    let result;
    if (!form.password.length)
      result = await updateUser({
        firstname: form.firstname,
        lastname: form.lastname,
      });
    else result = await updateUser(form);
    !result.error && setShow(false);
    result.error &&
      toast.error(result.error.data.error, {
        position: "top-right",
      });
  };
  //set up tables to have stocks name and symbols to prevent useless db calls
  // useGetAllStocksQuery();
  const navigate = useNavigate();
  useEffect(() => {
    const checkLoggedIn = () => {
      navigate("/login");
    };
    !token && checkLoggedIn();
  });
  const { user, following, comments } = useSelector((state) => state.user);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    password: "",
  });
  useEffect(() => {
    setForm({
      ...form,
      firstname: (user && user.firstname) || "",
      lastname: (user && user.lastname) || "",
    });
  }, [user]);
  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // console.log(user, following, comments);
  // console.log(following);
  return (
    <div className="profile" style={{ border: "1px solid transparent" }}>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="display-6">Edit Profile.</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mt-1 mb-3">
            <input
              type="text"
              className="form-control"
              name="firstname"
              placeholder="First Name"
              defaultValue={(user && user.firstname) || ""}
              onChange={(e) => updateForm(e)}
            />
          </div>
          <div className="form-group mt-3 mb-3">
            <input
              type="text"
              className="form-control"
              name="lastname"
              placeholder="Last Name"
              defaultValue={(user && user.lastname) || ""}
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
          {/* {error && (
            <p
              className="lead mt-2 mb-0 text-danger"
              style={{ textAlign: "center" }}
            >
              {error}
            </p>
          )} */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary editbuttonm" onClick={(e) => handleSave(e)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        {user && (
          <div className="user" style={{}}>
            <section>
              <div className="container py-3">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col col-md-9 col-lg-7 col-xl-5">
                    <div
                      className="card"
                      style={{ borderRadius: "15px", opacity: "0.95" }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex text-black">
                          <div className="flex-shrink-0">
                            <img
                              src={person}
                              alt="Generic placeholder image"
                              className="img-fluid"
                              style={{
                                width: "180px",
                                borderRadius: "10px",
                                backgroundColor: "gray",
                              }}
                            />
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h5
                              className="mb-1 lead"
                              style={{
                                textAlign: "center",
                                color: "#0d6efd",
                              }}
                            >
                              @{user.username}
                            </h5>
                            <p
                              className="mb-2 pb-1 lead"
                              style={{ textAlign: "center" }}
                            >
                              {user.firstname} {user.lastname}
                            </p>
                            <div
                              className="d-flex justify-content-start rounded-3 p-2 mt-2 mb-2"
                              style={{
                                backgroundColor: "#efefef",
                                textAlign: "center",
                              }}
                            >
                              <div style={{ width: "50%" }}>
                                <p className="small text-muted mb-1 lead">
                                  <strong>Likes</strong>
                                </p>
                                <p className="mb-0 lead">{following.length}</p>
                              </div>
                              <div className="px-3" style={{ width: "50%" }}>
                                <p className="small text-muted mb-1 lead">
                                  <strong>Comment</strong>
                                </p>
                                <p className="mb-0 lead">{comments.length}</p>
                              </div>
                            </div>
                            <div className="d-flex pt-1 editbutton">
                              <button
                                type="button"
                                className="btn btn-outline-primary me-1 flex-grow-1"
                                onClick={handleShow}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        <div className="not_user" style={{ opacity: "0.9" }}>
          <div className="following">
            <h1 className="display-6" style={{ textAlign: "center" }}>
              Likes
            </h1>
            <hr style={{ marginBottom: "0" }} />
            {!following.length ? (
              <p className="lead" style={{ textAlign: "center" }}>
                You are not liking any stocks... Start by checking out some{" "}
                <Link to="/" style={{ textDecoration: "none" }}>
                  stocks.
                </Link>
              </p>
            ) : (
              <div className="table-wrapper-scroll-y my-custom-scrollbar mb-0">
                <table className="table table-bordered table-striped mb-0">
                  {stocks.length ? (
                    following.map((stock) => {
                      return (
                        <React.Fragment key={stock.stock_id}>
                          <div className="card-body p-1">
                            <div>
                              <div>
                                <p className="lead mb-0">
                                  <strong>
                                    {stocks[stock.stock_id - 1].symbol
                                      .split(" ")
                                      .join("")}
                                  </strong>{" "}
                                  - {stocks[stock.stock_id - 1].fullname}
                                </p>
                              </div>
                            </div>
                          </div>

                          <hr className="my-0" />
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div className="loader"></div>
                  )}
                </table>
              </div>
            )}
          </div>
          <div className="comments">
            <h1 className="display-6" style={{ textAlign: "center" }}>
              Comment History
            </h1>
            <hr style={{ marginBottom: "0" }} />
            {!comments.length ? (
              <p className="lead" style={{ textAlign: "center" }}>
                You did not make any comments... Start by checking out some{" "}
                <Link to="/" style={{ textDecoration: "none" }}>
                  stocks.
                </Link>
              </p>
            ) : (
              <div className="table-wrapper-scroll-y my-custom-scrollbar">
                <table className="table table-bordered table-striped">
                  {stocks.length ? (
                    comments.map((comment) => {
                      return (
                        <React.Fragment key={comment.comment_id}>
                          <div className="card-body p-2">
                            <div>
                              <div>
                                <p className="lead mb-0">
                                  {/* Stock:{" "} */}
                                  <strong style={{ fontWeight: "bold" }}>
                                    {stocks[comment.stock_id - 1].symbol
                                      .split(" ")
                                      .join("")}
                                  </strong>{" "}
                                  <small style={{ float: "right" }}>
                                    {" "}
                                    <i className="bi bi-clock-history"></i>{" "}
                                    {comment.created_at.split("T")[0]}
                                  </small>
                                </p>
                                {(!comment.isdeleted && (
                                  <p className="mb-0 lead">{comment.message}</p>
                                )) || (
                                  <p className="mb-0 lead">
                                    <del>{comment.message}</del> -{" "}
                                    <span style={{ fontStyle: "italic" }}>
                                      This message has been deleted...
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <hr className="my-0" />
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div className="loader"></div>
                  )}
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
