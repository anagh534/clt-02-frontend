import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import InvestorsList from "../pages/InvestorsList";
import InvestorDetails from "../pages/InvestorDetails";
import InvestorForm from "../pages/InvestorForm";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate replace to="investors" />} />
        
        {/* Investors Routes */}
        <Route path="investors" element={<InvestorsList />} />
        <Route path="investors/new" element={<InvestorForm />} />
        <Route path="investors/:id" element={<InvestorDetails />} />
        <Route path="investors/:id/edit" element={<InvestorForm />} />
        
        {/* Placeholder for other routes like Settings */}
        <Route path="settings" element={
          <div className="p-4 text-center mt-5">
            <h2 className="text-secondary fw-bold">Settings (Coming Soon)</h2>
            <p className="text-muted">This page is under construction.</p>
          </div>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
