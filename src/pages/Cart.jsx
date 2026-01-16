import React from "react";
import { useCart } from "../Contexts/CartContext";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const {
    items,
    totalAmount,
    removeFromCart,
    clearCart,
    increaseQty,
    decreaseQty
  } = useCart();

  return (
   <div className="container">

  <button
    className="btn"
    style={{ marginBottom: 16 }}
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>

  <h2 style={{ textAlign: "center" }}>My Cart</h2>

  <div className="cart-wrapper">
    <div className="cart-parallax glass cart-card">

      {items.length === 0 ? (
        <p style={{ textAlign: "center", fontWeight: 600 }}>
          Your cart is empty 🛒
        </p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map(item => (
                <tr key={item.itemId}>
                  <td>{item.itemName}</td>
                  <td>₹{item.price}</td>

                  <td className="qty-controls">
                    <button
                      onClick={() => decreaseQty(item.itemId)}
                      disabled={item.quantity <= 1}
                      className="qty-btn"
                    >
                      −
                    </button>

                    <span style={{ margin: "0 10px" }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item.itemId)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn danger"
                      onClick={() => removeFromCart(item.itemId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="cart-total" style={{ textAlign: "center" }}>
            Total: ₹{totalAmount}
          </h3>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button className="btn danger" onClick={clearCart}>
              Clear Cart
            </button>

            <button className="btn" style={{ marginLeft: 12 }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

    </div>
  </div>
</div>

  );
}


// import React from "react";
// import { useCart } from "../Contexts/CartContext";
// import "../styles/App.css";



// export default function Cart() {
//   const { items, totalAmount, removeFromCart, clearCart, increaseQty, decreaseQty } = useCart();
//   return (
//     <div className="container">
//       <h2>My Cart</h2>

//       {items.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <>
//           <table className="cart-table">
//             <thead>
//               <tr>
//                 <th>Item</th>
//                 <th>Price</th>
//                 <th>Qty</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map(item => (
//                 <tr key={item.itemId}>
//                   <td>{item.itemName}</td>
//                   <td>₹{item.price}</td>
//                   <td className="qty-controls">
//   <button onClick={() => decreaseQty(item.itemId)}>-</button>
//   <span>{item.quantity}</span>
//   <button onClick={() =>
//     increaseQty({
//       itemId: item.itemId,
//       itemName: item.itemName,
//       price: item.price
//     })
//   }>
//     +
//   </button>
// </td>

//                   <td>
//                     <button
//                       className="btn danger"
//                       onClick={() => removeFromCart(item.itemId)}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <h3>Total: ₹{totalAmount}</h3>

//           <button className="btn danger" onClick={clearCart}>
//             Clear Cart
//           </button>

//           <button className="btn" style={{ marginLeft: 10 }}>
//             Proceed to Checkout
//           </button>
//         </>
//       )}
//     </div>
//   );
// }


// import React, { useContext } from "react";
// import { CartContext } from "../Contexts/CartContext";
// import "../styles/App.css";

// export default function Cart() {
//   const { cart, removeFromCart, clearCart } = useContext(CartContext);

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <div className="container">
//       <h2>My Cart</h2>

//       {cart.length === 0 ? <p>Your cart is empty</p> : (
//         <>
//           <table className="cart-table">
//             <tbody>
//               {cart.map(item => (
//                 <tr key={item.itemId}>
//                   <td>{item.itemName}</td>
//                   <td>₹{item.price}</td>
//                   <td>x {item.quantity}</td>
//                   <td>
//                     <button onClick={() => removeFromCart(item.itemId)}>Remove</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <h3>Total: ₹{total}</h3>

//           <button className="btn danger" onClick={clearCart}>Clear Cart</button>
//           <button className="btn" style={{ marginLeft: 10 }}>
//             Proceed to Checkout
//           </button>
//         </>
//       )}
//     </div>
//   );
// }
