
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Signin } from './pages/signin';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { Cards } from './pages/cards';
import { Collection } from './pages/collection';
import { Card } from './pages/card';
import { CardInCollection } from './pages/cardincollection';
import { Home } from './pages/home';
import { Wishlist } from './pages/wishlist';
import { Premium } from './pages/premium';
import { Admin } from './pages/admin';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account/signin" element={<Signin />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/cards/:card_id" element={<Card />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/:cardincollection_id" element={<CardInCollection />} />
          <Route path="/wishlist" element={<Wishlist/>} />
          <Route path="/premium" element={<Premium/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
