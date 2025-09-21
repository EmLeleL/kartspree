import "./Homepage.css";
import featured from '../../../assets/images/Backpack-back.png'
import blue_front from '../../../assets/images/blue-front.webp'
import brown2_front from '../../../assets/images/brown2-front.webp'
import trek1 from '../../../assets/images/trek1.webp'
import cover_lime from '../../../assets/images/cover-lime.webp'

const Products = [
  { id: 1, name: "School Backpack", img: blue_front },
  { id: 2, name: "Casual Backpack", img: brown2_front },
  { id: 3, name: "Mountain Trek Bag", img: trek1 },
  { id: 4, name: "Accessories", img: cover_lime },
];

const Homepage = () => {
  return (
    <div>
      <div className="featured">
        <img src={featured} alt="" />
        </div>
      <main className="product-grid">
        {Products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.img} alt={p.name} />
            <h3>{p.name}</h3>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Homepage;
