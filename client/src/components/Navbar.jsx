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
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/" className="lead">
            <i className="bi bi-coin"></i> StockYelp
          </Navbar.Brand>
          <Nav className="me-auto lead">
            {!token && (
              <Nav.Link>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Login{" "}
                </Link>
                <i className="bi bi-box-arrow-in-right"></i>
              </Nav.Link>
            )}
            {!token && (
              <Nav.Link>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  Register{" "}
                </Link>
                <i className="bi bi-person-plus-fill"></i>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link>
                <Link to="/profile" style={{ textDecoration: "none" }}>
                  Profile{" "}
                </Link>
                <i className="bi bi-person-circle"></i>
              </Nav.Link>
            )}
            {token && user.isadmin && (
              <Nav.Link>
                <Link to="/admin" style={{ textDecoration: "none" }}>
                  Admin{" "}
                </Link>
                <i className="bi bi-shield-lock"></i>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link onClick={logout}>
                <Link style={{ textDecoration: "none" }}>Logout </Link>
                <i className="bi bi-box-arrow-right"></i>
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarcomponent;
