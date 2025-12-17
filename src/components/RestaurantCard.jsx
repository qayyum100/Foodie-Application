import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import { AuthContext } from "../Contexts/AuthContext"; // <-- use lowercase 'contexts'
import "../styles/App.css";
import { Link } from "react-router-dom";
export default function RestaurantCard({ rest }) {
  const { token } = useContext(AuthContext);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (!token) return setIsFav(false);
      try {
        const res = await api.get(`/api/favorite/check/${rest.id}`);
        if (mounted) setIsFav(Boolean(res.data));
      } catch (err) {
        if (mounted) setIsFav(false);
      }
    };
    check();
    return () => (mounted = false);
  }, [rest.id, token]);
  const handleAdd = async () => {
    if (!token) return alert("Please log in to add favorites");
    setLoading(true);
    try {
      // await api.post("/api/favorite/add", { restaurantId: rest.id });
      // setIsFav(true);
      setIsFav(true);
      await api.post("/api/favorite/add", { restaurantId: rest.id });
    } catch (err) {
      console.error(err);
      setIsFav(false);
      alert("Failed to add favorite");
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
      // setIsFav(false);
    } catch (err) {
      console.error(err);
      setIsFav(true);
      alert("Failed to remove favorite");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="card">
      <Link to={`/restaurant/${rest.id}`}>
        <img src={rest.image || "https://via.placeholder.com/400x220"} alt={rest.name} />
      </Link>
      <div className="card-body">
        <h3>{rest.name}</h3>
        <p className="meta">{rest.cuisine}</p>
        <div style={{display:"flex", gap:8, marginTop:12}}>
          <Link to={`/restaurant/${rest.id}`} className="btn btn-sm">View</Link>
          {isFav ? (
            <button className="btn btn-sm danger" onClick={handleRemove} disabled={loading}>
              ♥️ Remove
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
//       await api.post("/api/favorite/add", { restaurantId: rest.id });
//       setIsFav(true);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async () => {
//     if (!token) return alert("Please log in to remove favorites");
//     setLoading(true);
//     try {
//       await api.delete(`/api/favorite/remove/${rest.id}`);
//       setIsFav(false);
//     } catch (err) {
//       console.error(err);
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
//         <p>{rest.cuisine}</p>
//         <div className="card-actions">
//           <Link to={`/restaurant/${rest.id}`} className="btn btn-sm">View</Link>
//           {isFav ? (
//             <button className="btn btn-sm danger" onClick={handleRemove} disabled={loading}>
//               ♥ Remove
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



// import React, { useContext, useState, useEffect } from "react";
// import api from "../api/api";
// import { AuthContext } from "../Contexts/AuthContext";
// import "../styles/App.css";
// import { Link } from "react-router-dom";

// export default function RestaurantCard({ rest }) {
//   const { token } = useContext(AuthContext);
//   const [isFav, setIsFav] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // check favorite on mount (only if logged in)
//   useEffect(() => {
//     let mounted = true;
//     const check = async () => {
//       if (!token) return setIsFav(false);
//       try {
//         const res = await api.get(`/api/favorite/check/${rest.id}`);
//         if (mounted) setIsFav(Boolean(res.data));
//       } catch (err) {
//         // ignore network errors here
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
//       const res = await api.post("/api/favorite/add", { restaurantId: rest.id });
//       setIsFav(true);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async () => {
//     if (!token) return alert("Please log in to remove favorites");
//     setLoading(true);
//     try {
//       await api.delete(`/api/favorite/remove/${rest.id}`);
//       setIsFav(false);
//     } catch (err) {
//       console.error(err);
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
//         <p>{rest.cuisine}</p>
//         <div className="card-actions">
//           <Link to={`/restaurant/${rest.id}`} className="btn btn-sm">View</Link>
//           {isFav ? (
//             <button className="btn btn-sm danger" onClick={handleRemove} disabled={loading}>
//               ♥ Remove
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


// export default function RestaurantCard({ rest }) {
//   const { token } = useContext(AuthContext);
//   const [isFav, setIsFav] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Check if restaurant is already a favorite
//   useEffect(() => {
//     if (!token) return;
//     api.get(`/api/favorite/check/${rest.id}`)
//       .then(res => setIsFav(res.data === true))
//       .catch(() => setIsFav(false));
//   }, [token, rest.id]);

//   // Add to favorites
//   const handleAddFavorite = async () => {
//     if (!token) {
//       alert("Please log in first");
//       return;
//     }
//     try {
//       setLoading(true);
//       await api.post("/api/favorite/add", { restaurantId: rest.id });
//       setIsFav(true);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove from favorites
//   const handleRemoveFavorite = async () => {
//     try {
//       setLoading(true);
//       await api.delete(`/api/favorite/remove/${rest.id}`);
//       setIsFav(false);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to remove favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card">
//       <img src={rest.image} alt={rest.name} />
//       <div className="card-body">
//         <h3>{rest.name}</h3>
//         <p>{rest.cuisine}</p>

//         {isFav ? (
//           <button
//             className="remove-btn"
//             onClick={handleRemoveFavorite}
//             disabled={loading}
//           >
//             ❤️ Remove Favorite
//           </button>
//         ) : (
//           <button
//             className="add-btn"
//             onClick={handleAddFavorite}
//             disabled={loading}
//           >
//             🤍 Add Favorite
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function RestaurantCard({ rest }) {
//   const { token } = useContext(AuthContext);
//   const [isFav, setIsFav] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Check if this restaurant is favorite on mount (backend: GET /api/favorite/check/:restaurantId)
//   useEffect(() => {
//     let mounted = true;
//     const check = async () => {
//       try {
//         const res = await api.get(`/api/favorite/check/${rest.id}`);
//         if (mounted) setIsFav(!!res.data);
//       } catch (err) {
//         // ignore (not logged in / network)
//       }
//     };
//     if (token) check();
//     return () => (mounted = false);
//   }, [rest.id, token]);

//   const handleAddFavorite = async () => {
//     if (!token) { alert("Please login to add favorites"); return; }
//     setLoading(true);
//     try {
//       if (!isFav) {
//         await api.post("/api/favorite/add", { restaurantId: rest.id });
//         setIsFav(true);
//       } else {
//         await api.delete(`/api/favorite/remove/${rest.id}`);
//         setIsFav(false);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card">
//       <img src={rest.image || "https://via.placeholder.com/300x180"} alt={rest.name} />
//       <div className="card-body">
//         <h3>{rest.name}</h3>
//         <p className="muted">{rest.cuisine}</p>
//         <p>{rest.desc}</p>
//         <div className="card-actions">
//           <button onClick={handleAddFavorite} className={`fav-btn ${isFav? "fav":""}`} disabled={loading}>
//             {isFav ? "♥ Remove" : "♡ Favorite"}
//           </button>
//           <a className="details-link" href={`/restaurant/${rest.id}`}>Details</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// // src/components/RestaurantCard.jsx
// import React, { useContext, useState } from "react";
// import api from "../api/api";
// import { AuthContext } from "../Contexts/AuthContext"; 

// export default function RestaurantCard({ rest, onFavorited }) {
//   const { token } = useContext(AuthContext);
//   const [loading, setLoading] = useState(false);

//   const handleAddFavorite = async () => {
//     if (!token) {
//       alert("Please login to add favorites.");
//       return;
//     }
//     setLoading(true);
//     try {
//       await api.post("/api/favorite/add", { restaurantId: rest.id });
//       onFavorited && onFavorited(rest.id);
//       alert("Added to favorites");
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data || "Failed to add favorite");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="card">
//       <img src={rest.image} alt={rest.name} />
//       <div className="card-body">
//         <h3>{rest.name}</h3>
//         <p className="meta">{rest.cuisine} · ⭐ {rest.rating}</p>
//         <p>{rest.description}</p>
//         <button className="btn" onClick={handleAddFavorite} disabled={loading}>
//           {loading ? "Adding..." : "Add to Favorites"}
//         </button>
//       </div>
//     </div>
//   );
// }
