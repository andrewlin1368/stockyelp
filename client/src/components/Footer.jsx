import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{backgroundColor:"black"}}>
      <Navbar>
        <Container>
          <Navbar.Brand className="logo">
            <Link to="/" className="linksinlogo">
              <i className="bi bi-coin"></i> StockYelp
            </Link>
          </Navbar.Brand>

          <Nav className="nav">
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
    </footer>
  );
}
