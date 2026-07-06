import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, type UserRole } from "../app/store/auth.store";

type RoleRouteProps = {
  allowedRoles: UserRole[];
};

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { roles } = useAuthStore();

  const hasPermission = roles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}