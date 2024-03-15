import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { logoutUser } from "../api/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbarcomponent() {
  const { token, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" className="py-2">
        <Container>
          <Navbar.Brand href="/" className="lead fs-4">
            <i className="bi bi-coin"></i> StockYelp
          </Navbar.Brand>
          <Nav className="ml-auto lead">
            {!token && (
              <Nav.Link className="fs-4">
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Login{" "}
                </Link>
                <i className="bi bi-box-arrow-in-right"></i>
              </Nav.Link>
            )}
            {!token && (
              <Nav.Link className="fs-4">
                <Link to="/register" style={{ textDecoration: "none" }}>
                  Register{" "}
                </Link>
                <i className="bi bi-person-plus-fill"></i>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link className="fs-4">
                <Link to="/profile" style={{ textDecoration: "none" }}>
                  Profile{" "}
                </Link>
                <i className="bi bi-person-circle"></i>
              </Nav.Link>
            )}
            {token && user.isadmin && (
              <Nav.Link className="fs-4">
                <Link to="/admin" style={{ textDecoration: "none" }}>
                  Admin{" "}
                </Link>
                <i className="bi bi-shield-lock"></i>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link onClick={logout} className="fs-4">
                <Link style={{ textDecoration: "none" }}>Logout </Link>
                <i className="bi bi-box-arrow-right"></i>
              </Nav.Link>
            )}
            {"\u00A0"}
            {"\u00A0"}
            {"\u00A0"}
            <Nav.Link className="fs-4">
              <Link style={{ textDecoration: "none" }}> </Link>
              <i
                className="bi bi-linkedin"
                onClick={() => {
                  window.open(
                    "https://www.linkedin.com/in/andrewlin1368/",
                    "_blank"
                  );
                }}
              ></i>{" "}
            </Nav.Link>
            <Nav.Link className="fs-4">
              <Link style={{ textDecoration: "none" }}> </Link>
              <i
                className="bi bi-github"
                onClick={() => {
                  window.open("https://github.com/andrewlin1368", "_blank");
                }}
              ></i>{" "}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarcomponent;
