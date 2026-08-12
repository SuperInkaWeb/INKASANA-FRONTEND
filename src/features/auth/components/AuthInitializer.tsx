import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { message } from "antd";

import { useAuthStore } from "../../../app/store/auth.store";
import { setAuthToken } from "../../../shared/api/api";
import { auth0TenantLogin } from "../api/auth.api";
import { patientPortalApi } from "../../patient/api/patient-portal.api";

type AuthInitializerProps = {
  children: React.ReactNode;
};

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { isAuthenticated, getAccessTokenSilently, isLoading, user } =
    useAuth0();

  const { setAuthData, logout, setSessionStatus } = useAuthStore();

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
        const existingScope = localStorage.getItem("scope");

        if (
          existingToken &&
          (existingSchema || existingScope === "PLATFORM")
        ) {
          setAuthToken(existingToken);
          setSessionStatus("ready");
          const postLoginPath = localStorage.getItem("post_login_path");
          localStorage.removeItem("post_login_path");
          if (postLoginPath?.startsWith("/") && !postLoginPath.startsWith("//")) {
            window.location.assign(postLoginPath);
          }
          return;
        }

        if (!user) {
          setSessionStatus("failed");
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

        const patientFlow = localStorage.getItem("auth_flow") === "PATIENT";
        const organizationSlug = localStorage.getItem("organization_slug");
        if (!patientFlow && !organizationSlug) {
          setSessionStatus("failed");
          return;
        }

        const session = patientFlow
          ? await patientPortalApi.login(auth0Token, email, auth0Id)
          : await auth0TenantLogin(organizationSlug!, auth0Token, email, auth0Id);

        setAuthToken(session.accessToken);

        setAuthData({
          token: session.accessToken,
          role: patientFlow ? "PATIENT" : session.user.role,
          roles: [patientFlow ? "PATIENT" : session.user.role],
          userId: session.user.id,
          orgId: session.organization?.id || null,
          schema: session.organization?.schemaName || null,
          scope: patientFlow ? "PLATFORM" : "TENANT",
        });
        setSessionStatus("ready");

        localStorage.removeItem("organization_slug");
        localStorage.removeItem("auth_flow");

        const postLoginPath = localStorage.getItem("post_login_path");
        localStorage.removeItem("post_login_path");

        if (postLoginPath?.startsWith("/") && !postLoginPath.startsWith("//")) {
          window.location.assign(postLoginPath);
        }
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
    setSessionStatus,
    user,
  ]);

  return <>{children}</>;
}
