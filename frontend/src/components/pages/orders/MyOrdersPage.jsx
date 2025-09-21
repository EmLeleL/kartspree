import { useEffect, useState } from "react";
import { getOrders } from "../../../api/orders.js";
import styles from './MyOrdersPage.module.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token"); // get token

  // Fetch orders on load
  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders(token);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
      }
    }
    fetchOrders();
  }, [token]);

  return (
    <div className={styles.order_page}>
        <table className={styles.order_table}>
            <thead>
                <tr>
                <th>ORDER</th>
                <th>PRODUCT</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                </tr>
            </thead>
            <tbody>
                {orders.length === 0 ? (
            <tr>
              <td colSpan="4">No orders yet</td>
            </tr>
          ) : (
            orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>
                  {order.items.map((it) => (
                    <div key={it._id} className={styles.products}>
                      <img src={it.product.img1} alt={it.product.title} width="25" />
                      <span>  {it.product.title} x {it.quantity}</span>
                    </div>
                  ))}
                </td>
                <td>€{order.total.toFixed(2)}</td>
                <td>{order.status}</td>
              </tr>
            ))
          )}
            </tbody>
        </table>
    </div>
  )
}

export default MyOrdersPage