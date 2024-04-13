import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
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
import { removeProfile } from "../api/userSlice.js";
import toast, { Toaster } from "react-hot-toast";
import { Ripple, initMDB } from "mdb-ui-kit";
import DataTable from "react-data-table-component";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Stocks() {
  initMDB({ Ripple });
  const dispatch = useDispatch();

  const [removingComment] = useRemovecommentMutation();
  const [addingComment] = useAddcommentMutation();
  const [editingComment] = useEditcommentMutation();
  const [followStock] = useFollowMutation();
  const [unfollowStock] = useUnfollowMutation();
  const [upvoteStock] = useUpvoteMutation();
  const [downvoteStock] = useDownvoteMutation();
  const [prof] = useGetProfileMutation();

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [stock, setStock] = useState(null);
  const [user_id, setUser_Id] = useState(-1);
  const [displayStocks, setDisplayStocks] = useState([]);
  const [edit, setEdit] = useState(false);
  const [idComment, setIdComment] = useState(null);
  const [warning, setWarning] = useState(true);
  const [editMessage, setEditMessage] = useState({
    message: null,
    comment_id: null,
  });
  const [newMessage, setNewMessage] = useState("Add a comment...");
  const [showCom, setShowCom] = useState(false);

  const { stocks } = useSelector((state) => state.stocks);
  const { profile, token, user, extra_following } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    const getProf = () => {
      prof({ user_id });
    };
    if (user_id > -1) getProf();
  }, [user_id]);
  useEffect(() => {
    setDisplayStocks(stocks);
  }, [stocks]);

  const handleEditShow = (e) => {
    setEdit(true);
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
  const updateCommentMessage = (e) => {
    setEditMessage({ ...editMessage, message: e.target.value });
  };
  const editComment = (e) => {
    const data = {
      message: e.target.dataset.message,
      comment_id: Number(e.target.id),
    };
    setEditMessage(data);
    handleEditShow();
  };

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

  const handleShow = (e) => {
    setShow(true);
    setStock(stocks[Number(e.target.id) - 1]);
  };
  const handleClose = () => {
    setShow(false);
    setStock(null);
  };
  const handleShow2 = () => {
    setShow2(true);
  };
  const handleClose2 = () => {
    setShow2(false);
    dispatch(removeProfile());
    setUser_Id(-1);
  };
  const handleShowCom = (e) => {
    setIdComment(e.target.id);
    setShowCom(true);
  };
  const handleCloseCom = () => {
    setShowCom(false);
    setNewMessage("Add a comment...");
    setIdComment(null);
  };

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
    if (!newDisplayStocks.length) {
      toast.error("Stock not found!", {
        position: "top-right",
      });
    } else setDisplayStocks(newDisplayStocks);
  };
  const getProfile = (e) => {
    setUser_Id(Number(e.target.id));
    handleShow2();
  };

  const images = [
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713028921/ci_y9k0ex.jpg",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713028927/ui_y9fazy.jpg",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713028922/fi_wd3bxc.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713029205/gi_laj1ya.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713029095/ni_ltjsrp.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713029095/amdi_jrjc1g.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713029327/ci_guupvl.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713029327/mi_gh7ydg.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713029428/aia_durrzi.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713039990/comcast-.eps-logo-vector_xxphd3.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713039990/samsung-logo-preview_spc4t5.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713039990/steam-logo_tlge7r.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713039993/target-stores-vector-logo_nesox3.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713039993/tiktok-logo-768x768_ioc2s2.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713040188/gamestop-logo-768x768_lpktoi.png",
    "https://res.cloudinary.com/day4sl0qg/image/upload/v1713040188/openai-logo_brandlogos.net_1xac8_gew0fq.png",
  ];

  return (
    <>
      <Modal show={showCom} onHide={handleCloseCom} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input mb-3">
            <textarea
              name="newMessage"
              placeholder={newMessage}
              className="form-control rounded"
              aria-label="With textarea"
              onChange={(e) => updateAddMessage(e)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-primary"
            data-mdb-ripple-init
            onClick={addComment}
          >
            Post
          </button>
        </Modal.Footer>
      </Modal>

      {edit && (
        <Modal show={edit} onHide={handleEditClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="input mb-3">
              <textarea
                defaultValue={editMessage.message}
                className="form-control rounded"
                aria-label="With textarea"
                onChange={(e) => updateCommentMessage(e)}
              ></textarea>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              data-mdb-ripple-init
              onClick={handleEditClose}
            >
              Confirm
            </button>
          </Modal.Footer>
        </Modal>
      )}

      {profile && (
        <Modal show={show2} onHide={handleClose2} centered>
          <Modal.Header closeButton>
            <Modal.Title>@{profile.user.username} follows...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!profile.following.length ? (
              <p>@{profile.user.username} is not following any stocks...</p>
            ) : (
              <div className="table-wrapper-scroll-y my-custom-scrollbar">
                <table className="table table-bordered table-striped mb-0">
                  {profile.following.map((stock) => {
                    return (
                      <React.Fragment key={stock.stock_id}>
                        <div className="card-body">
                          <div>
                            <div>
                              <p className="mb-0">
                                <strong>
                                  {stocks[stock.stock_id - 1].symbol
                                    .split(" ")
                                    .join("")}
                                </strong>{" "}
                                - {stocks[stock.stock_id - 1].fullname}
                              </p>
                            </div>
                          </div>
                        </div>
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
        <Modal show={show} onHide={handleClose} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {(extra_following[stock.stock_id] && (
                <Link style={{ color: "gold" }}>
                  <i
                    className="fs-3 bi bi-star-fill"
                    id={stock.stock_id}
                    onClick={(e) => unfollow(e)}
                  ></i>
                </Link>
              )) || (
                <Link style={{ color: "gold" }}>
                  <i
                    className="fs-3 bi bi-star"
                    id={stock.stock_id}
                    onClick={(e) => follow(e)}
                  ></i>
                </Link>
              )}{" "}
              {stock.symbol.split(" ").join("")} - {stock.fullname}{" "}
              <Link style={{ color: "green" }}>
                <i
                  className="fs-3 bi bi-caret-up-fill"
                  onClick={(e) => upvoter(e)}
                  id={stock.stock_id}
                ></i>
              </Link>
              {stock.upvotes}{" "}
              <Link style={{ color: "red" }}>
                <i
                  className="fs-3 bi bi-caret-down-fill"
                  onClick={(e) => downvoter(e)}
                  id={stock.stock_id}
                ></i>
              </Link>
              {stock.downvotes}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <p>{stock.description}</p>
              <div className="row">
                <strong className="col-sm">
                  Last Updated: {stock.current_data.split("T")[0]}
                </strong>{" "}
                <strong className="col-sm">
                  Current Price: ${Number(stock.price).toFixed(2)}
                </strong>
                <strong className="col-sm">
                  52 Week Low Price: ${Number(stock.week_low).toFixed(2)}
                </strong>{" "}
                <strong className="col-sm">
                  52 Week High Price: ${Number(stock.week_high).toFixed(2)}
                </strong>
              </div>
              <hr />
            </div>
            <div>
              {(token && (
                <div className="mb-3" style={{ textAlign: "center" }}>
                  <button
                    id={stock.stock_id}
                    type="button"
                    className="btn btn-primary"
                    data-mdb-ripple-init
                    onClick={handleShowCom}
                  >
                    New Comment
                  </button>
                </div>
              )) || (
                <>
                  <p className="mb-3" style={{ textAlign: "center" }}>
                    <Link to="/login">Login</Link> to comment.
                  </p>
                </>
              )}
              <hr className="my-0" />
              {stock.comments &&
                ((!stock.comments.length && (
                  <h3 className="mt-4 mb-2" style={{ textAlign: "center" }}>
                    Be the first to comment...
                  </h3>
                )) || (
                  <div className="table-wrapper-scroll-y my-custom-scrollbar">
                    <table className="table table-bordered table-striped">
                      {stock.comments.map((comment) => {
                        return (
                          <React.Fragment key={comment.comment_id}>
                            <div className="card-body">
                              <div>
                                <div>
                                  <p className="mb-0 ">
                                    <Link>
                                      <strong
                                        id={comment.user_id}
                                        onClick={(e) => {
                                          getProfile(e);
                                        }}
                                      >
                                        @{comment.username}
                                      </strong>
                                    </Link>
                                    <small style={{ float: "right" }}>
                                      <i className="bi bi-clock-history"></i>{" "}
                                      {comment.created_at.split("T")[0]}{" "}
                                      {token &&
                                        !comment.isdeleted &&
                                        comment.user_id === user.user_id && (
                                          <span>
                                            <Link style={{ color: "green" }}>
                                              <i
                                                className="bi bi-pencil-fill"
                                                id={comment.comment_id}
                                                data-message={comment.message}
                                                onClick={(e) => editComment(e)}
                                              ></i>
                                            </Link>{" "}
                                            <Link style={{ color: "red" }}>
                                              <i
                                                className="bi bi-trash-fill"
                                                id={comment.comment_id}
                                                onClick={(e) =>
                                                  removeComment(e)
                                                }
                                              ></i>
                                            </Link>
                                          </span>
                                        )}
                                    </small>
                                  </p>

                                  {(!comment.isdeleted && (
                                    <p className="mb-0">{comment.message}</p>
                                  )) || (
                                    <p
                                      className="mb-0"
                                      style={{ color: "red" }}
                                    >
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

      {warning && !displayStocks.length && (
        <div className="note note-warning mb-3">
          <strong>Note warning:</strong> Initial loading of data might exceed
          expected duration. Please allow a minute for server to fire up.
          <Link
            style={{ float: "right", color: "#896110" }}
            onClick={() => {
              setWarning(false);
            }}
          >
            x
          </Link>
        </div>
      )}

      <Carousel
        useKeyboardArrows={true}
        autoPlay
        interval={2000}
        transitionTime={2000}
        infiniteLoop
        showThumbs={false}
        dynamicHeight={false}
        showArrows={false}
        showIndicators={false}
        centerMode
        centerSlidePercentage={25}
      >
        {images.map((URL, index) => (
          <div className="slide">
            <img alt="sample_file" src={URL} key={index} />
          </div>
        ))}
      </Carousel>

      <div className="search_home input-group mt-3 mb-3">
        <span className="input-group-text border-0" id="search-addon">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="search"
          className="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
          onChange={(e) => updateSearch(e)}
        />
      </div>

      <div style={{ paddingBottom: "95px" }}>
        {displayStocks.length ? (
          <div className="container my-5">
            <DataTable
              columns={[
                {
                  name: <strong>Name</strong>,
                  selector: (row) => row.fullname,
                  sortable: true,
                },
                {
                  name: <strong>Symbol</strong>,
                  sortable: true,
                  selector: (row) => row.symbol.split(" ").join(""),
                },
                {
                  name: <strong>Price</strong>,
                  selector: (row) => `$${Number(row.price).toFixed(2)}`,
                },
                {
                  name: <strong>See Details</strong>,
                  selector: (row) => (
                    <Link>
                      <i
                        id={row.stock_id}
                        onClick={handleShow}
                        className="bi bi-search"
                      ></i>
                    </Link>
                  ),
                },
              ]}
              data={displayStocks}
              fixedHeader
              pagination
              paginationRowsPerPageOptions={[5, 10, 15]}
            ></DataTable>
          </div>
        ) : (
          <div className="admin_search_load mb-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>

      <Toaster />
    </>
  );
  te;
}
