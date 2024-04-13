import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import person from "../assets/person.jpg";
import { useUpdateMutation } from "../api/userApi";
import { Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { Ripple, initMDB } from "mdb-ui-kit";

export default function Profile() {
  initMDB({ Ripple });
  const navigate = useNavigate();
  const [updateUser] = useUpdateMutation();
  const { token, user, following, comments } = useSelector(
    (state) => state.user
  );
  const { stocks } = useSelector((state) => state.stocks);

  const [show, setShow] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [form, setForm] = useState({
    firstname: (user && user.firstname) || "",
    lastname: (user && user.lastname) || "",
    password: "",
  });

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setForm({
      firstname: (user && user.firstname) || "",
      lastname: (user && user.lastname) || "",
      password: "",
    });
  };
  const handleShowFollowing = () => setShowFollowing(true);
  const handleCloseFollowing = () => setShowFollowing(false);
  const handleShowComments = () => setShowComments(true);
  const handleCloseComments = () => setShowComments(false);

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
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

  useEffect(() => {
    const checkLoggedIn = () => {
      navigate("/login");
    };
    !token && checkLoggedIn();
  });
  useEffect(() => {
    setForm({
      ...form,
      firstname: (user && user.firstname) || "",
      lastname: (user && user.lastname) || "",
    });
  }, [user]);

  return (
    <div className="mt-5 mb-5">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              aria-label="First name"
              className="form-control"
              defaultValue={(user && user.firstname) || ""}
              onChange={(e) => updateForm(e)}
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              aria-label="Last name"
              className="form-control"
              defaultValue={(user && user.lastname) || ""}
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
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary"
            data-mdb-ripple-init
            onClick={(e) => handleSave(e)}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={showFollowing} onHide={handleCloseFollowing} centered>
        <Modal.Header closeButton>
          <Modal.Title>Following</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!following.length ? (
            <p>
              You are not following any stocks... Start by checking out some
              <Link to="/"> stocks.</Link>
            </p>
          ) : (
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <table className="table table-bordered table-striped">
                {stocks.length ? (
                  following.map((stock) => {
                    return (
                      <React.Fragment key={stock.stock_id}>
                        <div className="card-body">
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
                  <div className="admin_search_load">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showComments}
        onHide={handleCloseComments}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Comment History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!comments.length ? (
            <p>
              You did not make any comments... Start by checking out some
              <Link to="/"> stocks.</Link>
            </p>
          ) : (
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <table className="table table-bordered table-striped">
                {stocks.length ? (
                  comments.map((comment) => {
                    return (
                      <React.Fragment key={comment.comment_id}>
                        <div className="card-body">
                          <div>
                            <div>
                              <p className="mb-0">
                                <strong>
                                  {stocks[comment.stock_id - 1].symbol
                                    .split(" ")
                                    .join("")}
                                </strong>
                                <small style={{ float: "right" }}>
                                  <i className="bi bi-clock-history"></i>{" "}
                                  {comment.created_at.split("T")[0]}
                                </small>
                              </p>
                              {(!comment.isdeleted && (
                                <p className="mb-0 ">{comment.message}</p>
                              )) || (
                                <p className="mb-0 ">
                                  <del>{comment.message}</del>{" "}
                                  <span
                                    className="removed"
                                    style={{ color: "red" }}
                                  >
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
                  <div className="admin_search_load">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {user && (
        <section>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-lg-6 mb-4 mb-lg-0">
                <div className="card mb-3" style={{ borderRadius: ".5rem" }}>
                  <div className="row g-0">
                    <div
                      className="col-md-4 gradient-custom text-center text-white"
                      style={{
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: ".5rem",
                      }}
                    >
                      <img
                        src={person}
                        alt="Avatar"
                        className="img-fluid my-5"
                        style={{ width: "80px", borderRadius: ".5rem" }}
                      />

                      <h5>
                        {user.firstname} {user.lastname}
                      </h5>
                      <p>@{user.username}</p>
                      <p>
                        <a
                          onClick={handleShow}
                          className="btn btn-primary"
                          data-mdb-ripple-init
                        >
                          Edit Profile
                        </a>
                      </p>
                      <i className="far fa-edit mb-5"></i>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body p-4">
                        <h6>Stats</h6>
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6>Following</h6>
                            <p className="text-muted">{following.length}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Comments</h6>
                            <p className="text-muted">{comments.length}</p>
                          </div>
                        </div>
                        <h6>Data</h6>
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <p className="text-muted">
                              <a
                                onClick={handleShowFollowing}
                                className="btn btn-primary"
                                data-mdb-ripple-init
                              >
                                Following
                              </a>
                            </p>
                          </div>
                          <div className="col-6 mb-3">
                            <p className="text-muted">
                              <a
                                onClick={handleShowComments}
                                className="btn btn-primary"
                                data-mdb-ripple-init
                              >
                                Comments
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Toaster />
        </section>
      )}
    </div>
  );
}
