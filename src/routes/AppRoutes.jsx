import { Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
  // useSessionExpiry();

  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Navigate replace to="/app/dashboard" />} />
        <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
        </Route>

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence> */}
    </>
  );
}

export default AppRoutes;
