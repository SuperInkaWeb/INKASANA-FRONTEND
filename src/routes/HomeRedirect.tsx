import { Navigate } from "react-router-dom";
import { useAuthStore } from "../app/store/auth.store";

export function HomeRedirect() {
  const { role, roles } = useAuthStore();
  return <Navigate to={role === "PATIENT" || roles.includes("PATIENT") ? "/patient/dashboard" : "/dashboard"} replace />;
}
