import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAddstockMutation,
  useGetOneMutation,
  useEditStockMutation,
} from "../api/stocksApi";
import { useNavigate } from "react-router-dom";

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
      price: stock.price,
      week_high: stock.week_high,
      week_low: stock.week_low,
    });
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
    setSearch(null);
    setStock(null);
  };
  const updateSearch = (e) => setSearch(e.target.value);
  const handleSearch = async () => {
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
    }, 5000);
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
    console.log(result);
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
  console.log(stock);
  return (
    user &&
    user.isadmin && (
      <div>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="display-6">Add a new stock</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mt-1 mb-3">
              <input
                type="text"
                className="form-control"
                name="fullname"
                placeholder="Name"
                onChange={(e) => updateForm(e)}
              />
            </div>
            <div className="form-group mt-3 mb-3">
              <input
                type="text"
                className="form-control"
                name="symbol"
                placeholder="Symbol"
                onChange={(e) => updateForm(e)}
              />
            </div>
            <div className="form-group mt-3 mb-3">
              <textarea
                className="form-control"
                name="description"
                placeholder="Description"
                onChange={(e) => updateForm(e)}
              />
            </div>
            <div className="input-group mt-3 mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="price"
                placeholder="Current Price"
                onChange={(e) => updateForm(e)}
              />
            </div>
            <div className="input-group mt-3 mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="week_low"
                placeholder="52 Week Low"
                onChange={(e) => updateForm(e)}
              />
            </div>
            <div className="input-group mt-3 mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="week_high"
                placeholder="52 Week High"
                onChange={(e) => updateForm(e)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={addNewStock}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="topsection">
          <h1 className="display-6 mt-3 mb-3" style={{ textAlign: "center" }}>
            Welcome @{user.username}!
          </h1>
          <div className="lead" style={{ textAlign: "center" }}>
            Need to add a new stock?{" "}
            <Link style={{ textDecoration: "none" }} onClick={handleShow}>
              Click me!
            </Link>{" "}
            or to edit an existing stock? Search by its symbol below.
          </div>
          <div
            className="input-group mt-3"
            style={{ width: "50%", margin: "auto" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Symbol"
              aria-describedby="basic-addon2"
              onChange={(e) => updateSearch(e)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          {loading && (
            <div className="loader mt-4" style={{ margin: "auto" }}></div>
          )}
          {stock && (
            <div style={{ margin: "auto", width: "50%" }}>
              <h1
                className="display-6 mt-3 mb-3"
                style={{ textAlign: "center" }}
              >
                {stock.fullname}
              </h1>
              <div className="form-group mt-3 mb-3">
                <textarea
                  className="form-control"
                  name="description"
                  placeholder="Description"
                  defaultValue={stock.description}
                  onChange={(e) => editForm(e)}
                />
              </div>
              <div className="input-group mt-3 mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{ width: "125px" }}>
                    Price
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  placeholder="Current Price"
                  defaultValue={stock.price}
                  onChange={(e) => editForm(e)}
                />
              </div>
              <div className="input-group mt-3 mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{ width: "125px" }}>
                    52 Week Low
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  name="week_low"
                  placeholder="52 Week Low"
                  defaultValue={stock.week_low}
                  onChange={(e) => editForm(e)}
                />
              </div>
              <div className="input-group mt-3 mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{ width: "125px" }}>
                    52 Week High
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  name="week_high"
                  defaultValue={stock.week_high}
                  placeholder="52 Week High"
                  onChange={(e) => editForm(e)}
                />
              </div>
              <div style={{ float: "right" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={sendNewUpdate}
                >
                  Confirm
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <ToastContainer></ToastContainer>
      </div>
    )
  );
}
