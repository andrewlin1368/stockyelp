import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../api/userSlice";
import { Collapse, Ripple, initMDB } from "mdb-ui-kit";

function Navbarcomponent() {
  initMDB({ Collapse, Ripple });
  const { token, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };
  return (
    <>
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
