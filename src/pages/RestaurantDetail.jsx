
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import restaurantsData from "../assets/restaurants.json";
import { AuthContext } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import api from "../api/api";
import "../styles/App.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const nav = useNavigate();
 const ITEM_ID = id;  

  const rest =
    restaurantsData.find((r) => r.id === id) || { id, name: id };

  const { token } = useContext(AuthContext);
  const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  isInCart
} = useCart();


  const inCart = isInCart(ITEM_ID);


  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  // 🔁 Load reviews
  useEffect(() => {
    api
      .get(`/api/review/get/${id}`)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]));
  }, [id]);

  // ⭐ Avg rating
  useEffect(() => {
    api
      .get(`/api/rating/avg/${id}`)
      .then((res) => setAvgRating(res.data))
      .catch(() => setAvgRating(0));
  }, [id]);

  // ❤️ Favorite check
  useEffect(() => {
    if (!token) return;

    api
      .get(`/api/favorite/check/${id}`)
      .then((res) => setIsFav(Boolean(res.data)))
      .catch(() => {});
  }, [id, token]);

  const submitRating = async () => {
    if (!token) return alert("Please login");

    try {
      await api.post(
        `/api/rating/add?restaurantId=${id}&rating=${userRating}`
      );

      const res = await api.get(`/api/rating/avg/${id}`);
      setAvgRating(res.data);

      setUserRating(0);
      setHoverRating(0);
      alert("Rating submitted!");
    } catch {
      alert("Failed to submit rating");
    }
  };

  const submitReview = async () => {
    if (!token) return alert("Please login");

    try {
      await api.post(
        `/api/review/add?restaurantId=${id}&rating=${userRating}&comment=${comment}`
      );

      setComment("");
      setUserRating(0);
      setHoverRating(0);

      const res = await api.get(`/api/review/get/${id}`);
      setReviews(res.data);

      alert("Review submitted!");
    } catch {
      alert("Failed to submit review");
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

const handleCartToggle = () => {
  if (inCart) {
    removeFromCart(ITEM_ID);
  } else {
    addToCart({
      itemId: ITEM_ID,
      itemName: rest.name,
      price: rest.price || 250,
      quantity: 1
    });
  }
};

const handleAppleHover = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();

  card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  card.style.setProperty("--my", `${e.clientY - rect.top}px`);
};


  return (
    <div className="container">
      <button onClick={() => nav(-1)} className="btn" style={{ marginBottom: 12 }}>
        ← Back
      </button>

      <div
  className="detail"
  onMouseMove={handleAppleHover}
>
        <img
          src={rest.image || "https://via.placeholder.com/700x380"}
          alt={rest.name}
        />

        <div className="detail-body">
          <h2 style={{ color: "#e74c3c" }}>{rest.name}</h2>

          <p style={{ color: "#eebb22ff" }}>
            <strong>Cuisine:</strong> {rest.cuisine}
          </p>

          <p>{rest.description}</p>

          <p style={{ color: "#f1c40f", fontWeight: "bold" }}>
            ⭐ {avgRating.toFixed(1)} / 5
          </p>

          {/* ⭐ Rating */}
          <div>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                style={{
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  color: n <= (hoverRating || userRating) ? "#FFD700" : "#bbb"
                }}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(n)}
              >
                ★
              </span>
            ))}
          </div>

          <button className="btn" onClick={submitRating} disabled={!userRating}>
            Submit Rating
          </button>

          <div style={{ marginTop: 12 }}>
            <button className={`btn ${isFav ? "danger" : ""}`} onClick={toggleFav}>
              {isFav ? "♥ Remove Favorite" : "♡ Add to Favorites"}
            </button>
          </div>

          {/* 🛒 CART BUTTON */}
          <div style={{ marginTop: 12 }}>


            {/* <button

              className={`btn ${inCart ? "danger" : ""}`}
              onClick={handleCartToggle}
            >
              {inCart ? "Remove from Cart" : "Add to Cart"}
            </button> */}
{inCart ? (
  <div className="qty-controls">
    <button onClick={() => decreaseQty(ITEM_ID)}>
      −
    </button>

    <span>In Cart</span>

    <button onClick={() => increaseQty(ITEM_ID)}>
      +
    </button>

    {/* optional explicit remove */}
    <button
      className="btn danger"
      onClick={() => removeFromCart(ITEM_ID)}
      style={{ marginLeft: 8 }}
    >
      Remove
    </button>
  </div>
) : (
  <button className="btn" onClick={handleCartToggle}>
    Add to Cart
  </button>
)}


          </div>
        </div>
      </div>

      {/* ✍ Reviews */}
      <div className="review-box">
        <h3>Write a Review</h3>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="review-textarea"
          placeholder="Write your thoughts..."
        />

        <button
          className="btn"
          onClick={submitReview}
          disabled={!comment || !userRating}
        >
          Submit Review
        </button>
      </div>

      <h3>Customer Reviews</h3>

      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="review-item">
            <strong>⭐ {r.rating}</strong>
            <p>{r.comment}</p>
            <small>{new Date(r.timestamp).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}


// import React, { useContext, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import restaurantsData from "../assets/restaurants.json";
// import { AuthContext } from "../Contexts/AuthContext";
// import { CartContext } from "../Contexts/CartContext";   // ✅ ADDED
// import api from "../api/api";
// import "../styles/App.css";

// export default function RestaurantDetail() {
//   const { id } = useParams();
//   const nav = useNavigate();

//   const rest =
//     restaurantsData.find((r) => r.id === id) || { id, name: id };

//   const { token } = useContext(AuthContext);
//   const { addToCart } = useContext(CartContext);          // ✅ ADDED

//   const [isFav, setIsFav] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [userRating, setUserRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [avgRating, setAvgRating] = useState(0);

//   const [comment, setComment] = useState("");
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     let mounted = true;

//     api
//       .get(`/api/review/get/${id}`)
//       .then((res) => {
//         if (mounted) setReviews(res.data);
//       })
//       .catch(() => {
//         if (mounted) setReviews([]);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, [id]);

//   useEffect(() => {
//     api
//       .get(`/api/rating/avg/${id}`)
//       .then((res) => setAvgRating(res.data))
//       .catch(() => setAvgRating(0));
//   }, [id]);

//   useEffect(() => {
//     if (!token) return;

//     let mounted = true;

//     api
//       .get(`/api/favorite/check/${id}`)
//       .then((res) => mounted && setIsFav(Boolean(res.data)))
//       .catch(() => {});

//     return () => {
//       mounted = false;
//     };
//   }, [id, token]);

//   const submitRating = async () => {
//     if (!token) return alert("Please login");

//     try {
//       await api.post(
//         `/api/rating/add?restaurantId=${id}&rating=${userRating}`
//       );

//       alert("Rating submitted!");

//       const res = await api.get(`/api/rating/avg/${id}`);
//       setAvgRating(res.data);

//       setUserRating(0);
//       setHoverRating(0);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit rating");
//     }
//   };

//   const submitReview = async () => {
//     if (!token) return alert("Please login");

//     try {
//       await api.post(
//         `/api/review/add?restaurantId=${id}&rating=${userRating}&comment=${comment}`
//       );

//       alert("Review submitted!");

//       setComment("");
//       setUserRating(0);
//       setHoverRating(0);

//       const res = await api.get(`/api/review/get/${id}`);
//       setReviews(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit review");
//     }
//   };

//   const toggleFav = async () => {
//     if (!token) return alert("Please login");

//     setLoading(true);
//     try {
//       if (isFav) {
//         await api.delete(`/api/favorite/remove/${id}`);
//         setIsFav(false);
//       } else {
//         await api.post("/api/favorite/add", { restaurantId: id });
//         setIsFav(true);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">

//       <button
//         onClick={() => nav(-1)}
//         className="btn"
//         style={{ marginBottom: 12 }}
//       >
//         ← Back
//       </button>

//       <div className="detail">
//         <img
//           src={rest.image || "https://via.placeholder.com/700x380"}
//           alt={rest.name}
//         />

//         <div className="detail-body">

//           <h2 style={{ color: "#e74c3c", fontWeight: "bold" }}>
//             {rest.name}
//           </h2>

//           <p style={{ color: "#34495e" }}>
//             <strong style={{ color: "#2980b9" }}>Cuisine:</strong> {rest.cuisine}
//           </p>

//           <p style={{ color: "#555" }}>
//             {rest.description || "No description available."}
//           </p>

//           <p style={{ color: "#f1c40f", fontWeight: "bold" }}>
//             <strong>Average Rating:</strong> ⭐ {avgRating.toFixed(1)} / 5
//           </p>

//           {/* ⭐ Star Rating UI */}
//           <div style={{ marginTop: 12 }}>
//             <strong style={{ color: "#8e44ad" }}>Your Rating:</strong>

//             <div className="star-rating-container">
//               {[1, 2, 3, 4, 5].map((num) => {
//                 const isActive =
//                   num <= (hoverRating || userRating);

//                 return (
//                   <span
//                     key={num}
//                     className={`star ${isActive ? "active" : ""}`}
//                     onMouseEnter={() => setHoverRating(num)}
//                     onMouseLeave={() => setHoverRating(0)}
//                     onClick={() => setUserRating(num)}
//                     style={{
//                       fontSize: "1.8rem",
//                       color: isActive ? "#FFD700" : "#bbb",
//                       cursor: "pointer"
//                     }}
//                   >
//                     ★
//                   </span>
//                 );
//               })}
//             </div>

//             <button
//               className="btn"
//               onClick={submitRating}
//               disabled={!userRating}
//             >
//               Submit Rating
//             </button>
//           </div>

//           <div style={{ marginTop: 20 }}>
//             <button
//               className={`btn ${isFav ? "danger" : ""}`}
//               onClick={toggleFav}
//               disabled={loading}
//             >
//               {isFav ? "♥ Remove favorite" : "♡ Add to favorites"}
//             </button>
//           </div>

//           {/* 🛒 ADD TO CART BUTTON — ADDED */}
//           <div style={{ marginTop: 12 }}>
//             <button
//               className="btn"
//               onClick={() =>
//                 addToCart({
//                   itemId: `${id}-main`,
//                   itemName: rest.name,
//                   price: rest.price,
//                   quantity: 1
//                 })
//               }
//             >
//               Add to Cart
//             </button>
//           </div>

//         </div>
//       </div>

//       <div className="review-box">
//         <h3 style={{ color: "#2c3e50" }}>Write a Review</h3>

//         <textarea
//           placeholder="Write your thoughts about this restaurant..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="review-textarea"
//         />

//         <button
//           className="btn"
//           onClick={submitReview}
//           disabled={!comment || !userRating}
//         >
//           Submit Review
//         </button>
//       </div>

//       <h3 style={{ color: "#2c3e50", marginTop: 20 }}>
//         Customer Reviews
//       </h3>

//       {reviews.length === 0 ? (
//         <p style={{ color: "#7f8c8d" }}>
//           No reviews yet. Be the first to review!
//         </p>
//       ) : (
//         <div className="review-list">
//           {reviews.map((r) => (
//             <div key={r.id} className="review-item">
//               <p>
//                 <strong style={{ color: "#f39c12" }}>⭐ {r.rating}</strong>
//               </p>
//               <p style={{ color: "#2c3e50" }}>{r.comment}</p>
//               <small style={{ color: "#7f8c8d" }}>
//                 {new Date(r.timestamp).toLocaleString()}
//               </small>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




// import React, { useContext, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import restaurantsData from "../assets/restaurants.json";
// import { AuthContext } from "../Contexts/AuthContext";
// import api from "../api/api";
// import "../styles/App.css";

// export default function RestaurantDetail() {
//   const { id } = useParams();
//   const nav = useNavigate();

//   const rest =
//     restaurantsData.find((r) => r.id === id) || { id, name: id };

//   const { token } = useContext(AuthContext);

//   const [isFav, setIsFav] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ⭐ Rating states
//   const [userRating, setUserRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [avgRating, setAvgRating] = useState(0);

//   // ⭐ Review states
//   const [comment, setComment] = useState("");
//   const [reviews, setReviews] = useState([]);

//   // -------------------------------------
//   // ⭐ LOAD REVIEWS
//   // -------------------------------------
//   useEffect(() => {
//     let mounted = true;

//     api
//       .get(`/api/review/get/${id}`)
//       .then((res) => {
//         if (mounted) setReviews(res.data);
//       })
//       .catch(() => {
//         if (mounted) setReviews([]);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, [id]);

//   // -------------------------------------
//   // ⭐ LOAD AVERAGE RATING
//   // -------------------------------------
//   useEffect(() => {
//     api
//       .get(`/api/rating/avg/${id}`)
//       .then((res) => setAvgRating(res.data))
//       .catch(() => setAvgRating(0));
//   }, [id]);

//   // -------------------------------------
//   // ⭐ CHECK IF FAVORITE
//   // -------------------------------------
//   useEffect(() => {
//     if (!token) return;

//     let mounted = true;

//     api
//       .get(`/api/favorite/check/${id}`)
//       .then((res) => mounted && setIsFav(Boolean(res.data)))
//       .catch(() => {});

//     return () => {
//       mounted = false;
//     };
//   }, [id, token]);

//   // -------------------------------------
//   // ⭐ SUBMIT RATING
//   // -------------------------------------
//   const submitRating = async () => {
//     if (!token) return alert("Please login");

//     try {
//       await api.post(
//         `/api/rating/add?restaurantId=${id}&rating=${userRating}`
//       );

//       alert("Rating submitted!");

//       const res = await api.get(`/api/rating/avg/${id}`);
//       setAvgRating(res.data);

//       setUserRating(0);
//       setHoverRating(0);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit rating");
//     }
//   };

//   // -------------------------------------
//   // ⭐ SUBMIT REVIEW
//   // -------------------------------------
//   const submitReview = async () => {
//     if (!token) return alert("Please login");

//     try {
//       await api.post(
//         `/api/reviews/add?restaurantId=${id}&rating=${userRating}&comment=${comment}`
//       );

//       alert("Review submitted!");

//       setComment("");
//       setUserRating(0);
//       setHoverRating(0);

//       const res = await api.get(`/api/reviews/get/${id}`);
//       setReviews(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit review");
//     }
//   };

//   // -------------------------------------
//   // ⭐ TOGGLE FAVORITE
//   // -------------------------------------
//   const toggleFav = async () => {
//     if (!token) return alert("Please login");

//     setLoading(true);
//     try {
//       if (isFav) {
//         await api.delete(`/api/favorite/remove/${id}`);
//         setIsFav(false);
//       } else {
//         await api.post("/api/favorite/add", { restaurantId: id });
//         setIsFav(true);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------------
//   // ⭐ RENDER UI
//   // -------------------------------------
//   return (
//     <div className="container">
//       <button
//         onClick={() => nav(-1)}
//         className="btn"
//         style={{ marginBottom: 12 }}
//       >
//         ← Back
//       </button>

//       <div className="detail">
//         <img
//           src={rest.image || "https://via.placeholder.com/700x380"}
//           alt={rest.name}
//         />

//         <div className="detail-body">
//           <h2>{rest.name}</h2>
//           <p>
//             <strong>Cuisine:</strong> {rest.cuisine}
//           </p>
//           <p>{rest.description || "No description available."}</p>

//           {/* ⭐ Average Rating */}
//           <p>
//             <strong>Average Rating:</strong> ⭐ {avgRating.toFixed(1)} / 5
//           </p>

//           {/* ⭐ Star Rating UI */}
//           <div style={{ marginTop: 12 }}>
//             <strong>Your Rating:</strong>

//             <div className="star-rating-container">
//               {[1, 2, 3, 4, 5].map((num) => {
//                 const isActive =
//                   num <= (hoverRating || userRating);

//                 return (
//                   <span
//                     key={num}
//                     className={`star ${isActive ? "active" : ""}`}
//                     onMouseEnter={() => setHoverRating(num)}
//                     onMouseLeave={() => setHoverRating(0)}
//                     onClick={() => setUserRating(num)}
//                   >
//                     ★
//                   </span>
//                 );
//               })}
//             </div>

//             <button
//               className="btn"
//               onClick={submitRating}
//               disabled={!userRating}
//             >
//               Submit Rating
//             </button>
//           </div>

//           {/* ⭐ Favorite Button */}
//           <div style={{ marginTop: 20 }}>
//             <button
//               className={`btn ${isFav ? "danger" : ""}`}
//               onClick={toggleFav}
//               disabled={loading}
//             >
//               {isFav ? "♥ Remove favorite" : "♡ Add to favorites"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ⭐ Review Box */}
//       <div className="review-box">
//         <h3>Write a Review</h3>

//         <textarea
//           placeholder="Write your thoughts about this restaurant..."
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           className="review-textarea"
//         />

//         <button
//           className="btn"
//           onClick={submitReview}
//           disabled={!comment || !userRating}
//         >
//           Submit Review
//         </button>
//       </div>

//       {/* ⭐ Reviews List */}
//       <h3>Customer Reviews</h3>

//       {reviews.length === 0 ? (
//         <p>No reviews yet. Be the first to review!</p>
//       ) : (
//         <div className="review-list">
//           {reviews.map((r) => (
//             <div key={r.id} className="review-item">
//               <p>
//                 <strong>⭐ {r.rating}</strong>
//               </p>
//               <p>{r.comment}</p>
//               <small>
//                 {new Date(r.timestamp).toLocaleString()}
//               </small>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>

// );

// }

