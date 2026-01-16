
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import RestaurantDetail from "./pages/RestaurantDetail";
//import { AuthProvider } from "./contexts/AuthContext";
import { AuthProvider } from "./Contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./Contexts/CartContext";
import "./styles/App.css";
import Cart from "./pages/Cart";


function App() {
  return (
    <AuthProvider>
       <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;
