import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Modal, Carousel } from "react-bootstrap";
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
import bg from "../assets/bglr.jpg";

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
  const addComment = async () => {
    if (newMessage === "Add a comment..." || !newMessage.length) {
      setNewMessage("Add a comment...");
      return toast.error("Comment cannot be empty!", {
        position: "top-right",
      });
    }
    let found = false;
    const words = {
      NIGGA: 1,
      NIG: 1,
      NIQQA: 1,
      ASSHOLE: 1,
      FUCK: 1,
      BITCH: 1,
      HOE: 1,
      RAPE: 1,
      ASSWIPE: 1,
      CUNT: 1,
      ASS: 1,
      DICK: 1,
    };
    const check = newMessage.split(" ");
    for (let char of check)
      if (words[char.toUpperCase()]) {
        found = true;
        break;
      }
    if (found) {
      return toast.error("Profanity detected!", {
        position: "top-right",
      });
    }
    if (newMessage.length > 499) {
      toast.error("Comment is too long!", {
        position: "top-right",
      });
      return;
    }
    const result = await addingComment({
      stock_id: Number(Number(idComment)),
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
      handleCloseCom();
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

  const [showCom, setShowCom] = useState(false);

  const handleCloseCom = () => {
    setShowCom(false);
    setNewMessage("Add a comment...");
    setIdComment(null);
  };
  const handleShowCom = (e) => {
    setIdComment(e.target.id);
    setShowCom(true);
  };

  const [idComment, setIdComment] = useState(null);

  return (
    <div>
      <Modal show={showCom} onHide={handleCloseCom} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="display-6 mb-0">New Comment</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            type="text"
            className="forma mt-0 mb-1"
            placeholder={newMessage}
            onChange={(e) => updateAddMessage(e)}
          />
        </Modal.Body>
        <Modal.Footer>
          <input
            type="submit"
            className="formp mb-0"
            value="Post"
            onClick={addComment}
          />
        </Modal.Footer>
      </Modal>
      {edit && (
        <Modal show={edit} onHide={handleEditClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="display-6 mb-0">Edit Comment</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mt-1 mb-3">
              <input
                type="text"
                className="forma"
                defaultValue={editMessage.message}
                onChange={(e) => updateCommentMessage(e)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <input
              type="submit"
              className="formp mb-0"
              onClick={handleEditClose}
              value="Edit"
            />
          </Modal.Footer>
        </Modal>
      )}
      {profile && (
        <Modal
          show={show2}
          onHide={handleClose2}
          size="s"
          centered
          className="textp"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="display-6 mb-0">
                @{profile.user.username} likes...
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!profile.following.length ? (
              <p className="msg">
                @{profile.user.username} is not liking any stocks...
              </p>
            ) : (
              <div className="table-wrapper-scroll-ypl my-custom-scrollbarpl">
                <table className="table table-bordered table-striped mb-0">
                  {profile.following.map((stock) => {
                    return (
                      <React.Fragment key={stock.stock_id}>
                        <div className="card-body p-1">
                          <div className="d-flex flex-start">
                            <div>
                              <p className="lead mb-0">
                                <strong>
                                  {stocks[stock.stock_id - 1].symbol}
                                </strong>{" "}
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
          </Modal.Body>
        </Modal>
      )}
      {stock && (
        <Modal show={show} onHide={handleClose} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 className="stockheadmodal mb-0">
                {(extra_following[stock.stock_id] && (
                  <Link>
                    <i
                      className="bi bi-star-fill"
                      // title="unfollow"
                      id={stock.stock_id}
                      onClick={(e) => unfollow(e)}
                    ></i>
                  </Link>
                )) || (
                  <Link>
                    <i
                      className="bi bi-star"
                      // title="follow"
                      id={stock.stock_id}
                      onClick={(e) => follow(e)}
                    ></i>
                  </Link>
                )}{" "}
                {stock.symbol.split(" ").join("")} - {stock.fullname}{" "}
                <Link>
                  <i
                    className="bi bi-caret-up-fill"
                    // title="upvote"
                    onClick={(e) => upvoter(e)}
                    id={stock.stock_id}
                  ></i>
                </Link>
                {stock.upvotes}{" "}
                <Link>
                  <i
                    className="bi bi-caret-down-fill"
                    // title="downvote"
                    onClick={(e) => downvoter(e)}
                    id={stock.stock_id}
                  ></i>
                </Link>
                {stock.downvotes}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="textp">
            <div className="stockdetails1">
              <p>{stock.description}</p>
              <div className="row">
                <strong className="col-sm">
                  Last Updated: {stock.current_data.split("T")[0]}
                </strong>
                <strong className="col-sm">
                  Price: ${Number(stock.price).toFixed(2)}
                </strong>
                <strong className="col-sm">
                  52 Week Low: ${Number(stock.week_low).toFixed(2)}
                </strong>{" "}
                <strong className="col-sm">
                  52 Week High: {Number(stock.week_high).toFixed(2)}
                </strong>
              </div>
              <hr />
            </div>
            <div className="stockdetails2">
              {(token && (
                <div style={{ textAlign: "center" }}>
                  <input
                    id={stock.stock_id}
                    type="submit"
                    onClick={handleShowCom}
                    className="formp mb-2 mt-0"
                    value="New Comment"
                  />
                </div>
              )) || (
                <>
                  <p className=" msg mb-2">
                    <Link className="logina" to="/login">
                      Login
                    </Link>{" "}
                    to comment.
                  </p>
                </>
              )}
              <hr className="my-0" />
              {stock.comments &&
                ((!stock.comments.length && (
                  <h1
                    className="display-6 mt-4 mb-2"
                    style={{ textAlign: "center" }}
                  >
                    Be the first to comment...
                  </h1>
                )) || (
                  <div className="table-wrapper-scroll-yp my-custom-scrollbarp">
                    <table className="table table-bordered table-striped">
                      {stock.comments.map((comment) => {
                        return (
                          <React.Fragment key={comment.comment_id}>
                            <div className="card-body p-1">
                              <div>
                                <div>
                                  <p className="mb-0 ">
                                    <Link className="logina">
                                      <strong
                                        className="text-primary lead"
                                        // title="view user"
                                        id={comment.user_id}
                                        onClick={(e) => {
                                          getProfile(e);
                                        }}
                                      >
                                        @{comment.username}
                                      </strong>
                                    </Link>{" "}
                                    <small style={{ float: "right" }}>
                                      <i className="bi bi-clock-history"></i>{" "}
                                      {comment.created_at.split("T")[0]}
                                    </small>
                                  </p>

                                  {(!comment.isdeleted && (
                                    <p className="mb-0">
                                      {comment.message}{" "}
                                      {token &&
                                        comment.user_id === user.user_id && (
                                          <span style={{ float: "right" }}>
                                            <Link>
                                              <i
                                                className="bi bi-pencil-fill fs-5"
                                                // title="edit"
                                                id={comment.comment_id}
                                                data-message={comment.message}
                                                onClick={(e) => editComment(e)}
                                              ></i>
                                            </Link>{" "}
                                            <Link>
                                              <i
                                                className="bi bi-trash-fill fs-5"
                                                id={comment.comment_id}
                                                onClick={(e) =>
                                                  removeComment(e)
                                                }
                                                // title="delete"
                                              ></i>
                                            </Link>
                                          </span>
                                        )}
                                    </p>
                                  )) || (
                                    <p className="removed mb-0">
                                      This message has been deleted...
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
            </div>
          </Modal.Body>
        </Modal>
      )}

      <div className="page">
        <div className="topParent">
          <div className="carcar fadeIn third">
            <Carousel>
              <Carousel.Item interval={3000}>
                <Link>
                  <img
                    src={uber}
                    alt="UBER"
                    height="150px"
                    onClick={() => {
                      window.open("https://www.uber.com/", "_blank");
                    }}
                  />
                </Link>
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <Link>
                  <img
                    src={nvidia}
                    alt="NVIDIA"
                    height="150px"
                    onClick={() => {
                      window.open("https://www.nvidia.com/en-us/", "_blank");
                    }}
                  />
                </Link>
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <Link>
                  <img
                    src={amd}
                    alt="AMD"
                    height="150px"
                    onClick={() => {
                      window.open("https://www.amd.com/en.html", "_blank");
                    }}
                  />
                </Link>
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <Link>
                  <img
                    src={spotify}
                    alt="SPOTIFY"
                    height="150px"
                    onClick={() => {
                      window.open("https://open.spotify.com/", "_blank");
                    }}
                  />
                </Link>
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <Link>
                  <img
                    src={groupon}
                    alt="GROUPON"
                    height="150px"
                    onClick={() => {
                      window.open("https://www.groupon.com/", "_blank");
                    }}
                  />
                </Link>
              </Carousel.Item>
            </Carousel>
          </div>

          <div className="pic">
            <div className="apple">
              <div className=" sdesgintable fadeInDown mt-3">
                <div className="table-wrapper-scroll-ypl my-custom-scrollbarpl ptables fadeInDown">
                  <table className="table table-bordered table-striped">
                    {stocks.length ? (
                      stocks.map((stock) => {
                        return (
                          <React.Fragment key={stock.stock_id}>
                            <div className="card-body textp p-1">
                              <div>
                                <div>
                                  <p className="mb-0">
                                    <strong>
                                      {stock.symbol.split(" ").join("")}
                                    </strong>{" "}
                                    - ${Number(stock.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div style={{ textAlign: "center" }}>
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
                  </table>
                </div>
              </div>
              <div className="sstocks fadeIn first">
                <p className="textp spsp">Search for a stock</p>
                <input
                  type="text"
                  className="forma"
                  placeholder="Search for a stock"
                  onChange={(e) => updateSearch(e)}
                />
              </div>
            </div>

            <div className="imghome fadeInDown">
              <img src={bg} alt="Investments" />
            </div>
          </div>
          <div>
            <h1 className="display-6 mt-5">Checkout any stocks below!</h1>
          </div>
          <div className="cardss fadeIn fourth">
            {displayStocks.length ? (
              displayStocks.map((stock) => {
                return (
                  <div
                    className="card l-bg-blue-dark"
                    key={stock.stock_id}
                    id={stock.stock_id}
                  >
                    <div className="card-statistic-3 p-1">
                      <Link className="mb-4 carddesign">
                        <h4
                          className="card-title mb-0 textp"
                          id={stock.stock_id}
                          onClick={(e) => handleShow(e)}
                        >
                          {stock.symbol.split(" ").join("")}
                        </h4>
                        <h5>${Number(stock.price).toFixed(2)}</h5>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="m-5">
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
          </div>
        </div>
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
  te;
}
