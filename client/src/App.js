
import './App.css';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Signin } from './pages/signin';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { Cards } from './pages/cards';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
          <Routes>
            <Route path="/account/signin" element={<Signin/>}/>
            <Route path="/account/register" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/cards" element={<Cards/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
