import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink } from "react-router-dom";
import { Outlet } from 'react-router-dom';


function Header() {
  return(
    <header className="pb-3 mb-4 border-bottom">
      <span className="fs-4">Min egen salladsbar</span>
    </header>
  )
}

function NavBar() {
  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <NavLink className="nav-link" to="/compose-salad">
          Komponera en sallad
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className="nav-link" to="/view-order">
          Se din beställning
        </NavLink>
      </li>
    </ul>);
}

function Footer() {
 return (
  <footer className="pt-3 mt-4 text-muted border-top">
      EDAF90 - webprogrammering
    </footer>
 )
}

function App() {
  return (
    <div className="container py-4">
      <Header />
      <NavBar />
      <Outlet />
      <Footer />
  </div>
  );
  }

export default App;
