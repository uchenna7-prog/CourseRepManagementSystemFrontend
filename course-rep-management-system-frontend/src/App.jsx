import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Activities from "./pages/Activities/Activities.jsx";
import ActivityRecords from "./pages/ActivityRecord/ActivityRecords.jsx";
import Coursemates from "./pages/Coursemates/Coursemates.jsx";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activityRecords"
          element={
            <ProtectedRoute>
              <ActivityRecords />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coursemates"
          element={
            <ProtectedRoute>
              <Coursemates />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
