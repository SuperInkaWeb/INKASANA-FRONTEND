import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useOnboardingGuard } from "../features/onboarding/hooks/useOnboardingGuard";
import { useAuthStore } from "../app/store/auth.store";

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth0();
  const {
    isAuthenticated: hasInternalSession,
    sessionStatus,
  } = useAuthStore();

  const { checking } = useOnboardingGuard(isAuthenticated);

  if (isLoading || (isAuthenticated && sessionStatus === "checking") || checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || !hasInternalSession) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
