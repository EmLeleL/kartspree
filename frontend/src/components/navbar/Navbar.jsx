import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useSearch } from "../contexts/SearchContext.jsx";

import "./Navbar.css";
import kS from '../../assets/images/kS-no-background.png'
import LogoutButton from "../authentication/LogoutButton.jsx";


const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [input, setInput] = useState(""); // local input state
  const [user, setUser] = useState(null);
  const { setQuery } = useSearch();
  const navigate = useNavigate(); // for navigation

  const { getCartTotal } = useCart();
  
  function handleSubmit(e) {
    e.preventDefault();
    setQuery(input);  // update search ONLY on submit
    navigate("/products"); // go to ProductsPage after search
    setInput("");      // reset the input bar
  }

  // fetch user profile if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);


  return (
    <nav className="navbar">
      {/* Left title */}
      <div className="navbar-logo">
        <NavLink to="/">KartSpree</NavLink>
        <img src={kS} alt="kart" className="img-kart" />
      </div>

      {/* Center search bar */}
      <div className="navbar-search">
        <form className="navbar-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Search products..."
          value={input}    // controlled input reflects local state
          onChange={(e) => setInput(e.target.value)} />
          </form>
      </div>

      {/* Right side buttons and custom drop down selection button */}
      <div className="navbar-links">
        <div
          className="dropdown"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button type="button" className="nav-btn">Products</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <NavLink 
                to="/products?product=Backpacks"      /* query by product=Backpacks */
                onClick={() => {setQuery("")}}>       {/*Clear the search query when navigating to Products*/}
                  Backpacks
              </NavLink>
              <NavLink 
                to="/products?product=Accessories"    /* query by product=Backpacks */
                onClick={() => {setQuery("")}}>       {/*Clear the search query when navigating to Accessories*/}
                  Accessories
              </NavLink>
            </div>
          )}
        </div>
        <NavLink to="/login" className="nav-btn">Login</NavLink>
        <NavLink to="/orders" className="nav-btn">My Orders</NavLink>
        <NavLink to="/kart" className="cart-btn">🛒 <p className="cart-btn count"> {user ? getCartTotal() : 0} </p> </NavLink>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
