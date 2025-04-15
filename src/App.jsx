import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Listings from "./pages/Listings";
import LoginPage from "./pages/LoginPage";
import AddApplicantForm from "./pages/AddApplicantForm";
import PrivateRoute from "./context/PrivateRoute";
import PublicRoute from "./context/PublicRoute";
import FullOfSuite from "./pages/FullOfSuite";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ats" element={<PrivateRoute element={<Listings />} />}>
          <Route path="applicants/:id" element={null} /> {/* This is just a route marker */}
        </Route>
        <Route path="/add-applicant" element={<PrivateRoute element={<AddApplicantForm />} />} />
        <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/fullofsuite" element={<PublicRoute element={<FullOfSuite />} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;