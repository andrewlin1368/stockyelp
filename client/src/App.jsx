import { useGetAllStocksQuery } from "./api/stocksApi";
import Stocks from "./components/Stocks";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";
import Navbarcomponent from "./components/Navbar.jsx";
import Admin from "./components/Admin.jsx";
import { useEffect, useState } from "react";
import loading from "./assets/loading.webp";

function App() {
  const [load, setLoad] = useState(false);
  const { isLoading } = useGetAllStocksQuery();
  // return <>{(isLoading && <>Loading...</>) || <Stocks></Stocks>}</>;
  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 4000);
  }, []);
  return !load ? (
    <div>
      <img src={loading} alt="loading" width="100%" height="auto" />
    </div>
  ) : (
    <BrowserRouter>
      <Navbarcomponent></Navbarcomponent>
      <Routes>
        <Route path="/" element={<Stocks></Stocks>}></Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/profile" element={<Profile></Profile>}></Route>
        <Route path="/admin" element={<Admin></Admin>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
