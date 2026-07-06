import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="Acceso denegado"
      subTitle="No tienes permisos para acceder a esta sección."
      extra={
        <Button type="primary" onClick={() => navigate("/dashboard")}>
          Volver al dashboard
        </Button>
      }
    />
  );
}