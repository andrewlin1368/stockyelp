import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { logoutUser } from "../api/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Navbarcomponent() {
  const { token } = useSelector((state) => state.user);
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
            StockYelp
          </Navbar.Brand>
          <Nav className="me-auto lead">
            {!token && <Nav.Link href="/login">Login</Nav.Link>}
            {!token && <Nav.Link href="/register">Register</Nav.Link>}
            {token && <Nav.Link href="/profile">Profile</Nav.Link>}
            {token && (
              <Nav.Link href="" onClick={logout}>
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarcomponent;
