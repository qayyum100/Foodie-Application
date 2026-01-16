// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(true); // Added to prevent UI flicker

  useEffect(() => {
    let isMounted = true;

    if (token) {
      localStorage.setItem("auth_token", token);
      
      api.get("/api/auth/me")
        .then((res) => {
          if (isMounted) {
            const claims = res.data;
            setUser({
              id: claims.id,
              email: claims.email,
              name: claims.name || "",
            });
          }
        })
        .catch(() => {
          if (isMounted) {
            setToken(null);
            setUser(null);
            localStorage.removeItem("auth_token");
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      localStorage.removeItem("auth_token");
      setUser(null);
      setLoading(false);
    }

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount/logout
    };
  }, [token]);

  const login = (tokenValue, userObj) => {
    localStorage.setItem("auth_token", tokenValue);
    setToken(tokenValue);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// // src/contexts/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import api from "../api/api";
// export const AuthContext = createContext();
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { id, name, email }
//   const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("auth_token", token);
//       // Optionally: fetch 'me' claims from backend for fresh user info
//       api.get("/api/auth/me")
//         .then(res => {
//           const claims = res.data;
//           // claims likely contains id, email. Backend returns claims object; adapt accordingly
//           setUser({
//             id: claims.id,
//             email: claims.email,
//             name: claims.name || ""
//           });
//         })
//         .catch(() => {
//           // token invalid or backend not reachable; clear
//           setToken(null);
//           setUser(null);
//           localStorage.removeItem("auth_token");
//         });
//     } else {
//       localStorage.removeItem("auth_token");
//       setUser(null);
//     }
//   }, [token]);
//   const login = (tokenValue, userObj) => {
//     setToken(tokenValue);
//     setUser(userObj);
//     localStorage.setItem("auth_token", tokenValue);
//   };
//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("auth_token");
//   };
//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };