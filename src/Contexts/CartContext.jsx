import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  // ✅ SAFE DEFAULT STATE
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0
  });

  // 🔁 Load cart when token changes
  useEffect(() => {
    if (!token) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }

    loadCart();
  }, [token]);

//   useEffect(() => {
//   console.log("🛒 CART ITEMS:", cart.items);
//   console.log("🧮 CART COUNT:", cartCount);
// }, [cart]);


const loadCart = async () => {
  try {
    const res = await api.get("/api/cart/my");

    // ✅ BACKEND RETURNS ARRAY
    const items = Array.isArray(res.data) ? res.data : [];

    setCart({
      items,
      totalAmount: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    });
  } catch (err) {
    console.error("Failed to load cart", err);
    setCart({ items: [], totalAmount: 0 });
  }
};


// ➕ ADD (FIXED)
const addToCart = async (item) => {
  try {
    await api.post("/api/cart/add", item);
    await loadCart(); // 🔥 FORCE refresh
  } catch (err) {
    console.error(err);
  }
};

// ➖ REMOVE (FIXED)
const removeFromCart = async (itemId) => {
  try {
    await api.delete(`/api/cart/remove/${itemId}`);
    await loadCart(); // 🔥 FORCE refresh
  } catch (err) {
    console.error(err);
  }
};

// const addToCart = async (item) => {
//   try {
//     const res = await api.post("/api/cart/add", item);

//     const items = Array.isArray(res.data) ? res.data : [];

//     setCart({
//       items,
//       totalAmount: items.reduce(
//         (sum, i) => sum + i.price * i.quantity,
//         0
//       )
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };
  

// // ➕ ADD --> NOT WORKING AS EXPECTED
  // const addToCart = async (item) => {
  //   try {
  //     await api.post("/api/cart/add", item);
  //     await loadCart();              // 🔥 ADD THIS
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

// const removeFromCart = async (itemId) => {
//   try {
//     const res = await api.delete(`/api/cart/remove/${itemId}`);

//     const items = Array.isArray(res.data) ? res.data : [];

//     setCart({
//       items,
//       totalAmount: items.reduce(
//         (sum, i) => sum + i.price * i.quantity,
//         0
//       )
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };


  // ➖ REMOVE  ✅ FIXED
  // const removeFromCart = async (itemId) => {
  //   try {
  //     await api.delete(`/api/cart/remove/${itemId}`);
  //     await loadCart();              // 🔥 ADD THIS
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // 🧹 CLEAR (already OK)
  const clearCart = async () => {
    try {
      await api.delete("/api/cart/clear");
      setCart({ items: [], totalAmount: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 CHECK
  const isInCart = (itemId) =>
    cart.items.some(i => i.itemId === itemId);

  // 🔢 COUNT (SAFE)
  const cartCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

// ➕ INCREASE (Optimistic)
const increaseQty = async (itemId) => {
  setCart(prev => ({
    ...prev,
    items: prev.items.map(i =>
      i.itemId === itemId
        ? { ...i, quantity: i.quantity + 1 }
        : i
    )
  }));

  try {
    await api.post(`/api/cart/increase/${itemId}`);
    await loadCart(); // sync with backend
  } catch (err) {
    console.error(err);
    await loadCart(); // rollback safety
  }
};

// ➖ DECREASE (SAFE + OPTIMISTIC)
const decreaseQty = async (itemId) => {
  const item = cart.items.find(i => i.itemId === itemId);

  // 🛑 GUARD: do nothing if qty is 1
  if (!item || item.quantity <= 1) return;

  // Optimistic UI
  setCart(prev => ({
    ...prev,
    items: prev.items.map(i =>
      i.itemId === itemId
        ? { ...i, quantity: i.quantity - 1 }
        : i
    )
  }));

  try {
    await api.post(`/api/cart/decrease/${itemId}`);
    await loadCart();
  } catch (err) {
    console.error(err);
    await loadCart(); // rollback safety
  }
};



// // ➕ INCREASE QUANTITY
// const increaseQty = async (itemId) => {
//   try {
//     const res = await api.post(`/api/cart/increase/${itemId}`);
//     const items = Array.isArray(res.data) ? res.data : [];

//     setCart({
//       items,
//       totalAmount: items.reduce(
//         (sum, i) => sum + i.price * i.quantity,
//         0
//       )
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// // ➖ DECREASE QUANTITY
// const decreaseQty = async (itemId) => {
//   try {
//     const res = await api.post(`/api/cart/decrease/${itemId}`);
//     const items = Array.isArray(res.data) ? res.data : [];

//     setCart({
//       items,
//       totalAmount: items.reduce(
//         (sum, i) => sum + i.price * i.quantity,
//         0
//       )
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };


  // 🔢 TOTAL AMOUNT (SAFE)
const totalAmount = cart.items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

  return (
    <CartContext.Provider
  value={{
    items: cart.items,
    cartCount,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    increaseQty,
    decreaseQty
  }}
>

      {children}
    </CartContext.Provider>
  );
};

// ✅ helper hook
export const useCart = () => useContext(CartContext);



// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState
// } from "react";
// import api from "../api/api";
// import { AuthContext } from "./AuthContext";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { token } = useContext(AuthContext);

//   // ✅ SAFE DEFAULT STATE
//   const [cart, setCart] = useState({
//     items: [],
//     totalAmount: 0
//   });

//   // 🔁 Load cart when token changes
//   useEffect(() => {
//     if (!token) {
//       setCart({ items: [], totalAmount: 0 });
//       return;
//     }

//     loadCart();
//   }, [token]);

//   const loadCart = async () => {
//     try {
//       const res = await api.get("/api/cart/my");

//       setCart({
//         items: res.data?.items || [],
//         totalAmount: res.data?.totalAmount || 0
//       });
//     } catch (err) {
//       console.error("Failed to load cart", err);
//       setCart({ items: [], totalAmount: 0 });
//     }
//   };

//   // ➕ ADD
//   const addToCart = async (item) => {
//     try {
//       const res = await api.post("/api/cart/add", item);

//       setCart({
//         items: res.data?.items || [],
//         totalAmount: res.data?.totalAmount || 0
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ➖ REMOVE
//   const removeFromCart = async (itemId) => {
//     try {
//       const res = await api.delete(`/api/cart/remove/${itemId}`);

//       setCart({
//         items: res.data?.items || [],
//         totalAmount: res.data?.totalAmount || 0
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🧹 CLEAR
//   const clearCart = async () => {
//     try {
//       await api.delete("/api/cart/clear");
//       setCart({ items: [], totalAmount: 0 });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🔍 CHECK
//   const isInCart = (itemId) =>
//     cart.items.some(i => i.itemId === itemId);

//   // 🔢 COUNT (SAFE)
//   const cartCount = cart.items.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         // expose simple API
//         items: cart.items,
//         cartCount,
//         totalAmount: cart.totalAmount,

//         // actions
//         addToCart,
//         removeFromCart,
//         clearCart,
//         isInCart
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // ✅ helper hook
// export const useCart = () => useContext(CartContext);


// import React, { createContext, useState, useEffect, useContext } from "react";
// import api from "../api/api";
// import { AuthContext } from "./AuthContext";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { token } = useContext(AuthContext);

//   // ✅ STEP 1: SAFE DEFAULT STATE
//   const [cart, setCart] = useState({
//     items: [],
//     totalAmount: 0
//   });

//   const [count, setCount] = useState(0);

//   // ✅ STEP 2: LOAD CART SAFELY
//   useEffect(() => {
//     if (!token) {
//       setCart({ items: [], totalAmount: 0 });
//       setCount(0);
//       return;
//     }

//     const loadCart = async () => {
//       try {
//         const res = await api.get("/api/cart/my");

//         setCart({
//           items: res.data?.items || [],
//           totalAmount: res.data?.totalAmount || 0
//         });

//         // ✅ STEP 3: SAFE REDUCE
//         const totalQty = (res.data?.items || []).reduce(
//           (sum, item) => sum + item.quantity,
//           0
//         );

//         setCount(totalQty);
//       } catch (err) {
//         console.error("Failed to load cart", err);

//         // fallback
//         setCart({ items: [], totalAmount: 0 });
//         setCount(0);
//       }
//     };

//     loadCart();
//   }, [token]);

//   // ✅ ADD TO CART
//   const addToCart = async (item) => {
//     try {
//       const res = await api.post("/api/cart/add", item);

//       setCart({
//         items: res.data?.items || [],
//         totalAmount: res.data?.totalAmount || 0
//       });

//       setCount(
//         (res.data?.items || []).reduce(
//           (sum, v) => sum + v.quantity,
//           0
//         )
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ REMOVE ITEM
//   const removeFromCart = async (itemId) => {
//     try {
//       const res = await api.delete(`/api/cart/remove/${itemId}`);

//       setCart({
//         items: res.data?.items || [],
//         totalAmount: res.data?.totalAmount || 0
//       });

//       setCount(
//         (res.data?.items || []).reduce(
//           (sum, v) => sum + v.quantity,
//           0
//         )
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ CLEAR CART
//   const clearCart = async () => {
//     try {
//       await api.delete("/api/cart/clear");
//       setCart({ items: [], totalAmount: 0 });
//       setCount(0);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         count,
//         addToCart,
//         removeFromCart,
//         clearCart
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };



// import React, { createContext, useState, useEffect, useContext } from "react";
// import api from "../api/api";
// import { AuthContext } from "./AuthContext";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { token } = useContext(AuthContext);
//   const [cart, setCart] = useState([]);        // items from backend
//   const [count, setCount] = useState(0);       // total quantity

//   // Load cart from backend if logged in
//   useEffect(() => {
//     if (!token) {
//       setCart([]);
//       setCount(0);
//       return;
//     }

//     api.get("/api/cart/my")
//       .then(res => {
//         setCart(res.data.items || []);
//         setCount(res.data.items?.reduce((sum, item) => sum + item.quantity, 0));
//       })
//       .catch(() => {});
//   }, [token]);

//   // Add item to cart
//   const addToCart = async (item) => {
//     try {
//       const res = await api.post("/api/cart/add", item);
//       setCart(res.data.items);
//       setCount(res.data.items.reduce((s, v) => s + v.quantity, 0));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     try {
//       const res = await api.delete(`/api/cart/remove/${itemId}`);
//       setCart(res.data.items);
//       setCount(res.data.items.reduce((s, v) => s + v.quantity, 0));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const clearCart = async () => {
//     try {
//       await api.delete("/api/cart/clear");
//       setCart([]);
//       setCount(0);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <CartContext.Provider value={{ cart, count, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
