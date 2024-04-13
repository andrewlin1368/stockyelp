import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import {
  useAddstockMutation,
  useGetOneMutation,
  useEditStockMutation,
} from "../api/stocksApi";
import { Ripple, initMDB } from "mdb-ui-kit";

export default function Admin() {
  initMDB({ Ripple });
  const [addStock] = useAddstockMutation();
  const navigate = useNavigate();
  const [getOne] = useGetOneMutation();
  const [editStockMu] = useEditStockMutation();
  const { user } = useSelector((state) => state.user);
  const [search, setSearch] = useState(null);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    symbol: "",
    description: "",
    price: "",
    week_low: "",
    week_high: "",
  });

  useEffect(() => {
    const valid = () => {
      navigate("/");
    };
    if (!user || (user && !user.isadmin)) valid();
  }, []);

  const updateSearch = (e) => setSearch(e.target.value);
  const handleSearch = async (e) => {
    e.preventDefault();
    setStock(null);
    if (!search) {
      toast.error("All fields must be filled!", {
        position: "top-right",
      });
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      const result = await getOne(search);
      if (result.data.error) {
        toast.error("Stock not found!", {
          position: "top-right",
        });
        setLoading(false);
        return;
      } else {
        setStock(result.data);
        setLoading(false);
        handleShow2();
      }
    }, 3000);
  };

  const editForm = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };
  const sendNewUpdate = async () => {
    if (
      !stock.description.length ||
      !stock.price.length ||
      !stock.week_high.length ||
      !stock.week_low.length
    ) {
      toast.error("All fields must be filled!", {
        position: "top-right",
      });
      return;
    }
    if (stock.description.length > 255) {
      toast.error("Stock's description must not exceed 255 characters!", {
        position: "top-right",
      });
      return;
    }
    if (
      Number(stock.week_high) < 0 ||
      Number(stock.week_low) < 0 ||
      Number(stock.price) < 0
    ) {
      toast.error("Values cannot be negative!", {
        position: "top-right",
      });
      return;
    }
    if (Number(stock.week_high) < Number(stock.week_low)) {
      toast.error(
        "52 Week Low price cannot be greater than 52 Week High price!",
        {
          position: "top-right",
        }
      );
      return;
    }
    if (Number(stock.week_high) < Number(stock.price)) {
      toast.error("52 Week High Price cannot be less than current price!", {
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

    if (result.error) {
      toast.error(result.error.data.error, {
        position: "top-right",
      });
      return;
    } else {
      toast.success("Successfully updated stock!", {
        position: "top-right",
      });
      setSearch(null);
      handleClose2();
    }
  };

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

  const handleShow2 = () => {
    setShow2(true);
  };
  const handleClose2 = () => {
    setShow2(false);
    setStock(null);
  };

  const updateForm = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const addNewStock = async () => {
    if (
      !form.description.length ||
      !form.fullname.length ||
      !form.symbol.length ||
      !form.week_high.length ||
      !form.week_low.length ||
      !form.price.length
    ) {
      toast.error("All fields are required!", {
        position: "top-right",
      });
      return;
    }
    if (form.fullname.length > 50) {
      toast.error("Stock's fullname must not exceed 50 characters!", {
        position: "top-right",
      });
      return;
    }
    if (form.symbol.length > 10) {
      toast.error("Stock's symbol must not exceed 10 characters!", {
        position: "top-right",
      });
      return;
    }
    if (form.description.length > 255) {
      toast.error("Stock's description must not exceed 255 characters!", {
        position: "top-right",
      });
      return;
    }
    if (
      Number(form.week_high) < 0 ||
      Number(form.week_low) < 0 ||
      Number(form.price) < 0
    ) {
      toast.error("Values cannot be negative!", {
        position: "top-right",
      });
      return;
    }
    if (Number(form.week_high) < Number(form.week_low)) {
      toast.error(
        "52 Week Low price cannot be greater than 52 Week High price!",
        {
          position: "top-right",
        }
      );
      return;
    }
    if (Number(form.week_high) < Number(form.price)) {
      toast.error("52 Week High Price cannot be less than current price!", {
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

  return (
    user &&
    user.isadmin && (
      <div className="mt-5 mb-5">
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Add a new stock</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="input mb-3">
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="form-control"
                placeholder="Full Name"
                aria-label="Full Name"
                aria-describedby="basic-addon1"
                onChange={(e) => updateForm(e)}
              />
            </div>
            <div className="input mb-3">
              <input
                type="text"
                id="symbol"
                name="symbol"
                className="form-control"
                placeholder="Symbol"
                aria-label="Symbol"
                aria-describedby="basic-addon1"
                onChange={(e) => updateForm(e)}
              />
            </div>
            <div className="input mb-3">
              <textarea
                name="description"
                placeholder="Description"
                className="form-control rounded"
                aria-label="With textarea"
                onChange={(e) => updateForm(e)}
              ></textarea>
            </div>

            <div className="input-group mb-3">
              <input
                type="number"
                name="price"
                placeholder="Current Price"
                aria-label="Current Price"
                className="form-control"
                onChange={(e) => updateForm(e)}
              />
              <input
                type="number"
                name="week_low"
                placeholder="52 Week Low"
                aria-label="52 Week Low"
                className="form-control"
                onChange={(e) => updateForm(e)}
              />
              <input
                type="number"
                name="week_high"
                placeholder="52 Week High"
                aria-label="52 Week High"
                className="form-control"
                onChange={(e) => updateForm(e)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              data-mdb-ripple-init
              onClick={addNewStock}
            >
              Add stock
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={show2} onHide={handleClose2} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{stock?.fullname}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="input mb-3">
              <textarea
                name="description"
                placeholder="Description"
                className="form-control rounded"
                aria-label="With textarea"
                defaultValue={stock?.description}
                onChange={(e) => editForm(e)}
              ></textarea>
            </div>

            <div className="input-group mb-3">
              <input
                type="number"
                name="price"
                placeholder="Current Price"
                aria-label="Current Price"
                className="form-control"
                defaultValue={Number(stock?.price).toFixed(2)}
                onChange={(e) => editForm(e)}
              />
              <input
                type="number"
                name="week_low"
                placeholder="52 Week Low"
                aria-label="52 Week Low"
                className="form-control"
                defaultValue={Number(stock?.week_low).toFixed(2)}
                onChange={(e) => editForm(e)}
              />
              <input
                type="number"
                name="week_high"
                placeholder="52 Week High"
                aria-label="52 Week High"
                className="form-control"
                defaultValue={Number(stock?.week_high).toFixed(2)}
                onChange={(e) => editForm(e)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              data-mdb-ripple-init
              onClick={sendNewUpdate}
            >
              Update Stock
            </button>
          </Modal.Footer>
        </Modal>

        <div className="admin_search">
          <h1>Welcome @{user.username}!</h1>
          <p>
            Need to add a new stock? <Link onClick={handleShow}>Click me!</Link>{" "}
            or need to edit an existing stock? Search by its symbol below and
            then fill out the form.
          </p>
          <form onSubmit={handleSearch}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Symbol"
                aria-label="Symbol"
                aria-describedby="button-addon2"
                onChange={(e) => updateSearch(e)}
              />
              <button
                className="btn btn-outline-secondary"
                type="submit"
                id="button-addon2"
                data-mdb-ripple-init
                data-mdb-ripple-color="dark"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="admin_search_load">
          {loading && (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
        <Toaster />
      </div>
    )
  );
}
