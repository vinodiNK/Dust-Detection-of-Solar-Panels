import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './home';
import Login from './Login';
import Signup from './Signup';


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
