import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext.jsx";
import { updateKartItem, removeFromKart } from "../../../api/kart.js";
import { checkout } from "../../../api/orders.js";
import styles from "./KartPage.module.css";

const KartPage = () => {
  const { 
    cartItems, 
    setCartItems,
    getCartTotalPrice 
  } = useCart(); // Get kart functions from context

  // get user token from storage
  const token = localStorage.getItem("token");

  // get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleQuantityChange = async(id, delta) => {
    const item = cartItems.find(item => item._id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return; // prevent going below 1

    try {
      const updatedItem = await updateKartItem(id, newQuantity, token); // call backend
      setCartItems((prev) =>
        prev.map((ci) => (ci._id === id ? updatedItem : ci))
      );
    } catch (err) {
      console.error("Error updating cart item:", err.message);
    }
  };

  // Remove item
  const handleRemove = async (id) => {
    try {
      await removeFromKart(id, token);
      setCartItems((prev) => prev.filter((ci) => ci._id !== id));
    } catch (err) {
      console.error("Error removing item:", err.message);
    }
  };

  // Checkout (move kart -> orders)
  const handleCheckout = async () => {
    try {
      const items = cartItems.map((item) => ({
      product: item.productId ?? item._id, 
      title: item.title,
      quantity: item.quantity,
    }));
      
      await checkout(items, total, token); // call backend
      setCartItems([]); // empty kart after successful checkout
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Checkout failed:", err.message);
      alert("Checkout failed, please try again");
    }
  };

  const subtotal = Math.round(getCartTotalPrice() * 100) / 100;
  const shipping = 5;
  const total = Math.round((subtotal + shipping) * 100) / 100;        // result rounded at 2 decimals

  return (
    <div className={styles.kartPage}>
      {/* User Info */}
      <div className={styles.userHeader}>
        <img src={user?.profilePic ? user.profilePic.startsWith("http")
        ? `${user.profilePic}?t=${new Date().getTime()}`
        : `http://localhost:5000${user.profilePic}?t=${new Date().getTime()}`
      : "http://localhost:5000/uploads/profilepic/glep.jpg"} alt="user avatar" className={styles.avatar} />
        <div>
          <h2 className={styles.username}>{user?.name}</h2>
          <p className={styles.email}>{user?.email}</p>
        </div>
        <button className={styles.editBtn}>
          <Link to="/profile" >Edit Profile</Link>
        </button>
      </div>

      {/* Table Inline */}
      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Your kart is empty</p>
      ) : (
        <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>PRICE</th>
            <th>QUANTITY</th>
            <th>TOTAL</th>
            <th>REMOVE</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className={styles.itemInfo}>
                      <img src={item.img1} alt={item.title} className={styles.itemImage} />
                      <span>{item.title}</span>
                    </div>
                  </td>
              <td>€{item.price}</td>
              <td>
                <div className={styles.quantity}>
                  <button onClick={() => handleQuantityChange(item._id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item._id, 1)}>
                    +
                  </button>
                </div>
              </td>
                {/* toFixed(2) only displays 2 decimals on the UI, doesn't round the number */}
              <td>€{(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item._id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping Charge</span>
          <span>€{shipping.toFixed(2)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <strong>Total</strong>
          <strong>€{total.toFixed(2)}</strong>
        </div>
        <button className={styles.checkoutBtn} onClick={handleCheckout}>Checkout</button>
      </div>
      </>
      )}
    </div>
  );
};

export default KartPage;
