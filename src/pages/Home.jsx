// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import restaurantsData from "../assets/restaurants.json";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  useEffect(() => setRestaurants(restaurantsData), []);
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


// export default function Home() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [query, setQuery] = useState("");
//   const [selectedCuisine, setSelectedCuisine] = useState("");

//   useEffect(() => setRestaurants(restaurantsData), []);

//   const cuisines = Array.from(new Set(restaurantsData.map(r => r.cuisine).filter(Boolean)));

//   const filtered = restaurants.filter(r => {
//     if (selectedCuisine && r.cuisine !== selectedCuisine) return false;
//     if (query && !r.name.toLowerCase().includes(query.toLowerCase()) && !(r.cuisine || "").toLowerCase().includes(query.toLowerCase())) return false;
//     return true;
//   });

//   return (
//     <div className="container">
//       <h2>Restaurants</h2>
//       <SearchBar query={query} setQuery={setQuery} cuisineOptions={cuisines} selectedCuisine={selectedCuisine} setSelectedCuisine={setSelectedCuisine} />
//       <div className="grid">
//         {filtered.map(r => <RestaurantCard key={r.id} rest={r} />)}
//       </div>
//     </div>
//   );
// }


// export default function Home() {
//   const [restaurants, setRestaurants] = useState([]);

//   useEffect(() => {
//     // since restaurants are static JSON in the frontend, just use them
//     setRestaurants(restaurantsData);
//   }, []);

//   return (
//     <div className="container">
//       <h2>Restaurants</h2>
//       <div className="grid">
//         {restaurants.map(r => (
//           <RestaurantCard key={r.id} rest={r} />
//         ))}
//       </div>
//     </div>
//   );
// }
