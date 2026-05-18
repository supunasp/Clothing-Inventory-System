import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      {user && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/tasks" replace /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/tasks" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/tasks" replace /> : <Register />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={user ? <Navigate to="/tasks" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
