// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";


export default function Navbar() {
  const { user, logout, token  } = useContext(AuthContext);
  const nav = useNavigate();
  const handleLogout = () => {
    logout();
    nav("/");
  };
const handleRemoveAll = async () => {
    if (!token) {
      alert("Please login to use this action");
      return;
    }
    const ok = window.confirm("Remove all favorites?");
    if (!ok) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:8081"}/api/favorite/remove-all`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert("All favorites removed.");
        // optionally trigger a global refresh (you can implement an event or simple reload)
        window.location.reload();
      } else {
        const text = await res.text();
        alert("Failed to remove all: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Request failed");
    }
  };
  return (
    <nav className="nav glass">
      <div className="logo"><Link to="/">Foodie</Link></div>
      <div className="links">
        <NavLink to="/" className={({isActive}) => isActive ? "tab active" : "tab"}>
          Home
        </NavLink>
        <NavLink to="/favorites" className={({isActive}) => isActive ? "tab active" : "tab"}>
          My Favorites
        </NavLink>
        {user ? (
          <>
          
            <span className="username">{user.name || user.email}</span>
            <button onClick={handleLogout} className="btn">Logout</button>
          </>
        ) : (
          <>
          {/* <Link to="/profile">Profile</Link> */}
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
