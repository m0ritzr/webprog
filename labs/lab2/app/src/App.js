import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import inventory from './inventory.mjs'
import ComposeSalad from './ComposeSalad';
import { useState } from 'react';
import ViewOrder from './ViewOrder';

function App() {
  const [shoppingCart, setShoppingCart] = useState([]);

  const addSaladToCart = (saladToAdd) => {
    setShoppingCart([...shoppingCart, saladToAdd]);
  };

  const removeSalad = (saladToRemove) => {
    const updatedShoppingCart = shoppingCart.filter(salad => salad.uuid !== saladToRemove.uuid);
    setShoppingCart(updatedShoppingCart);
  }

  return (
    <div className="container py-4">
    <header className="pb-3 mb-4 border-bottom">
      <span className="fs-4">Min egen salladsbar</span>
    </header>

    <ViewOrder shoppingCart={shoppingCart} removeSalad={removeSalad}/>
    
    <ComposeSalad inventory={inventory} addSalad={addSaladToCart} />

    <footer className="pt-3 mt-4 text-muted border-top">
      EDAF90 - webprogrammering
    </footer>
  </div>
  );
  }

export default App;
