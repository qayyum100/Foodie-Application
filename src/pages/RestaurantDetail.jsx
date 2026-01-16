import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import restaurantsData from "../assets/restaurants.json";
import { AuthContext } from "../Contexts/AuthContext";
import api from "../api/api";
import "../styles/App.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const rest =
    restaurantsData.find((r) => r.id === id) || { id, name: id };

  const { token } = useContext(AuthContext);

  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⭐ Rating states
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  // ⭐ Review states
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  // -------------------------------------
  // ⭐ LOAD REVIEWS
  // -------------------------------------
  useEffect(() => {
    let mounted = true;

    api
      .get(`/api/review/get/${id}`)
      .then((res) => {
        if (mounted) setReviews(res.data);
      })
      .catch(() => {
        if (mounted) setReviews([]);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  // -------------------------------------
  // ⭐ LOAD AVERAGE RATING
  // -------------------------------------
  useEffect(() => {
    api
      .get(`/api/rating/avg/${id}`)
      .then((res) => setAvgRating(res.data))
      .catch(() => setAvgRating(0));
  }, [id]);

  // -------------------------------------
  // ⭐ CHECK IF FAVORITE
  // -------------------------------------
  useEffect(() => {
    if (!token) return;

    let mounted = true;

    api
      .get(`/api/favorite/check/${id}`)
      .then((res) => mounted && setIsFav(Boolean(res.data)))
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [id, token]);

  // -------------------------------------
  // ⭐ SUBMIT RATING
  // -------------------------------------
  const submitRating = async () => {
    if (!token) return alert("Please login");

    try {
      await api.post(
        `/api/rating/add?restaurantId=${id}&rating=${userRating}`
      );

      alert("Rating submitted!");

      const res = await api.get(`/api/rating/avg/${id}`);
      setAvgRating(res.data);

      setUserRating(0);
      setHoverRating(0);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  };

  // -------------------------------------
  // ⭐ SUBMIT REVIEW
  // -------------------------------------
  const submitReview = async () => {
    if (!token) return alert("Please login");

    try {
      await api.post(
        `/api/reviews/add?restaurantId=${id}&rating=${userRating}&comment=${comment}`
      );

      alert("Review submitted!");

      setComment("");
      setUserRating(0);
      setHoverRating(0);

      const res = await api.get(`/api/reviews/get/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  // -------------------------------------
  // ⭐ TOGGLE FAVORITE
  // -------------------------------------
  const toggleFav = async () => {
    if (!token) return alert("Please login");

    setLoading(true);
    try {
      if (isFav) {
        await api.delete(`/api/favorite/remove/${id}`);
        setIsFav(false);
      } else {
        await api.post("/api/favorite/add", { restaurantId: id });
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update favorite");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // ⭐ RENDER UI
  // -------------------------------------
  return (
    <div className="container">
      <button
        onClick={() => nav(-1)}
        className="btn"
        style={{ marginBottom: 12 }}
      >
        ← Back
      </button>

      <div className="detail">
        <img
          src={rest.image || "https://via.placeholder.com/700x380"}
          alt={rest.name}
        />

        <div className="detail-body">
          <h2>{rest.name}</h2>
          <p>
            <strong>Cuisine:</strong> {rest.cuisine}
          </p>
          <p>{rest.description || "No description available."}</p>

          {/* ⭐ Average Rating */}
          <p>
            <strong>Average Rating:</strong> ⭐ {avgRating.toFixed(1)} / 5
          </p>

          {/* ⭐ Star Rating UI */}
          <div style={{ marginTop: 12 }}>
            <strong>Your Rating:</strong>

            <div className="star-rating-container">
              {[1, 2, 3, 4, 5].map((num) => {
                const isActive =
                  num <= (hoverRating || userRating);

                return (
                  <span
                    key={num}
                    className={`star ${isActive ? "active" : ""}`}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(num)}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            <button
              className="btn"
              onClick={submitRating}
              disabled={!userRating}
            >
              Submit Rating
            </button>
          </div>

          {/* ⭐ Favorite Button */}
          <div style={{ marginTop: 20 }}>
            <button
              className={`btn ${isFav ? "danger" : ""}`}
              onClick={toggleFav}
              disabled={loading}
            >
              {isFav ? "♥ Remove favorite" : "♡ Add to favorites"}
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ Review Box */}
      <div className="review-box">
        <h3>Write a Review</h3>

        <textarea
          placeholder="Write your thoughts about this restaurant..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="review-textarea"
        />

        <button
          className="btn"
          onClick={submitReview}
          disabled={!comment || !userRating}
        >
          Submit Review
        </button>
      </div>

      {/* ⭐ Reviews List */}
      <h3>Customer Reviews</h3>

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <p>
                <strong>⭐ {r.rating}</strong>
              </p>
              <p>{r.comment}</p>
              <small>
                {new Date(r.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>

);

}

