import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Layout
import Layout from './components/Layout';

// CSS
import './styles/index.css';

// Private Route Component
const PrivateRoute = () => {
  const { currentUser, loading } = useUser();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }
  
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

// Public Route Component (redirects if user is logged in)
const PublicRoute = () => {
  const { currentUser, loading } = useUser();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }
  
  return !currentUser ? <Outlet /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          {/* Add more protected routes here */}
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
