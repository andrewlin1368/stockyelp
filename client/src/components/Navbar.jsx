import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../api/userSlice";
import { Collapse, Ripple, initMDB } from "mdb-ui-kit";
import { Modal } from "react-bootstrap";
import { useLazyGetMessagesQuery } from "../api/userApi";

function Navbarcomponent() {
  initMDB({ Collapse, Ripple });
  const { token, user, messages } = useSelector((state) => state.user);
  const [getMessages] = useLazyGetMessagesQuery();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    getMessages();
    setShow(true);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {!messages.length ? (
              <p>No messages...</p>
            ) : (
              <div className="table-wrapper-scroll-y my-custom-scrollbar">
                <table className="table table-bordered table-striped">
                  {messages.map((message) => {
                    return (
                      <React.Fragment key={message.message_id}>
                        <div className="card-body">
                          <div>
                            <div>
                              <p className="mb-0">
                                <strong>From: </strong>
                                {message.message_email}

                                <small style={{ float: "right" }}>
                                  <i className="bi bi-clock-history"></i>{" "}
                                  {message.message_date.split("T")[0]}{" "}
                                  <span>
                                    <Link style={{ color: "red" }}>
                                      <i
                                        className="bi bi-trash-fill"
                                        id={message.message_id}
                                      ></i>
                                    </Link>
                                  </span>
                                </small>
                              </p>
                              <p
                                className="mb-0"
                                style={{ wordBreak: "break-all" }}
                              >
                                {message.message_message}
                              </p>
                            </div>
                          </div>
                        </div>
                        <hr className="my-0" />
                      </React.Fragment>
                    );
                  })}
                </table>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-body-tertiary">
        <div className="container">
          <button
            data-mdb-ripple-init
            type="button"
            className="btn btn-light px-3 me-2"
            onClick={() => navigate("/")}
          >
            StockYelp
          </button>

          <button
            data-mdb-collapse-init
            className="navbar-toggler btn btn-light"
            type="button"
            data-mdb-target="#navbarButtonsExample"
            aria-controls="navbarButtonsExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-three-dots"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarButtonsExample">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

            {!token && (
              <>
                <div className="d-flex align-items-center">
                  <button
                    data-mdb-ripple-init
                    type="button"
                    className="btn btn-light px-3 me-2"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    data-mdb-ripple-init
                    type="button"
                    className="btn btn-light px-3 me-2"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </div>
              </>
            )}
            {token && (
              <>
                <div className="d-flex align-items-center">
                  <button
                    data-mdb-ripple-init
                    type="button"
                    className="btn btn-light px-3 me-2"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                </div>
                {user.isadmin && (
                  <>
                    <div className="d-flex align-items-center">
                      <button
                        data-mdb-ripple-init
                        type="button"
                        className="btn btn-light px-3 me-2"
                        onClick={() => navigate("/admin")}
                      >
                        Admin
                      </button>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        data-mdb-ripple-init
                        type="button"
                        className="btn btn-light px-3 me-2"
                        onClick={handleShow}
                      >
                        Messages
                      </button>
                    </div>
                  </>
                )}
                <div className="d-flex align-items-center">
                  <button
                    data-mdb-ripple-init
                    type="button"
                    className="btn btn-light px-3 me-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbarcomponent;
