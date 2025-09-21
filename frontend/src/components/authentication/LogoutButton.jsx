import { useNavigate } from "react-router-dom";
import styles from './LogoutButton.module.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    alert("Logged out successfully!");
    navigate("/"); // redirect to home (or /login if you prefer)
  };

  return (
    <button onClick={handleLogout} className={styles.nav_btn}>
      Logout
    </button>
  );
};

export default LogoutButton;
