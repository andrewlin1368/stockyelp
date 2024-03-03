import { useGetAllStocksQuery } from "./api/stocksApi";
import Stocks from "./components/Stocks";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";
import Navbarcomponent from "./components/Navbar.jsx";

function App() {
  const { isLoading } = useGetAllStocksQuery();
  // return <>{(isLoading && <>Loading...</>) || <Stocks></Stocks>}</>;
  return (
    <BrowserRouter>
      <Navbarcomponent></Navbarcomponent>
      <Routes>
        <Route path="/" element={<Stocks></Stocks>}></Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/profile" element={<Profile></Profile>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
