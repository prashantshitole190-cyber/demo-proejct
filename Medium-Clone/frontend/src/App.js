import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Article from './pages/Article';
import Write from './pages/Write';
import SavedArticles from './pages/SavedArticles';
import Stories from './pages/Stories';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Help from './pages/Help';
import About from './pages/About';
import Following from './pages/Following';
import Notifications from './components/Notifications';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/write" element={<Write />} />
                <Route path="/saved" element={<SavedArticles />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/about" element={<About />} />
                <Route path="/following" element={<Following />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/article/:slug" element={<Article />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;