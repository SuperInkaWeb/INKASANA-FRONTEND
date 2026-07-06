import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import { Auth0Provider } from "@auth0/auth0-react";

import { router } from "./routes/router";
import { QueryProvider } from "./app/providers/query-provider";
import { AuthInitializer } from "./features/auth/components/AuthInitializer";
import "./styles/global.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId || !audience) {
  throw new Error("Faltan variables de entorno de Auth0");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AuthInitializer>
        <ConfigProvider locale={esES}>
          <QueryProvider>
            <RouterProvider router={router} />
          </QueryProvider>
        </ConfigProvider>
      </AuthInitializer>
    </Auth0Provider>
  </React.StrictMode>
);