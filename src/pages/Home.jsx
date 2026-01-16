// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import RestaurantCard from "../components/RestaurantCard";
import restaurantsData from "../assets/restaurants.json";
import SearchBar from "../components/SearchBar";
import { AuthContext } from "../Contexts/AuthContext";

export default function Home() {
  const { token } = useContext(AuthContext); // Listen to token changes
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");

  useEffect(() => {
    setRestaurants(restaurantsData);
  }, []);

  const cuisines = Array.from(new Set(restaurantsData.map(r => r.cuisine).filter(Boolean)));
  
  const filtered = restaurants.filter(r => {
    const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
    const matchesCuisine = cuisine ? r.cuisine === cuisine : true;
    return matchesQuery && matchesCuisine;
  });

  return (
    <div className="container">
      <h2>Restaurants</h2>
      <SearchBar
        value={query}
        onChange={setQuery}
        cuisines={cuisines}
        selectedCuisine={cuisine}
        onCuisineChange={setCuisine}
      />
      <div className="grid">
        {/* The 'token' prop change here forces React to re-evaluate the children */}
        {filtered.map(r => <RestaurantCard key={r.id} rest={r} />)}
      </div>
    </div>
  );
}

// // src/pages/Home.jsx
// import React, { useEffect, useState } from "react";
// import RestaurantCard from "../components/RestaurantCard";
// import restaurantsData from "../assets/restaurants.json";
// import SearchBar from "../components/SearchBar";

// export default function Home() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [query, setQuery] = useState("");
//   const [cuisine, setCuisine] = useState("");
//   useEffect(() => setRestaurants(restaurantsData), []);
//   const cuisines = Array.from(new Set(restaurantsData.map(r => r.cuisine).filter(Boolean)));
//   const filtered = restaurants.filter(r => {
//     const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
//     const matchesCuisine = cuisine ? r.cuisine === cuisine : true;
//     return matchesQuery && matchesCuisine;
//   });
//   return (
//     <div className="container">
//       <h2>Restaurants</h2>
//       <SearchBar
//         value={query}
//         onChange={setQuery}
//         cuisines={cuisines}
//         selectedCuisine={cuisine}
//         onCuisineChange={setCuisine}
//       />
//       <div className="grid">
//         {filtered.map(r => <RestaurantCard key={r.id} rest={r} />)}
//       </div>
//     </div>
//   );
// }


//https://gemini.google.com/share/f2a0024916d3