import { Input, initMDB } from "mdb-ui-kit";

export default function Footer() {
  initMDB({ Input });
  return (
    <footer className="fixed-bottom bg-body-tertiary text-center">
      <div className="container">
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
    </footer>
  );
}
