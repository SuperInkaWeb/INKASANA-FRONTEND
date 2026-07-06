import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { message } from "antd";

import { setAuthToken } from "../../../shared/api/api";
import { useAuthStore } from "../../../app/store/auth.store";
import { auth0TenantLogin } from "../api/auth.api";

export function AuthTokenSync() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  const { setAuthData, logout } = useAuthStore();

  useEffect(() => {
    const syncToken = async () => {
      try {
        if (!isAuthenticated) {
          setAuthToken(null);
          logout();
          return;
        }

        const organizationSlug = localStorage.getItem("organization_slug");

        if (!organizationSlug) {
          message.warning("No se encontró el slug de la organización.");
          setAuthToken(null);
          logout();
          return;
        }

        const auth0Token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email",
          },
        });

        const email = user?.email;
        const auth0Id = user?.sub;

        if (!email) {
          throw new Error("No se pudo obtener el email desde Auth0");
        }

        if (!auth0Id) {
          throw new Error("No se pudo obtener el auth0Id desde Auth0");
        }

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
        console.error("Error sincronizando Auth0 con JWT interno:", error);

        message.error(
          error?.response?.data?.message ||
            "No se pudo iniciar sesión en la organización"
        );

        setAuthToken(null);
        logout();
      }
    };

    syncToken();
  }, [
    isAuthenticated,
    getAccessTokenSilently,
    user,
    setAuthData,
    logout,
  ]);

  return null;
}