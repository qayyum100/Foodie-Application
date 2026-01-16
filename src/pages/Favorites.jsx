// src/pages/Favorites.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../Contexts/AuthContext";
import restaurantsData from "../assets/restaurants.json";

export default function Favorites() {

  const { token } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const res = await api.get("/api/favorite/me");
        const data = res.data;
        const favs = data.favorites || [];

        const enriched = await Promise.all(
          favs.map(async (f) => {
            const rest = restaurantsData.find((r) => r.id === f.restaurantId);
            const ratingRes = await api.get(`/api/rating/avg/${f.restaurantId}`);
            const countRes = await api.get(`/api/review/count/${f.restaurantId}`);

            return {
              ...f,
              restaurant: rest || { id: f.restaurantId, name: f.restaurantId },
              avgRating: ratingRes.data || 0,
              reviewsCount: countRes.data || 0,
            };
          })
        );

        setFavorites(enriched);

      } catch (err) {
        alert("Failed loading favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavs();
  }, [token]);


  // ❌ Remove All favorites
  const handleRemoveAll = async () => {
    if (!token) return alert("Please login");
    if (!window.confirm("Remove ALL favorites?")) return;

    try {
      await api.delete("/api/favorite/clear");
      setFavorites([]);
    } catch {
      alert("Failed to remove all");
    }
  };


  // ❌ Remove a single restaurant
  const handleRemoveOne = async (restaurantId) => {
    if (!token) return alert("Please login");

    try {
      await api.delete(`/api/favorite/remove/${restaurantId}`);
      setFavorites(prev => prev.filter(f => f.restaurantId !== restaurantId));
    } catch {
      alert("Failed to remove");
    }
  };


  if (loading) return <div className="container"><p>Loading...</p></div>;


  return (
    <div className="container" style={{ position: "relative" }}>

      {/* Back button */}
      <button
        className="btn"
        onClick={() => nav(-1)}
        style={{ position: "absolute", top: 10, left: 10 }}
      >
        ← Back
      </button>

      {favorites.length > 0 && (
        <button
          className="btn danger"
          onClick={handleRemoveAll}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          Remove All
        </button>
      )}

      <h2 style={{ textAlign: "center", marginTop: 50 }}>My Favorites</h2>

      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid">

          {favorites.map((f) => (
            <div key={f.id} className="card">

              <img
                src={f.restaurant?.image || "https://via.placeholder.com/300x180"}
                alt={f.restaurant?.name}
              />

              <div className="card-body">

                {/* title */}
                <h3 style={{ color: "#e74c3c", fontWeight: "bold" }}>
                  {f.restaurant?.name}
                </h3>

                {/* cuisine */}
                <p style={{ color: "#2980b9" }}>{f.restaurant?.cuisine}</p>

                {/* desc */}
                <p style={{ color: "#555" }}>
                  {f.restaurant?.description?.slice(0, 70)}...
                </p>

                {/* rating */}
                <p>
                  ⭐ <strong>{f.avgRating.toFixed(1)}</strong>{" "}
                  <span style={{ color: "#7f8c8d" }}>
                    ({f.reviewsCount} reviews)
                  </span>
                </p>

                {/* buttons */}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>

                  {/* view */}
                  <Link to={`/restaurant/${f.restaurantId}`} className="btn btn-sm">
                    View
                  </Link>

                  {/* remove */}
                  <button
                    className="btn btn-sm danger"
                    onClick={() => handleRemoveOne(f.restaurantId)}
                  >
                    Remove
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}


// // src/pages/Favorites.jsx
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";
// import { AuthContext } from "../Contexts/AuthContext";
// import restaurantsData from "../assets/restaurants.json";

// export default function Favorites() {

//   const { token } = useContext(AuthContext);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const nav = useNavigate();

//   useEffect(() => {
//     const fetchFavs = async () => {
//       try {
//         const res = await api.get("/api/favorite/me");
//         const data = res.data;
//         const favs = data.favorites || [];

//         const enrichedFavorites = await Promise.all(
//           favs.map(async (f) => {
//             const rest = restaurantsData.find((r) => r.id === f.restaurantId);
            
//             // ⭐ get rating + review count
//             const ratingRes = await api.get(`/api/rating/avg/${f.restaurantId}`);
//             const countRes = await api.get(`/api/review/count/${f.restaurantId}`);

//             return {
//               ...f,
//               restaurant: rest || { id: f.restaurantId, name: f.restaurantId },
//               avgRating: ratingRes.data || 0,
//               reviewsCount: countRes.data || 0,
//             };
//           })
//         );

//         setFavorites(enrichedFavorites);

//       } catch (err) {
//         console.error(err);
//         alert("Failed to load favorites");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavs();
//   }, [token]);


//   const handleRemoveAll = async () => {
//     if (!token) return alert("Please login");
//     if (!window.confirm("Remove ALL favorites?")) return;

//     try {
//       await api.delete("/api/favorite/clear");
//       setFavorites([]);
//     } catch {
//       alert("Failed to remove favorites");
//     }
//   };


//   if (loading) return <div className="container"><p>Loading...</p></div>;

//   return (
//     <div className="container" style={{ position: "relative" }}>

//       <button
//         className="btn"
//         onClick={() => nav(-1)}
//         style={{ position: "absolute", top: 10, left: 10 }}
//       >
//         ← Back
//       </button>

//       {favorites.length > 0 && (
//         <button
//           className="btn danger"
//           onClick={handleRemoveAll}
//           style={{ position: "absolute", top: 10, right: 10 }}
//         >
//           Remove All
//         </button>
//       )}

//       <h2 style={{ textAlign: "center", marginTop: 50 }}>My Favorites</h2>

//       {favorites.length === 0 ? (
//         <p>No favorites yet. Add some from Home.</p>
//       ) : (
//         <div className="grid">

//           {favorites.map((f) => (
//             <div key={f.id} className="card">
              
//               <img
//                 src={f.restaurant?.image || "https://via.placeholder.com/300x180"}
//                 alt={f.restaurant?.name}
//               />

//               <div className="card-body">

//                 {/* Restaurant Name */}
//                 <h3 style={{ color: "#e74c3c", fontWeight: "bold" }}>
//                   {f.restaurant?.name}
//                 </h3>

//                 {/* Cuisine */}
//                 <p style={{ color: "#2980b9" }}>
//                   {f.restaurant?.cuisine}
//                 </p>

//                 {/* Description */}
//                 <p style={{ color: "#555" }}>
//                   {f.restaurant?.description?.slice(0, 70)}...
//                 </p>

//                 {/* ⭐ Rating */}
//                 <p>
//                   ⭐ <strong>{f.avgRating.toFixed(1)}</strong>
//                   <span style={{ color: "#7f8c8d" }}>
//                     {" "}({f.reviewsCount} reviews)
//                   </span>
//                 </p>

//               </div>
//             </div>
//           ))}

//         </div>
//       )}
//     </div>
//   );
// }


// // src/pages/Favorites.jsx
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";
// import { AuthContext } from "../Contexts/AuthContext";
// import restaurantsData from "../assets/restaurants.json";

// export default function Favorites() {

//   const { token } = useContext(AuthContext);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const nav = useNavigate();

//   useEffect(() => {
//     const fetchFavs = async () => {
//       try {
//         const res = await api.get("/api/favorite/me");
//         const data = res.data;
//         const favs = data.favorites || [];

//         const favoriteRestaurants = favs.map((f) => {
//           const rest = restaurantsData.find((r) => r.id === f.restaurantId);
//           return { ...f, restaurant: rest || { id: f.restaurantId, name: f.restaurantId } };
//         });

//         setFavorites(favoriteRestaurants);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load favorites");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavs();
//   }, [token]);


//   // 🗑 remove all favorites handler
//   const handleRemoveAll = async () => {
//     if (!token) return alert("Please login");

//     const confirmDelete = window.confirm("Remove ALL favorites?");
//     if (!confirmDelete) return;

//     try {
//       await api.delete("/api/favorite/remove-all");
//       setFavorites([]);  // update UI instantly
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove favorites");
//     }
//   };


//   if (loading) return <div className="container"><p>Loading...</p></div>;

//   return (
//     <div className="container" style={{ position: "relative" }}>

//       {/* Back button top-left */}
//       <button
//         className="btn"
//         onClick={() => nav(-1)}
//         style={{
//           position: "absolute",
//           top: 10,
//           left: 10
//         }}
//       >
//         ← Back
//       </button>

//       {/* Remove All top-right */}
//       {favorites.length > 0 && (
//         <button
//           className="btn danger"
//           onClick={handleRemoveAll}
//           style={{
//             position: "absolute",
//             top: 10,
//             right: 10
//           }}
//         >
//           Remove All
//         </button>
//       )}

//       <h2 style={{ textAlign: "center", marginTop: 50 }}>My Favorites</h2>

//       {favorites.length === 0 ? (
//         <p>No favorites yet. Add some from Home.</p>
//       ) : (
//         <div className="grid">
//           {favorites.map((f) => (
//             <div key={f.id} className="card">
//               <img
//                 src={f.restaurant?.image || "https://via.placeholder.com/300x180"}
//                 alt={f.restaurant?.name}
//               />
//               <div className="card-body">
//                 <h3>{f.restaurant?.name}</h3>
//                 <p>{f.restaurant?.cuisine}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// // src/pages/Favorites.jsx
// import React, { useContext, useEffect, useState } from "react";
// import api from "../api/api";
// // import { AuthContext } from "../contexts/AuthContext";
// import { AuthContext } from "../Contexts/AuthContext";
// import restaurantsData from "../assets/restaurants.json";

// export default function Favorites() {
//   const { token } = useContext(AuthContext);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFavs = async () => {
//       try {
//         const res = await api.get("/api/favorite/me");
//         const data = res.data;
//         // backend returns user favorite response with favorites array that has restaurantId fields
//         const favs = data.favorites || [];
//         // map restaurantId to restaurant object in our frontend JSON data
//         const favoriteRestaurants = favs.map(f => {
//           const rest = restaurantsData.find(r => r.id === f.restaurantId);
//           return { ...f, restaurant: rest || { id: f.restaurantId, name: f.restaurantId } };
//         });
//         setFavorites(favoriteRestaurants);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to load favorites");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFavs();
//   }, [token]);

//   if (loading) return <div className="container"><p>Loading...</p></div>;

//   return (
//     <div className="container">
//       <h2>My Favorites</h2>
//       {favorites.length === 0 ? (
//         <p>No favorites yet. Add some from Home.</p>
//       ) : (
//         <div className="grid">
//           {favorites.map(f => (
//             <div key={f.id} className="card">
//               <img src={f.restaurant?.image || "https://via.placeholder.com/300x180"} alt={f.restaurant?.name} />
//               <div className="card-body">
//                 <h3>{f.restaurant?.name}</h3>
//                 <p>{f.restaurant?.cuisine}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
