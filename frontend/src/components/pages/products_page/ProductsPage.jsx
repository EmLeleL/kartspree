// frontend/src/components/pages/products/ProductsPage.jsx
import { useEffect, useState } from "react";
import { useSearch } from "../../contexts/SearchContext.jsx";
import { NavLink, useLocation } from "react-router-dom";

import "./ProductsPage.css";
import ProductCard from "../../product_card/ProductCard.jsx";

const ProductsPage = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);

  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All Products");
  const [activeSort, setActiveSort] = useState(null);
  const [categories, setCategories] = useState([]);

  const { query, setQuery } = useSearch(); // global search state
  const location = useLocation();
  const [address, setAddress] = useState(null); // user state

  // read URL params (these are authoritative)
  const searchParams = new URLSearchParams(location.search);
  const qParam = searchParams.get("q") || "";
  const product = searchParams.get("product");
  const category = searchParams.get("category");
  const activeCategory = category; // convenience

  // Keep SearchContext in sync with the URL q parameter if present
  useEffect(() => {
    if (qParam && qParam !== query) {
      setQuery(qParam);
    }
    // if qParam is empty we leave context alone (so user typed something in Products page)
  }, [qParam, query, setQuery]);

  // Fetch: use search endpoint when query/category/min/max present,
  // otherwise fetch all items.
  useEffect(() => {
    // choose effectiveQuery = url q param if present, otherwise the context query
    const effectiveQuery = qParam || query || "";

    const params = new URLSearchParams();
    if (effectiveQuery) params.append("q", effectiveQuery);
    if (category) params.append("category", category);
    if (minPrice) params.append("min", minPrice);
    if (maxPrice) params.append("max", maxPrice);

    const shouldUseSearchEndpoint =
      effectiveQuery || category || minPrice || maxPrice;

    const endpoint = shouldUseSearchEndpoint
      ? `http://localhost:5000/api/items/search?${params.toString()}`
      : "http://localhost:5000/api/items";


    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setSortedProducts(data);

        const uniqueCategories = [
          ...new Set(data.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.error("Products fetch error:", err);
        setProducts([]);
        setSortedProducts([]);
      });
  }, [qParam, query, category, minPrice, maxPrice, location.search]);

  // Update selectedProduct title depending on URL params
  useEffect(() => {
    if (product) setSelectedProduct(product);
    else if (category) setSelectedProduct(category);
    else setSelectedProduct("All Products");
  }, [location]);


// fetch user profile if logged in
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:5000/api/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setAddress(data.address))
    .catch(() => setAddress(null));
}, []);


  // Sorting
  const handleSort = (type) => {
    let sorted = [...products];
    setActiveSort(type);
    switch (type) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating-asc":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "rating-desc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  };

  // Price handlers (fixed: use >= not arrow)
  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxPrice) setMinPrice(value);
  };
  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice) setMaxPrice(value); // fixed condition
  };

  // client-side filtering (safe checks and use lowercase)

  // added
  const effectiveQuery = qParam || query || "";

  const qLower = (query || "").toLowerCase();
  const filteredProducts = sortedProducts.filter((p) => {
    const matchesProduct = !product || p.product === product;
    const title = (p.title || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    const matchesQuery =
      !qLower ||
      title.includes(qLower) ||
      (p.product || "").toLowerCase().includes(qLower) ||
      cat.includes(qLower);
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    const matchesCategory = !category || p.category === category;
    return matchesProduct && matchesQuery && matchesPrice && matchesCategory;
  });

  return (
    <div className="products-page">
      <div className="content">
        <aside className="sidebar">
          <div className="container">
            <h3>Category</h3>
            <ul>
              {categories.map((cat) => (
                <li key={cat}>
                  <NavLink
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    onClick={() => setQuery("")}
                    className={() => (activeCategory === cat ? "active" : "")}
                  >
                    {cat}
                  </NavLink>
                </li>
              ))}
            </ul>

            <h3>Filters</h3>
            <div className="sort-buttons">
              <div className="sort-buttons-price">
                <button
                  onClick={() => handleSort("price-asc")}
                  className={activeSort === "price-asc" ? "active" : ""}
                >
                  Price ↑
                </button>
                <button
                  onClick={() => handleSort("price-desc")}
                  className={activeSort === "price-desc" ? "active" : ""}
                >
                  Price ↓
                </button>
              </div>
              <div className="sort-buttons-rating">
                <button
                  onClick={() => handleSort("rating-asc")}
                  className={activeSort === "rating-asc" ? "active" : ""}
                >
                  Rating ↑
                </button>
                <button
                  onClick={() => handleSort("rating-desc")}
                  className={activeSort === "rating-desc" ? "active" : ""}
                >
                  Rating ↓
                </button>
              </div>
            </div>

            <div className="price-filter">
              <h3>Price Range</h3>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={minPrice}
                  onChange={handleMinChange}
                  className="thumb thumb-left"
                />
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={maxPrice}
                  onChange={handleMaxChange}
                  className="thumb thumb-right"
                />
                <div
                  className="slider-track"
                  style={{
                    background: `linear-gradient(
                      to right,
                      #ccc ${(minPrice / 300) * 100}%,
                      #79a91a ${(minPrice / 300) * 100}%,
                      #79a91a ${(maxPrice / 300) * 100}%,
                      #ccc ${(maxPrice / 300) * 100}%
                    )`,
                  }}
                />
              </div>
              <p>
                €{minPrice} - €{maxPrice}
              </p>
            </div>

            <div className="ship-to">
              <p>
                Ship to: <span className="ship-destination">
                  {address ? address : `[Loading...]`}</span>
              </p>
            </div>
          </div>
        </aside>

        <main className="products-area">
          <h2>
            {query
              ? `Search results for "${query}"`
              : product
              ? product
              : category
              ? category
              : "All Products"}
          </h2>

          <ul className="products-area grid-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <li className="products-area single-cards" key={p._id}>
                  <ProductCard id={p._id} {...p} />
                </li>
              ))
            ) : (
              <p>Sorry. No matches for "{query}"</p>
            )}
          </ul>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
