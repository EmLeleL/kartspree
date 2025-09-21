import {useState} from 'react'
import { NavLink } from "react-router-dom";
import { useCart } from '../contexts/CartContext.jsx';

import "./ProductCard.css";


const ProductCard = ({img1,img2, img3, img4, title, summary, price, id, rating }) => {
  
  // Collect thumbnails into an array and filter out null/undefined
  const thumbnails = [img1,img2, img3, img4].filter(Boolean);
  const [selectedImg, setSelectedImg] = useState(thumbnails[0]);
  const [count, setCount] = useState(1);
  const {addToCart} = useCart();

  const handleIncrease = () => setCount(count + 1);
  const handleDecrease = () => setCount(count > 1 ? count - 1 : 1);

  const handleAddToCart = () => {
    addToCart({
      _id: id,
      title,
      price,
      image: img1, // Use the first image as the cart image
      rating
    }, count);
    
    // Reset count after adding to cart
    setCount(1);
    
    // Show a notification or feedback to user
    alert(`${count} ${title} added to cart!`);
  };


  return (
     <div className="product-page">
      <div className="products-card">
        {/* Image Section */}
        <div className="image-section">
            <NavLink to={`/product/${id}`} className="main-image-link">
              <img src={selectedImg} alt="Main" className="main-image" />
            </NavLink>
          <div className="thumbnail-list">
            {thumbnails.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className={`thumbnail ${selectedImg === img ? "active" : ""}`}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          <h1 className="product-title">{title}</h1>
          <span className="product-rating">⭐{rating.toFixed(1)}</span>  
          {/* <p className="product-description">{summary}</p> */}

          <div className="purchase-row">
            <span className="product-price">€{price}</span>
            <div className="cart-controls">
              <button className="count-btn" onClick={handleDecrease}>-</button>
              <span className="item-count">{count}</span>
              <button className="count-btn" onClick={handleIncrease}>+</button>
              <button className="cart-button" onClick={handleAddToCart} >🛒</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard



