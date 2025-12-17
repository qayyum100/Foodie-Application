// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email }
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      // Optionally: fetch 'me' claims from backend for fresh user info
      api.get("/api/auth/me")
        .then(res => {
          const claims = res.data;
          // claims likely contains id, email. Backend returns claims object; adapt accordingly
          setUser({
            id: claims.id,
            email: claims.email,
            name: claims.name || ""
          });
        })
        .catch(() => {
          // token invalid or backend not reachable; clear
          setToken(null);
          setUser(null);
          localStorage.removeItem("auth_token");
        });
    } else {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  }, [token]);
  const login = (tokenValue, userObj) => {
    setToken(tokenValue);
    setUser(userObj);
    localStorage.setItem("auth_token", tokenValue);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
