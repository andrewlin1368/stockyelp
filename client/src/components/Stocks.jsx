import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Modal, Col, Container, Row, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./stocks.css";
import { useGetProfileMutation } from "../api/userApi";
import {
  useFollowMutation,
  useUnfollowMutation,
  useUpvoteMutation,
  useDownvoteMutation,
} from "../api/stocksApi";
import { useDispatch } from "react-redux";
import { removeProfile } from "../api/userSlice.js";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Stocks() {
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
  const { profile, token, user, extra_following, following } = useSelector(
    (state) => state.user
  );
  const [prof] = useGetProfileMutation();
  //   console.log(stocks);
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
    // console.log(newDisplayStocks);
    setDisplayStocks(newDisplayStocks);
  };
  // console.log(extra_following, token);
  //   console.log(profile);
  // console.log(extra_following, following);
  // console.log(stock);
  return (
    <>
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
                <strong>{stock.symbol}</strong>- {stock.fullname}{" "}
                {(extra_following[stock.stock_id] && (
                  <i
                    className="bi bi-star-fill"
                    id={stock.stock_id}
                    onClick={(e) => unfollow(e)}
                  ></i>
                )) || (
                  <i
                    className="bi bi-star"
                    id={stock.stock_id}
                    onClick={(e) => follow(e)}
                  ></i>
                )}
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
                  <div className="lead">
                    <i
                      className="bi bi-arrow-up-circle"
                      onClick={(e) => upvoter(e)}
                      id={stock.stock_id}
                    >
                      {" "}
                      {stock.upvotes}
                    </i>
                  </div>
                  <div className="lead">
                    <i
                      className="bi bi-arrow-down-circle"
                      onClick={(e) => downvoter(e)}
                      id={stock.stock_id}
                    >
                      {" "}
                      {stock.downvotes}
                    </i>
                  </div>
                </Modal.Body>
              </Col>
              <Col xs={12} md={8}>
                {(token && (
                  <div className="form-outline mb-4 mt-4">
                    <input
                      type="text"
                      id="addComment"
                      className="form-control"
                      placeholder="Add a comment..."
                    />
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
                                      <strong
                                        className="text-primary lead"
                                        id={comment.user_id}
                                        onClick={(e) => {
                                          getProfile(e);
                                        }}
                                      >
                                        @{comment.username}
                                      </strong>{" "}
                                      <small>
                                        {comment.created_at.split("T")[0]}
                                      </small>
                                    </p>

                                    {(!comment.isdeleted && (
                                      <p className="mb-0 lead">
                                        {comment.message}{" "}
                                        {token &&
                                          comment.user_id === user.user_id && (
                                            <>
                                              <i className="bi bi-pencil"></i>{" "}
                                              <i className="bi bi-trash"></i>
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
        <Form.Control
          className="mt-2"
          type="text"
          id="stockSearch"
          aria-describedby="passwordHelpBlock"
          placeholder="Search for a stock..."
          onChange={(e) => updateSearch(e)}
          style={{ width: "70%", margin: "auto" }}
        />
      </>
      <div className="cardParent">
        {displayStocks.map((stock) => {
          return (
            <div
              className="card stockscards"
              key={stock.stock_id}
              id={stock.stock_id}
              onClick={(e) => handleShow(e)}
            >
              <div
                className="card-body"
                id={stock.stock_id}
                onClick={(e) => handleShow(e)}
              >
                <p
                  className="lead"
                  id={stock.stock_id}
                  onClick={(e) => handleShow(e)}
                >
                  <strong id={stock.stock_id} onClick={(e) => handleShow(e)}>
                    {stock.symbol}
                  </strong>{" "}
                  ${stock.price}{" "}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}
