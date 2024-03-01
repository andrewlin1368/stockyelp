import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./api/store.js";
import Navbarcomponent from "./components/Navbar.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Navbarcomponent></Navbarcomponent>
      <App />
    </Provider>
  </React.StrictMode>
);
