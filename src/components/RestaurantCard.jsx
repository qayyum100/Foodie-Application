import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import { AuthContext } from "../Contexts/AuthContext";
import "../styles/App.css";
import { Link } from "react-router-dom";

export default function RestaurantCard({ rest }) {

  const { token } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(0);        // ⭐ average rating
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadInfo = async () => {
      try {
        // favorite
        if (token) {
          const res = await api.get(`/api/favorite/check/${rest.id}`);
          if (mounted) setIsFav(Boolean(res.data));
        }

        // ⭐ rating + review count
        const ratingRes = await api.get(`/api/rating/avg/${rest.id}`);
        const countRes = await api.get(`/api/review/count/${rest.id}`);
        if (mounted) {
          setRating(ratingRes.data);
          setReviewsCount(countRes.data);
        }

      } catch (err) {
        console.error(err);
      }
    };

    loadInfo();
    return () => (mounted = false);
  }, [rest.id, token]);


  const handleAdd = async () => {
    if (!token) return alert("Please log in to add favorites");
    setLoading(true);
    try {
      setIsFav(true);
      await api.post("/api/favorite/add", { restaurantId: rest.id });
    } catch (err) {
      console.error(err);
      setIsFav(false);
    } finally {
      setLoading(false);
    }
  };


  const handleRemove = async () => {
    if (!token) return alert("Please log in to remove favorites");
    setLoading(true);
    try {
      setIsFav(false);
      await api.delete(`/api/favorite/remove/${rest.id}`);
    } catch (err) {
      console.error(err);
      setIsFav(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    let remaining = rating;

    for (let i = 0; i < 5; i++) {
      if (remaining >= 1) {
        stars.push(<span key={i}>★</span>);
      } else if (remaining >= 0.5) {
        stars.push(<span key={i}>⭐½</span>);
      } else {
        stars.push(<span key={i}>☆</span>);
      }
      remaining--;
    }
    return stars;
  };

  return (
    <div className="card">

      {/* ⭐ rating badge */}
<div className="rating-badge">
  <span className="stars">{renderStars()}</span>
  <span className="avg"> {rating.toFixed(1)} </span>
  <span className="reviews">({reviewsCount} reviews)</span>
</div>


      {/* gradient overlay */}
      <Link to={`/restaurant/${rest.id}`} className="image-wrapper">
        <div className="overlay"></div>
        <img src={rest.image} alt={rest.name} />
      </Link>

      <div className="card-body">
        <h3>{rest.name}</h3>
        <p className="meta">{rest.cuisine}</p>
        <p className="desc">{rest.description.slice(0, 70)}...</p>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Link to={`/restaurant/${rest.id}`} className="btn btn-sm">
            View
          </Link>

          {isFav ? (
            <button className="btn btn-sm danger" onClick={handleRemove} disabled={loading}>
              ♥ Remove
            </button>
          ) : (
            <button className="btn btn-sm" onClick={handleAdd} disabled={loading}>
              ♡ Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


// import React, { useContext, useEffect, useState } from "react";
// import api from "../api/api";
// import { AuthContext } from "../Contexts/AuthContext"; // <-- use lowercase 'contexts'
// import "../styles/App.css";
// import { Link } from "react-router-dom";
// export default function RestaurantCard({ rest }) {
//   const { token } = useContext(AuthContext);
//   const [isFav, setIsFav] = useState(false);
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     let mounted = true;
//     const check = async () => {
//       if (!token) return setIsFav(false);
//       try {
//         const res = await api.get(`/api/favorite/check/${rest.id}`);
//         if (mounted) setIsFav(Boolean(res.data));
//       } catch (err) {
//         if (mounted) setIsFav(false);
//       }
//     };
//     check();
//     return () => (mounted = false);
//   }, [rest.id, token]);
//   const handleAdd = async () => {
//     if (!token) return alert("Please log in to add favorites");
//     setLoading(true);
//     try {
//       // await api.post("/api/favorite/add", { restaurantId: rest.id });
//       // setIsFav(true);
//       setIsFav(true);
//       await api.post("/api/favorite/add", { restaurantId: rest.id });
//     } catch (err) {
//       console.error(err);
//       setIsFav(false);
//       alert("Failed to add favorite");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleRemove = async () => {
//     if (!token) return alert("Please log in to remove favorites");
//     setLoading(true);
//     try {
//       setIsFav(false);
//       await api.delete(`/api/favorite/remove/${rest.id}`);
//       // setIsFav(false);
//     } catch (err) {
//       console.error(err);
//       setIsFav(true);
//       alert("Failed to remove favorite");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="card">
//       <Link to={`/restaurant/${rest.id}`}>
//         <img src={rest.image || "https://via.placeholder.com/400x220"} alt={rest.name} />
//       </Link>
//       <div className="card-body">
//         <h3>{rest.name}</h3>
//         <p className="meta">{rest.cuisine}</p>
//         <div style={{display:"flex", gap:8, marginTop:12}}>
//           <Link to={`/restaurant/${rest.id}`} className="btn btn-sm">View</Link>
//           {isFav ? (
//             <button className="btn btn-sm danger" onClick={handleRemove} disabled={loading}>
//               ♥️ Remove
//             </button>
//           ) : (
//             <button className="btn btn-sm" onClick={handleAdd} disabled={loading}>
//               ♡ Add
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
