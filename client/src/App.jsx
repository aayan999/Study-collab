import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupList from './pages/GroupList';
import GroupDetail from './pages/GroupDetail';
import Landing from './pages/Landing';

// Layout wrapping the authenticated app portion
const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main App Routes (Protected) */}
          <Route path="/dashboard" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
          </Route>
          
          {/* Nested Group Routes */}
          <Route path="/groups" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index element={<GroupList />} />
            <Route path=":id" element={<GroupDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
