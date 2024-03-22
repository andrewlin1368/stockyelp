import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import person from "../assets/person.jpg";
import "./profile.css";
import { useGetAllStocksQuery } from "../api/stocksApi";
import { useUpdateMutation } from "../api/userApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>
            <h1 className="display-6">Edit Profile</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="formp mb-2"
            name="firstname"
            placeholder="First Name"
            defaultValue={(user && user.firstname) || ""}
            onChange={(e) => updateForm(e)}
          />

          <input
            type="text"
            className="formp mb-2"
            name="lastname"
            placeholder="Last Name"
            defaultValue={(user && user.lastname) || ""}
            onChange={(e) => updateForm(e)}
          />

          <input
            type="password"
            className="formp mb-2"
            name="password"
            placeholder="New Password"
            onChange={(e) => updateForm(e)}
          />
        </Modal.Body>
        <Modal.Footer>
          <input
            type="submit"
            className="formp mb-0"
            onClick={(e) => handleSave(e)}
            value="Confirm"
          />
        </Modal.Footer>
      </Modal>

      {user && (
        <div className="row prow">
          <div className="d-flex justify-content-center align-items-center mt-3 mb-3 textp fadeIn col-sm-6">
            <div className="cardp">
              <div className="upper"></div>

              <div className="user text-center">
                <div className="profile">
                  <img src={person} className="rounded-circle" width="100" />
                </div>
              </div>

              <div className="mt-5 text-center">
                <h4 className="mb-0">
                  {user.firstname} {user.lastname}
                </h4>
                <span className="lead text-muted d-block mb-2">
                  @{user.username}
                </span>
                <div className="d-flex justify-content-between align-items-center px-4">
                  <div className="stats">
                    <h6 className="mb-0"></h6>
                    <span></span>
                  </div>
                  <div className="lead stats">
                    <h6 className="mb-0">Likes</h6>
                    <span>{following.length}</span>
                  </div>

                  <div className="lead stats">
                    <h6 className="mb-0">Comments</h6>
                    <span>{comments.length}</span>
                  </div>

                  <div className="stats">
                    <h6 className="mb-0"></h6>
                    <span></span>
                  </div>
                </div>
                <input
                  onClick={handleShow}
                  type="submit"
                  className="formz mt-2"
                  value="Edit Profile"
                />
              </div>
            </div>
          </div>

          <div className="following textp col-sm-4 fadeIn second">
            <h1 className="display-6">Likes</h1>
            <hr />
            {!following.length ? (
              <p className="nolc">
                You are not liking any stocks... Start by checking out some{" "}
                <Link className="loginap" to="/">
                  stocks.
                </Link>
              </p>
            ) : (
              <div className="table-wrapper-scroll-ypl my-custom-scrollbarpl ptables">
                <table className="table table-bordered table-striped">
                  {stocks.length ? (
                    following.map((stock) => {
                      return (
                        <React.Fragment key={stock.stock_id}>
                          <div className="card-body p-1">
                            <div>
                              <div>
                                <p className="mb-0">
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
      )}
      <div className="mt-4 textp">
        <div className="comments fadeIn fourth">
          <h1 className="display-4">Comment History</h1>
          <hr></hr>
          {!comments.length ? (
            <p className="nolc">
              You did not make any comments... Start by checking out some{" "}
              <Link className="loginap" to="/">
                stocks.
              </Link>
            </p>
          ) : (
            <div className="table-wrapper-scroll-yp my-custom-scrollbarp ptables">
              <table className="table table-bordered table-striped">
                {stocks.length ? (
                  comments.map((comment) => {
                    return (
                      <React.Fragment key={comment.comment_id}>
                        <div className="card-body p-2">
                          <div>
                            <div>
                              <p className="mb-0">
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
                                <p className="mb-0 ">{comment.message}</p>
                              )) || (
                                <p className="mb-0 ">
                                  <del>{comment.message}</del>{" "}
                                  <span className="removed">
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

      <ToastContainer />
    </div>
  );
}
