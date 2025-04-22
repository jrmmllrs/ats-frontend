import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./context/PrivateRoute";
import PublicRoute from "./context/PublicRoute";
import FullOfSuite from "./pages/FullOfSuite";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";


import MainLayout from "./layouts/MainLayout"; 
import Dashboard from "./pages/Dashboard";
import ApplicantListView from "./pages/ApplicantListView";
import AnalysisPage from "./pages/AnalysisPage";
import Jobs from "./pages/Jobs";
import Configurations from "./pages/Configurations";
import UserManagementPage from "./pages/UserManagementPage";

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
          <Route path="usermanagement" element={<UserManagementPage />} />
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