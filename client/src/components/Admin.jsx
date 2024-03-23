import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAddstockMutation,
  useGetOneMutation,
  useEditStockMutation,
} from "../api/stocksApi";
import { useNavigate } from "react-router-dom";
import "./admin.css";

export default function Admin() {
  const [getOne] = useGetOneMutation();
  const [search, setSearch] = useState(null);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const editForm = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };
  const [editStockMu] = useEditStockMutation();
  const sendNewUpdate = async () => {
    if (
      !stock.description.length ||
      !stock.price.length ||
      !stock.week_high.length ||
      !stock.week_low.length
    ) {
      toast.error("All fields must be filled", {
        position: "top-right",
      });
      return;
    }
    if (stock.description.length > 255) {
      toast.error("Stock's description must not exceed 255 characters", {
        position: "top-right",
      });
      return;
    }
    if (
      Number(stock.week_high) < 0 ||
      Number(stock.week_low) < 0 ||
      Number(stock.price) < 0
    ) {
      toast.error("Values cannot be negative", {
        position: "top-right",
      });
      return;
    }
    if (Number(stock.week_high) < Number(stock.week_low)) {
      toast.error(
        "52 Week Low price cannot be greater than 52 Week High price",
        {
          position: "top-right",
        }
      );
      return;
    }
    if (Number(stock.week_high) < Number(stock.price)) {
      toast.error("52 Week High Price cannot be less than current price", {
        position: "top-right",
      });
      return;
    }
    const result = await editStockMu({
      stock_id: stock.stock_id,
      description: stock.description,
      price: Number(stock.price),
      week_high: Number(stock.week_high),
      week_low: Number(stock.week_low),
    });
    console.log(result);
    if (result.error) {
      toast.error(result.error.data.error, {
        position: "top-right",
      });
      return;
    } else {
      toast.success("Successfully updated stock", {
        position: "top-right",
      });
      setSearch(null);
      setStock(null);
    }
  };
  const cancelEdit = () => {
    // setSearch(null);
    setStock(null);
  };
  const updateSearch = (e) => setSearch(e.target.value);
  const handleSearch = async () => {
    setStock(null);
    if (!search) {
      toast.error("All fields must be filled", {
        position: "top-right",
      });
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      const result = await getOne(search);
      if (result.data.error) {
        toast.error("Stock not found", {
          position: "top-right",
        });
        setLoading(false);
        return;
      } else {
        setStock(result.data);
        setLoading(false);
      }
    }, 3000);
  };
  const [addStock] = useAddstockMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    symbol: "",
    description: "",
    price: "",
    week_low: "",
    week_high: "",
  });
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setForm({
      fullname: "",
      symbol: "",
      description: "",
      price: "",
      week_low: "",
      week_high: "",
    });
  };
  const handleShow = () => setShow(true);
  const addNewStock = async () => {
    if (
      !form.description.length ||
      !form.fullname.length ||
      !form.symbol.length ||
      !form.week_high.length ||
      !form.week_low.length ||
      !form.price.length
    ) {
      toast.error("All fields are required", {
        position: "top-right",
      });
      return;
    }
    if (form.fullname.length > 50) {
      toast.error("Stock's fullname must not exceed 50 characters", {
        position: "top-right",
      });
      return;
    }
    if (form.symbol.length > 10) {
      toast.error("Stock's symbol must not exceed 10 characters", {
        position: "top-right",
      });
      return;
    }
    if (form.description.length > 255) {
      toast.error("Stock's description must not exceed 255 characters", {
        position: "top-right",
      });
      return;
    }
    if (
      Number(form.week_high) < 0 ||
      Number(form.week_low) < 0 ||
      Number(form.price) < 0
    ) {
      toast.error("Values cannot be negative", {
        position: "top-right",
      });
      return;
    }
    if (Number(form.week_high) < Number(form.week_low)) {
      toast.error(
        "52 Week Low price cannot be greater than 52 Week High price",
        {
          position: "top-right",
        }
      );
      return;
    }
    if (Number(form.week_high) < Number(form.price)) {
      toast.error("52 Week High Price cannot be less than current price", {
        position: "top-right",
      });
      return;
    }
    const result = await addStock({
      ...form,
      price: Number(form.week_high),
      week_low: Number(form.week_low),
      week_high: Number(form.week_high),
    });
    if (result.data.error)
      toast.error(result.data.error, {
        position: "top-right",
      });
    else {
      handleClose();
      toast.success("Successfully created stock!", { position: "top-right" });
    }
  };
  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const valid = () => {
      navigate("/");
    };
    if (!user || (user && !user.isadmin)) valid();
  }, []);

  return (
    user &&
    user.isadmin && (
      <div className="textp">
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="display-6 mb-0">Add a new stock</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              className="forma"
              name="fullname"
              placeholder="Name"
              onChange={(e) => updateForm(e)}
            />

            <input
              type="text"
              name="symbol"
              className="forma"
              placeholder="Symbol"
              onChange={(e) => updateForm(e)}
            />

            <textarea
              className="forma"
              name="description"
              placeholder="Description"
              onChange={(e) => updateForm(e)}
            />

            <input
              type="number"
              className="forma"
              name="price"
              placeholder="Current Price"
              onChange={(e) => updateForm(e)}
            />

            <input
              type="number"
              className="forma"
              name="week_low"
              placeholder="52 Week Low"
              onChange={(e) => updateForm(e)}
            />

            <input
              type="number"
              className="forma"
              name="week_high"
              placeholder="52 Week High"
              onChange={(e) => updateForm(e)}
            />
          </Modal.Body>
          <Modal.Footer>
            <input
              type="submit"
              className="formp mb-0"
              onClick={addNewStock}
              value="Add Stock"
            />
          </Modal.Footer>
        </Modal>
        <div className="topsection">
          <h1 className="display-4 mt-3 mb-3">Welcome @{user.username}!</h1>
          <div className="nolc">
            Need to add a new stock?{" "}
            <Link className="loginap" onClick={handleShow}>
              Click me!
            </Link>{" "}
            or need to edit an existing stock? Search by its symbol below and
            then fill out the form.
          </div>
          <div className="symbolsearch">
            <input
              type="text"
              className="forma"
              placeholder="Symbol"
              onChange={(e) => updateSearch(e)}
            />
            <input
              type="submit"
              className="forma mb-3"
              onClick={handleSearch}
              value="Search"
            />
          </div>
        </div>
        <div className="bottomsection">
          {loading && (
            <div className="mt-5" style={{ textAlign: "center" }}>
              <div className="spinner-grow text-dark">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-dark">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="spinner-grow text-dark">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {stock && (
            <div className="searchFormEdit mb-5">
              <h1 className="display-6">{stock.fullname}</h1>
              <p className="la">Description</p>
              <textarea
                className="forma"
                name="description"
                placeholder="Description"
                defaultValue={stock.description}
                onChange={(e) => editForm(e)}
              />
              <p className="la">Current Price</p>
              <input
                type="number"
                className="forma"
                name="price"
                placeholder="Current Price"
                defaultValue={Number(stock.price).toFixed(2)}
                onChange={(e) => editForm(e)}
              />
              <p className="la">52 Week Low</p>
              <input
                type="number"
                className="forma"
                name="week_low"
                placeholder="52 Week Low"
                defaultValue={Number(stock.week_low).toFixed(2)}
                onChange={(e) => editForm(e)}
              />
              <p className="la">52 Week High</p>
              <input
                type="number"
                className="forma"
                name="week_high"
                defaultValue={Number(stock.week_high).toFixed(2)}
                placeholder="52 Week High"
                onChange={(e) => editForm(e)}
              />

              <div className="row m-auto mt-2">
                <div className="col-sm-7" />
                <input
                  type="submit"
                  onClick={cancelEdit}
                  className="forma mb-3 col-sm-2"
                  value="Cancel"
                />
                <div className="col-sm-1" />
                <input
                  type="submit"
                  className="forma mb-3 col-sm-2"
                  onClick={sendNewUpdate}
                  value="Update"
                />
              </div>
            </div>
          )}
        </div>
        <ToastContainer></ToastContainer>
      </div>
    )
  );
}
