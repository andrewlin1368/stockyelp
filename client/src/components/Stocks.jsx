import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Modal, Col, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./stocks.css";

export default function Stocks() {
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState(null);
  const { stocks } = useSelector((state) => state.stocks);
  console.log(stocks);
  const handleClose = () => {
    setShow(false);
    setStock(null);
  };
  const handleShow = (e) => {
    setShow(true);
    setStock(stocks[Number(e.target.id) - 1]);
  };

  return (
    <>
      {stock && (
        <Modal
          show={show}
          onHide={handleClose}
          size="xl"
          contentClassName="modal-height"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {stock.fullname} - {stock.symbol} <i class="bi bi-suit-heart"></i>
              <i class="bi bi-suit-heart-fill"></i>
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
                    <i class="bi bi-hand-thumbs-up-fill">{stock.upvotes}</i>
                    <i className="bi bi-hand-thumbs-down">{stock.downvotes}</i>
                    <i class="bi bi-hand-thumbs-down-fill">{stock.downvotes}</i>
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
                      <table class="table table-bordered table-striped mb-0">
                        {stock.comments.map((comment) => {
                          return (
                            <div key={comment.comment_id}>
                              <div className="card-body p-4">
                                <div className="d-flex flex-start">
                                  <div>
                                    <p className="lead mb-0">
                                      <strong>{comment.username}</strong>{" "}
                                      <small>
                                        {comment.created_at.split("T")[0]}
                                      </small>
                                    </p>
                                    {(!comment.isdeleted && (
                                      <p className="mb-0 lead">
                                        {comment.message}{" "}
                                        <i class="bi bi-pencil"></i>{" "}
                                        <i class="bi bi-trash"></i>
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
                            </div>
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
