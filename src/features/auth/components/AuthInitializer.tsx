import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { message } from "antd";

import { useAuthStore } from "../../../app/store/auth.store";
import { setAuthToken } from "../../../shared/api/api";
import { auth0TenantLogin } from "../api/auth.api";

type AuthInitializerProps = {
  children: React.ReactNode;
};

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { isAuthenticated, getAccessTokenSilently, isLoading, user } =
    useAuth0();

  const { setAuthData, logout } = useAuthStore();

  useEffect(() => {
    const loadSession = async () => {
      try {
        if (isLoading) {
          return;
        }

        if (!isAuthenticated) {
          setAuthToken(null);
          logout();
          return;
        }

        const existingToken = localStorage.getItem("access_token");
        const existingSchema = localStorage.getItem("schema");

        if (existingToken && existingSchema) {
          setAuthToken(existingToken);
          return;
        }

        const organizationSlug = localStorage.getItem("organization_slug");

        if (!organizationSlug) {
          return;
        }

        if (!user) {
          return;
        }

        const email = user.email;
        const auth0Id = user.sub;

        if (!email) {
          throw new Error("No se pudo obtener el email desde Auth0");
        }

        if (!auth0Id) {
          throw new Error("No se pudo obtener el auth0Id desde Auth0");
        }

        const auth0Token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        });

        const session = await auth0TenantLogin(
          organizationSlug,
          auth0Token,
          email,
          auth0Id
        );

        setAuthToken(session.accessToken);

        setAuthData({
          token: session.accessToken,
          role: session.user.role,
          roles: [session.user.role],
          userId: session.user.id,
          orgId: session.organization.id,
          schema: session.organization.schemaName,
          scope: "TENANT",
        });

        localStorage.removeItem("organization_slug");
      } catch (error: any) {
        console.error("Error inicializando sesión:", error);

        message.error(
          error?.response?.data?.message || "No se pudo inicializar la sesión"
        );

        setAuthToken(null);
        logout();
      }
    };

    loadSession();
  }, [
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    setAuthData,
    logout,
    user,
  ]);

  return <>{children}</>;
}