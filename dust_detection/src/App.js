import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dust Detection of Solar Panels</h1>
        <p>Welcome — you're logged in.</p>
        <nav>
          <Link to="/">Login</Link> | <Link to="/signup">Sign Up</Link>
        </nav>
      </header>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
