import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./api/store.js";
import Navbarcomponent from "./components/Navbar.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Navbarcomponent></Navbarcomponent>
        <Routes>
          <Route path="/" element={<App></App>}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
