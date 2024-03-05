import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  Modal,
  Col,
  Container,
  Row,
  Form,
  Button,
  Carousel,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./stocks.css";
import { useGetProfileMutation } from "../api/userApi";
import {
  useFollowMutation,
  useUnfollowMutation,
  useUpvoteMutation,
  useDownvoteMutation,
  useEditcommentMutation,
  useAddcommentMutation,
  useRemovecommentMutation,
} from "../api/stocksApi";
import { useDispatch } from "react-redux";
import { removeProfile } from "../api/userSlice.js";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uber from "../assets/uber.png";
import nvidia from "../assets/nvidia.png";
import amd from "../assets/amd.png";
import spotify from "../assets/spotify.png";
import groupon from "../assets/groupon.png";

export default function Stocks() {
  const [removingComment] = useRemovecommentMutation();
  const [addingComment] = useAddcommentMutation();
  const [editingComment] = useEditcommentMutation();
  const dispatch = useDispatch();
  const [followStock] = useFollowMutation();
  const [unfollowStock] = useUnfollowMutation();
  const [upvoteStock] = useUpvoteMutation();
  const [downvoteStock] = useDownvoteMutation();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [stock, setStock] = useState(null);
  const [user_id, setUser_Id] = useState(-1);
  const [displayStocks, setDisplayStocks] = useState([]);
  const { stocks } = useSelector((state) => state.stocks);
  const [edit, setEdit] = useState(false);
  const [editMessage, setEditMessage] = useState({
    message: null,
    comment_id: null,
  });
  const updateCommentMessage = (e) => {
    setEditMessage({ ...editMessage, message: e.target.value });
  };
  const handleEditClose = async () => {
    if (!editMessage.message.length) {
      toast.error("Comment cannot be empty!", {
        position: "top-right",
      });
      setEditMessage({ message: null, comment_id: null });
      setEdit(false);
    }
    const result = await editingComment(editMessage);
    if (!result.error) {
      const updateStock = {
        ...stock,
        comments: stock.comments.map((comment) =>
          comment.comment_id === result.data.comment_id ? result.data : comment
        ),
      };
      setStock(updateStock);
      setEditMessage({ message: null, comment_id: null });
    }
    setEdit(false);
  };
  const handleEditShow = (e) => {
    setEdit(true);
  };
  const editComment = (e) => {
    const data = {
      message: e.target.dataset.message,
      comment_id: Number(e.target.id),
    };
    setEditMessage(data);
    handleEditShow();
  };
  const { profile, token, user, extra_following, following } = useSelector(
    (state) => state.user
  );
  const [newMessage, setNewMessage] = useState("Add a comment...");
  const updateAddMessage = (e) => {
    setNewMessage(e.target.value);
  };
  const addComment = async (e) => {
    e.preventDefault();
    if (newMessage === "Add a comment..." || !newMessage.length) {
      setNewMessage("Add a comment...");
      return;
    }
    if (newMessage.length > 499) {
      toast.error("Comment is too long!", {
        position: "top-right",
      });
      return;
    }
    const result = await addingComment({
      stock_id: Number(e.target.id),
      message: newMessage,
    });
    if (!result.error) {
      const comments = Object.assign([], stock.comments);
      comments.unshift(result.data);
      const updateStock = {
        ...stock,
        comments,
      };
      setStock(updateStock);
      setNewMessage("Add a comment...");
    }
  };
  const removeComment = async (e) => {
    const result = await removingComment(Number(e.target.id));
    if (!result.error) {
      const updateStock = {
        ...stock,
        comments: stock.comments.map((comment) =>
          comment.comment_id === result.data.comment_id ? result.data : comment
        ),
      };
      setStock(updateStock);
    }
  };
  const [prof] = useGetProfileMutation();
  const handleClose = () => {
    setShow(false);
    setStock(null);
  };
  const handleShow = (e) => {
    setShow(true);
    setStock(stocks[Number(e.target.id) - 1]);
  };
  const handleClose2 = () => {
    setShow2(false);
    dispatch(removeProfile());
    setUser_Id(-1);
  };
  const handleShow2 = () => setShow2(true);
  const follow = (e) => {
    if (!token) {
      toast.error("Login to follow this stock!", {
        position: "top-right",
      });
    } else followStock(Number(e.target.id));
  };
  const unfollow = (e) => {
    unfollowStock(Number(e.target.id));
  };
  useEffect(() => {
    const getProf = () => {
      prof({ user_id });
    };
    if (user_id > -1) getProf();
  }, [user_id]);
  useEffect(() => {
    setDisplayStocks(stocks);
  }, [stocks]);
  const getProfile = (e) => {
    setUser_Id(Number(e.target.id));
    handleShow2();
  };
  const upvoter = async (e) => {
    if (!token)
      toast.error("Login to upvote this stock!", {
        position: "top-right",
      });
    else {
      const result = await upvoteStock(Number(e.target.id));
      if (!result.error) {
        const updatedStock = {
          ...stock,
          upvotes: result.data.upvotes,
          downvotes: result.data.downvotes,
        };
        setStock(updatedStock);
      } else {
        toast.error(result.error.data.error, {
          position: "top-right",
        });
      }
    }
  };
  const downvoter = async (e) => {
    if (!token)
      toast.error("Login to downvote this stock!", {
        position: "top-right",
      });
    else {
      const result = await downvoteStock(Number(e.target.id));
      if (!result.error) {
        const updatedStock = {
          ...stock,
          upvotes: result.data.upvotes,
          downvotes: result.data.downvotes,
        };
        setStock(updatedStock);
      } else {
        toast.error(result.error.data.error, {
          position: "top-right",
        });
      }
    }
  };

  const updateSearch = (e) => {
    const newDisplayStocks = stocks.filter((displayStock) => {
      return displayStock.symbol.includes(e.target.value.toUpperCase());
    });
    setDisplayStocks(newDisplayStocks);
  };
  return (
    <>
      {edit && (
        <Modal show={edit} onHide={handleEditClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="display-6">Edit Comment</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mt-1 mb-3">
              <input
                type="text"
                className="form-control"
                defaultValue={editMessage.message}
                onChange={(e) => updateCommentMessage(e)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleEditClose}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {profile && (
        <Modal show={show2} onHide={handleClose2} size="s" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="display-6">
                @{profile.user.username} is watching...
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Container>
            <Row>
              <Col xs={18} md={12}>
                {!profile.following.length ? (
                  <p className="lead mt-4 mb-4">
                    This user is not following any stocks...
                  </p>
                ) : (
                  <div className="table-wrapper-scroll-y my-custom-scrollbar2">
                    <table className="table table-bordered table-striped mb-0">
                      {profile.following.map((stock) => {
                        return (
                          <React.Fragment key={stock.stock_id}>
                            <div className="card-body p-4">
                              <div className="d-flex flex-start">
                                <div>
                                  <p className="lead mb-0">
                                    <strong>
                                      {stocks[stock.stock_id - 1].symbol}
                                    </strong>
                                    - {stocks[stock.stock_id - 1].fullname}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <hr className="my-0" />
                          </React.Fragment>
                        );
                      })}
                    </table>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Modal>
      )}
      {stock && (
        <Modal show={show} onHide={handleClose} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="display-6">
                {(extra_following[stock.stock_id] && (
                  <Link style={{ color: "#FFDF00" }}>
                    <i
                      className="bi bi-star-fill"
                      title="unfollow"
                      id={stock.stock_id}
                      onClick={(e) => unfollow(e)}
                    ></i>
                  </Link>
                )) || (
                  <Link style={{ color: "#FFDF00" }}>
                    <i
                      className="bi bi-star"
                      title="follow"
                      id={stock.stock_id}
                      onClick={(e) => follow(e)}
                    ></i>
                  </Link>
                )}{" "}
                <strong>{stock.symbol.split(" ").join("")}</strong> -{" "}
                {stock.fullname}{" "}
                <Link style={{ textDecoration: "none", color: "gray" }}>
                  <i
                    className="bi bi-caret-up"
                    title="upvote"
                    onClick={(e) => upvoter(e)}
                    id={stock.stock_id}
                  >
                    {" "}
                  </i>
                </Link>{" "}
                {stock.upvotes}{" "}
                <Link style={{ textDecoration: "none", color: "gray" }}>
                  <i
                    className="bi bi-caret-down"
                    title="downvote"
                    onClick={(e) => downvoter(e)}
                    id={stock.stock_id}
                  >
                    {" "}
                  </i>
                </Link>{" "}
                {stock.downvotes}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Container>
            <Row>
              <Col xs={6} md={4}>
                <Modal.Body>
                  <p className="lead">{stock.description}</p>
                  <hr />
                  <div className="lead">
                    <p>
                      <strong>Last Updated: </strong>
                      {stock.current_data.split("T")[0]}
                    </p>
                    <p>
                      <strong>Price:</strong> ${stock.price}
                    </p>
                    <p>
                      <strong>52 Week Low:</strong> ${stock.week_low}
                    </p>
                    <p>
                      <strong>52 Week High:</strong> ${stock.week_high}
                    </p>
                  </div>
                  <hr />
                </Modal.Body>
              </Col>
              <Col xs={12} md={8}>
                {(token && (
                  <div className="form-outline mb-4 mt-4">
                    <form id={stock.stock_id} onSubmit={(e) => addComment(e)}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={newMessage}
                        onChange={(e) => updateAddMessage(e)}
                      />
                    </form>
                  </div>
                )) || (
                  <>
                    <p className="lead mt-3">
                      <Link to="/login" style={{ textDecoration: "none" }}>
                        Login
                      </Link>{" "}
                      to comment on this stock.
                    </p>
                  </>
                )}
                <hr className="my-0" />
                {stock.comments &&
                  ((!stock.comments.length && (
                    <h1 className="display-6 mt-2">
                      Be the first to comment...
                    </h1>
                  )) || (
                    <div className="table-wrapper-scroll-y my-custom-scrollbar">
                      <table className="table table-bordered table-striped mb-0">
                        {stock.comments.map((comment) => {
                          return (
                            <React.Fragment key={comment.comment_id}>
                              <div className="card-body p-4">
                                <div className="d-flex flex-start">
                                  <div>
                                    <p className="lead mb-0">
                                      <Link style={{ textDecoration: "none" }}>
                                        <strong
                                          className="text-primary lead"
                                          title="view user"
                                          id={comment.user_id}
                                          onClick={(e) => {
                                            getProfile(e);
                                          }}
                                        >
                                          @{comment.username}
                                        </strong>
                                      </Link>{" "}
                                      <small>
                                        {" "}
                                        <i className="bi bi-clock-history"></i>{" "}
                                        {comment.created_at.split("T")[0]}
                                      </small>
                                    </p>

                                    {(!comment.isdeleted && (
                                      <p className="mb-0 lead">
                                        {comment.message}{" "}
                                        {token &&
                                          comment.user_id === user.user_id && (
                                            <>
                                              <Link style={{ color: "gray" }}>
                                                <i
                                                  className="bi bi-pencil"
                                                  title="edit"
                                                  id={comment.comment_id}
                                                  data-message={comment.message}
                                                  onClick={(e) =>
                                                    editComment(e)
                                                  }
                                                ></i>
                                              </Link>{" "}
                                              <Link style={{ color: "gray" }}>
                                                <i
                                                  className="bi bi-trash"
                                                  id={comment.comment_id}
                                                  onClick={(e) =>
                                                    removeComment(e)
                                                  }
                                                  title="delete"
                                                ></i>
                                              </Link>
                                            </>
                                          )}
                                      </p>
                                    )) || (
                                      <p className="mb-0 lead">
                                        <del>{comment.message}</del>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <hr className="my-0" />
                            </React.Fragment>
                          );
                        })}
                      </table>
                    </div>
                  ))}
              </Col>
            </Row>
          </Container>
        </Modal>
      )}
      <>
        <div
          className="input-group mb-3 mt-2"
          style={{ width: "70%", margin: "auto" }}
        >
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              <i className="bi bi-search"></i>
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={(e) => updateSearch(e)}
          />
        </div>
      </>
      <div className="topParent">
        <div className="stockgraphs">
          <div className="container">
            <div className="row">
              <div className="panel panel-default">
                <table className="table table-fixed">
                  <tbody>
                    {stocks.length ? (
                      stocks.map((stock) => {
                        return (
                          <tr key={stock.stock_id}>
                            <td className="col-xs-12 lead">
                              <span style={{ fontWeight: "bold" }}>
                                {stock.symbol.split(" ").join("")}
                              </span>{" "}
                              ${stock.price}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <div className="loader"></div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="rightside">
          <div className="topright mt-0 " style={{ margin: "auto" }}>
            <Carousel>
              <Carousel.Item interval={4000}>
                <img src={uber} alt="UBER" height="300px" />
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <img src={nvidia} alt="NVIDIA" height="300px" />
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <img src={amd} alt="AMD" height="300px" />
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <img src={spotify} alt="SPOTIFY" height="300px" />
              </Carousel.Item>
              <Carousel.Item interval={4000}>
                <img src={groupon} alt="GROUPON" height="300px" />
              </Carousel.Item>
            </Carousel>
          </div>
          <hr className="hr" />
          <div className="lead mb-3" style={{ textAlign: "center" }}>
            <strong>Checkout any stocks by clicking on them!</strong>
          </div>
          <div className="cardParent">
            {displayStocks.map((stock) => {
              return (
                <div
                  className="stockscards lead"
                  key={stock.stock_id}
                  id={stock.stock_id}
                >
                  <Link style={{ textDecoration: "none" }}>
                    <strong
                      title="Click to see more details"
                      id={stock.stock_id}
                      onClick={(e) => handleShow(e)}
                    >
                      {stock.symbol.split(" ").join("")}
                    </strong>
                  </Link>
                  {"\u00A0"}
                  {"|"}
                  {"\u00A0"}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}
