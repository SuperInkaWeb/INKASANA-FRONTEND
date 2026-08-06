import { useEffect, useState } from "react";
import { Alert, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { clinicProfileService } from "../services/clinic-profile.service";

export function MyMarketplaceRedirectPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    clinicProfileService
      .getMyClinicProfile()
      .then((profile) => navigate(`/marketplace/clinics/${profile.slug}`, { replace: true }))
      .catch(() => setError(true));
  }, [navigate]);

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      {error ? (
        <Alert
          type="warning"
          showIcon
          message="Tu clínica todavía no tiene un marketplace disponible."
          description="Configúralo desde Editar Marketplace o verifica que la organización esté activa."
        />
      ) : (
        <>
          <Spin size="large" />
          <p>Abriendo tu marketplace…</p>
        </>
      )}
    </div>
  );
}
