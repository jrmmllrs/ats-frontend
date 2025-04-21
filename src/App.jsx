// App.js - Main Routing File
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./context/PrivateRoute";
import PublicRoute from "./context/PublicRoute";
import FullOfSuite from "./pages/FullOfSuite";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

// Import all the main views that were previously inside Listings
import MainLayout from "./layouts/MainLayout"; // We'll create this wrapper component
import Dashboard from "./pages/Dashboard";
import ApplicantListView from "./pages/ApplicantListView"; // This will be a new component
import ApplicantDetailsPage from "./pages/ApplicantDetailsPage";
import AnalysisPage from "./pages/AnalysisPage";
import Jobs from "./pages/Jobs";
import Configurations from "./pages/Configurations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/fullofsuite" element={<PublicRoute element={<FullOfSuite />} />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Private Routes with MainLayout */}
        <Route path="/" element={<PrivateRoute element={<MainLayout />} />}>
          {/* Default route redirects to dashboard */}
          <Route index element={<Navigate to="/dashboard" />} />

          {/* Main views as separate routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="applicants" element={<ApplicantListView />} />
          <Route path="applicants/:id" element={<ApplicantListView />} />
          <Route path="analytics" element={<AnalysisPage />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="config" element={<Configurations />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;