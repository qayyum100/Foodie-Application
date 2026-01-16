// src/components/Navbar.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";

export default function Navbar() {
  const { user, logout, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <nav className="nav glass">Loading...</nav>;

  return (
    <nav className="nav glass">
      <div className="logo-wrapper logo">
        <img
          className="nav-logo"
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgC5LLi2Hk21qAeq8SNHtDswA5zj12jFONWVpm7UMB91R-j87SNNH50Yu1fECS7kiXYdxdIA-YWLEvViEICCJxtqLkzOrNIrzy9cz90OtEmDVGbIv2zuJ5RMBdkfA-CYcCdzvWIsjb64oxst8yT8UHSQCLO7V8atmpIPcoU1R4rrb7IRJuGVKzu9dKi-Lc/s320-rw/logo.png"
          alt="logo"
        />
        <Link to="/" className="brand">FAVFoodie</Link>
      </div>

      <div className="links">
        <NavLink to="/" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          Home
        </NavLink>

        <NavLink to="/favorites" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          My Favorites
        </NavLink>

        <Link to="/cart" className="cart-icon">
          🛒
          <span className={`badge ${animate ? "bounce" : ""}`}>
            {cartCount}
          </span>
        </Link>

        {user ? (
          <>
            <span className="username">{user.name || user.email}</span>
            <button onClick={handleLogout} className="btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}


// // src/components/Navbar.jsx
// import React, { useContext } from "react";
// import { Link, useNavigate, NavLink } from "react-router-dom";
// import { AuthContext } from "../Contexts/AuthContext"; // Double check folder casing
// import { CartContext } from "../Contexts/CartContext";
// import { useCart } from "../Contexts/CartContext";


// export default function Navbar() {
//   const { user, logout, token, loading } = useContext(AuthContext);
//   const navigate = useNavigate();
 
//   const { cartCount } = useCart();

//   const handleLogout = () => {
//     logout();      // Updates state in AuthContext
//     navigate("/"); // Redirects to home
//   };

//   const handleRemoveAll = async () => {
//     if (!token) {
//       alert("Please login to use this action");
//       return;
//     }
//     const ok = window.confirm("Remove all favorites?");
//     if (!ok) return;

//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:8081"}/api/favorite/remove-all`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (res.ok) {
//         alert("All favorites removed.");
//         window.location.reload(); 
//       } else {
//         const text = await res.text();
//         alert("Failed to remove all: " + text);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Request failed");
//     }
//   };

//   // Optional: Don't show links until we know if the user is logged in
//   if (loading) return <nav className="nav glass">Loading...</nav>;

//   return (
//     <nav className="nav glass">
// <div className="logo-wrapper logo">
//     <img
//       className="nav-logo"
//       src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgC5LLi2Hk21qAeq8SNHtDswA5zj12jFONWVpm7UMB91R-j87SNNH50Yu1fECS7kiXYdxdIA-YWLEvViEICCJxtqLkzOrNIrzy9cz90OtEmDVGbIv2zuJ5RMBdkfA-CYcCdzvWIsjb64oxst8yT8UHSQCLO7V8atmpIPcoU1R4rrb7IRJuGVKzu9dKi-Lc/s320-rw/logo.png"
//       alt="logo"
//     />
//     <Link to="/" className="brand">FAVFoodie</Link>
//   </div>
//       <div className="links">
//         <NavLink to="/" className={({ isActive }) => isActive ? "tab active" : "tab"}>
//           Home
//         </NavLink>
//         <NavLink to="/favorites" className={({ isActive }) => isActive ? "tab active" : "tab"}>
//           My Favorites
//         </NavLink>

//        <Link to="/cart" className="cart-icon">
//           🛒 <span className="badge">{cartCount}</span>
//         </Link>


//         {user ? (
//           <>
//             <span className="username">{user.name || user.email}</span>
//             <button onClick={handleLogout} className="btn">Logout</button>
//             {/* You can also call handleRemoveAll here if needed */}
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="btn">Login</Link>
//             <Link to="/register" className="btn">Register</Link>
//           </>

          
//         )}
//       </div>


//     </nav>
//   );
// }

// // src/components/Navbar.jsx
// import React, { useContext } from "react";
// import { Link, useNavigate, NavLink } from "react-router-dom";
// import { AuthContext } from "../Contexts/AuthContext";


// export default function Navbar() {
//   const { user, logout, token  } = useContext(AuthContext);
//   const nav = useNavigate();
//   const handleLogout = () => {
//     logout();
//     nav("/");
//   };
// const handleRemoveAll = async () => {
//     if (!token) {
//       alert("Please login to use this action");
//       return;
//     }
//     const ok = window.confirm("Remove all favorites?");
//     if (!ok) return;
//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:8081"}/api/favorite/remove-all`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         }
//       });
//       if (res.ok) {
//         alert("All favorites removed.");
//         // optionally trigger a global refresh (you can implement an event or simple reload)
//         window.location.reload();
//       } else {
//         const text = await res.text();
//         alert("Failed to remove all: " + text);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Request failed");
//     }
//   };
//   return (
//     <nav className="nav glass">
//       <div className="logo"><Link to="/">FAVFoodie</Link></div>
//       <div className="links">
//         <NavLink to="/" className={({isActive}) => isActive ? "tab active" : "tab"}>
//           Home
//         </NavLink>
//         <NavLink to="/favorites" className={({isActive}) => isActive ? "tab active" : "tab"}>
//           My Favorites
//         </NavLink>
//         {user ? (
//           <>
          
//             <span className="username">{user.name || user.email}</span>
//             <button onClick={handleLogout} className="btn">Logout</button>
//           </>
//         ) : (
//           <>
//           {/* <Link to="/profile">Profile</Link> */}
//             <Link to="/login" className="btn">Login</Link>
//             <Link to="/register" className="btn">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// // src/components/Navbar.jsx
// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../Contexts/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useContext(AuthContext);
//   const nav = useNavigate();

//   const handleLogout = () => {
//     logout();
//     nav("/");
//   };

//   return (
//     <nav className="nav">
//       <div className="logo"><Link to="/">Foodie</Link></div>
//       <div className="links">
//         <Link to="/">Home</Link>
//         <Link to="/favorites">My Favorites</Link>
//         {user ? (
//           <>
          
//             <span className="username">{user.name || user.email}</span>
//             <button onClick={handleLogout} className="btn">Logout</button>
//           </>
//         ) : (
//           <>
//           <Link to="/profile">Profile</Link>
//             <Link to="/login" className="btn">Login</Link>
//             <Link to="/register" className="btn">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }
