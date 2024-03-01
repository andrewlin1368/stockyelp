import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Modal, Col, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./stocks.css";
import { useGetProfileMutation } from "../api/userApi";

export default function Stocks() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [stock, setStock] = useState(null);
  const [user_id, setUser_Id] = useState(-1);
  const { stocks } = useSelector((state) => state.stocks);
  const { profile, token } = useSelector((state) => state.user);
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
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  useEffect(() => {
    const getProf = () => {
      prof({ user_id });
    };
    if (user_id > -1) getProf();
  }, [user_id]);
  const getProfile = (e) => {
    setUser_Id(Number(e.target.id));
    handleShow2();
  };

  console.log(profile);
  return (
    <>
      {profile && (
        <Modal show={show2} onHide={handleClose2} size="s" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1 class="display-6">@{profile.user.username} is watching...</h1>
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
                                      {stocks[stock.stock_id].symbol}
                                    </strong>
                                    - {stocks[stock.stock_id].fullname}
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
              <h1 class="display-6">
                <strong>{stock.symbol}</strong>- {stock.fullname}{" "}
                <i className="bi bi-suit-heart"></i>
                <i className="bi bi-suit-heart-fill"></i>
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
                    <strong>
                      Data from {stock.current_data.split("T")[0]}
                    </strong>

                    <p>Price: ${stock.price}</p>
                    <p>52 Week Low: ${stock.week_low}</p>
                    <p>52 Week High: ${stock.week_high}</p>
                  </div>
                  <hr />
                  <div className="lead">
                    <i className="bi bi-hand-thumbs-up">{stock.upvotes}</i>
                    <i className="bi bi-hand-thumbs-up-fill">{stock.upvotes}</i>
                    <i className="bi bi-hand-thumbs-down">{stock.downvotes}</i>
                    <i className="bi bi-hand-thumbs-down-fill">
                      {stock.downvotes}
                    </i>
                  </div>
                </Modal.Body>
              </Col>
              <Col xs={12} md={8}>
                <div className="form-outline mb-4 mt-4">
                  <input
                    type="text"
                    id="addComment"
                    className="form-control"
                    placeholder="Add a comment..."
                  />
                </div>
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
                                        className="text-primary"
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
                                        <i className="bi bi-pencil"></i>{" "}
                                        <i className="bi bi-trash"></i>
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
      {stocks.map((stock) => {
        return (
          <div
            key={stock.stock_id}
            id={stock.stock_id}
            onClick={(e) => handleShow(e)}
          >
            {stock.symbol} {stock.price}
          </div>
        );
      })}
    </>
  );
}
