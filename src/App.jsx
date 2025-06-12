import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavbarMain';
import SecondNavbar from './components/SecondNavbar';
import './App.css';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-[var(--background-color)] text-[var(--text-color)]">
        <Navbar />
        <SecondNavbar />
        <main className="w-full min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<div className="text-center mt-8">Products Page</div>} />
            <Route path="/categories" element={<div className="text-center mt-8">Categories Page</div>} />
            <Route path="/about" element={<div className="text-center mt-8">About Page</div>} />
            <Route path="/contact" element={<div className="text-center mt-8">Contact Page</div>} />
            <Route path="/login" element={<div className="text-center mt-8">Login Page</div>} />
            <Route path="/signup" element={<div className="text-center mt-8">Sign Up Page</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
