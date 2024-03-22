import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { logoutUser } from "../api/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbarcomponent() {
  const { token, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  return (
    <header>
      <Navbar>
        <Container>
          <Navbar.Brand className="logo">
            <Link to="/" className="linksinlogo">
              <i className="bi bi-coin"></i> StockYelp
            </Link>
          </Navbar.Brand>

          <Nav className="nav">
            {!token && (
              <Nav.Link>
                <Link to="/login" className="links">
                  Login <i className="bi bi-box-arrow-in-right"></i>
                </Link>
              </Nav.Link>
            )}
            {!token && (
              <Nav.Link>
                <Link to="/register" className="links">
                  Register <i className="bi bi-person-plus-fill"></i>
                </Link>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link>
                <Link to="/profile" className="links">
                  Profile <i className="bi bi-person-circle"></i>
                </Link>
              </Nav.Link>
            )}
            {token && user.isadmin && (
              <Nav.Link>
                <Link to="/admin" className="links">
                  Admin <i className="bi bi-shield-lock"></i>
                </Link>
              </Nav.Link>
            )}
            {token && (
              <Nav.Link onClick={logout}>
                <Link className="links">
                  Logout <i className="bi bi-box-arrow-right"></i>
                </Link>
              </Nav.Link>
            )}
            <Nav.Link>
              <Link className="links">
                <i
                  className="bi bi-linkedin"
                  onClick={() => {
                    window.open(
                      "https://www.linkedin.com/in/andrewlin1368/",
                      "_blank"
                    );
                  }}
                ></i>
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link className="links">
                <i
                  className="bi bi-github"
                  onClick={() => {
                    window.open("https://github.com/andrewlin1368", "_blank");
                  }}
                ></i>{" "}
              </Link>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

export default Navbarcomponent;
