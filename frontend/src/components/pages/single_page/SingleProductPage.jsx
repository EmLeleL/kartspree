// SingleProductPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useCart } from '../../contexts/CartContext.jsx';

import styles from "./SingleProductPage.module.css";

const SingleProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedImg, setSelectedImg] = useState(product?.img1 || "");
  const [count, setCount] = useState(1);
  const { addToCart } = useCart();


  useEffect(() => {
    if (!product && id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/items/${id}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          const data = await res.json();
          setProduct(data);
          setSelectedImg(data.img1 || "");
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      };
      fetchProduct();
    }
  }, [id, product]);


  if (!product) {
    return <p>Loading product...</p>;
  }

  const thumbnails = [product.img1, product.img2, product.img3, product.img4].filter(Boolean);

  const handleIncrease = () => setCount(count + 1);
  const handleDecrease = () => setCount(count > 1 ? count - 1 : 1);

  const handleAddToCart = () => {
    addToCart({
      _id: product._id || product.id,
      title: product.title,
      price: product.price,
      image: product.img1,
      rating: product.rating
    }, count);
    
    // Reset count after adding to cart
    setCount(1);
    
    // Show a notification or feedback to user
    alert(`${count} ${product.title} added to cart!`);
  };

  return (
    <>
    <div className={styles.singleProductPage}>
      <div className={styles.imageGallery}>
        <div className={styles.thumbnailList}>
          {thumbnails.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className={`${styles.thumbnail} ${selectedImg === img ? styles.active : ""}`}
              onClick={() => setSelectedImg(img)}
            />
          ))}
        </div>
        <div className={styles.mainImageContainer}>
          <img src={selectedImg || thumbnails[0]} alt="Main" className={styles.mainImage} />
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productDescription}>{product.description}</p>

        <div className={styles.productNumbers}>
          <div className={styles.productRating}>⭐{product.rating.toFixed(1)}</div>
          <div className={styles.productPrice}>€{product.price}</div>        

          <div className={styles.quantitySection}>
            <span className={styles.label}>Quantity:</span>
            <button className={styles.countBtn} onClick={handleDecrease}>-</button>
            <span className={styles.itemCount}>{count}</span>
            <button className={styles.countBtn} onClick={handleIncrease}>+</button>
            <button className={styles.cartButton}onClick={handleAddToCart} >Add to Cart</button>
          </div>
        </div>        
      </div>
    </div>
    <div className={styles.backBtnContainer}>
      <button 
        onClick={() => navigate(-1) || navigate("/products")} 
        className={styles.backBtn}>
         ❮ &nbsp; Back to Results
      </button>
      </div>
      </>
  );
};

export default SingleProductPage;
