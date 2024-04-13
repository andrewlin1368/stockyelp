import { Input, initMDB } from "mdb-ui-kit";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

export default function Footer() {
  initMDB({ Input });
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState({ email: "", message: "" });

  const setForm = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value });
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setMessage({ email: "", message: "" });
  };
  const handleCloseSend = () => {
    if (!message.email.length || !message.message.length) {
      toast.error("All fields are required!", { position: "top-right" });
    } else if (message.message.length > 50) {
      toast.error("Message must be less than 500 characters!", {
        position: "top-right",
      });
    } else {
      toast.success("Message sent!", {
        position: "top-right",
      });
      setShow(false);
      setMessage({ email: "", message: "" });
    }
  };

  return (
    <footer className="fixed-bottom bg-body-tertiary text-center">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contact Me</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input mb-3">
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Email"
              aria-label="Symbol"
              aria-describedby="basic-addon1"
              onChange={setForm}
            />
          </div>
          <div className="input mb-3">
            <textarea
              name="message"
              placeholder="Message"
              className="form-control rounded"
              aria-label="With textarea"
              onChange={setForm}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            data-mdb-button-init
            className="btn btn-primary"
            onClick={handleCloseSend}
          >
            Send
          </button>
        </Modal.Footer>
      </Modal>
      <div className="container">
        <button
          className="btn btn-light mb-2"
          data-mdb-button-init
          onClick={handleShow}
        >
          Contact Me
        </button>
        <a
          className="btn btn-link btn-floating btn-lg text-body m-1"
          href="https://www.linkedin.com/in/andrewlin1368/"
          target="_blank"
          role="button"
          data-mdb-ripple-color="dark"
        >
          <i className="bi bi-linkedin"></i>
        </a>
        <a
          className="btn btn-link btn-floating btn-lg text-body m-1"
          href="https://github.com/andrewlin1368"
          target="_blank"
          role="button"
          data-mdb-ripple-color="dark"
        >
          <i className="bi bi-github"></i>
        </a>
      </div>

      <div
        className="text-center p-2"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2024 Copyright:
        <a className="text-body" href="/">
          {" "}
          StockYelp
        </a>
      </div>
      <Toaster />
    </footer>
  );
}
