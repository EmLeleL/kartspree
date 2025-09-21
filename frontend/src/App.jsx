import { CartProvider } from "./components/contexts/CartContext.jsx";
import { SearchProvider } from "./components/contexts/SearchContext.jsx";

import Navbar from "./components/navbar/Navbar.jsx";
import Routing from './components/routing/Routing.jsx';

const App = () => {
  return (
    <SearchProvider>
      <CartProvider>
        <Navbar />
        <Routing />
      </CartProvider>
    </SearchProvider>
  )
}

export default App