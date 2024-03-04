import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { logoutUser } from "../api/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
              <Nav.Link href="/login">
                Login <i className="bi bi-box-arrow-in-right"></i>
              </Nav.Link>
            )}
            {!token && (
              <Nav.Link href="/register">
                Register <i className="bi bi-person-plus-fill"></i>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link href="/profile">
                Profile <i className="bi bi-person-circle"></i>
              </Nav.Link>
            )}
            {token && user.isadmin && (
              <Nav.Link href="/admin">
                Admin <i className="bi bi-shield-lock"></i>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link href="" onClick={logout}>
                Logout <i className="bi bi-box-arrow-right"></i>
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarcomponent;
