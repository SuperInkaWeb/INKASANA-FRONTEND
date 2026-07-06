import { Col, Row, Typography } from "antd";
import { OrganizationRegisterForm } from "../components/OrganizationRegisterForm";

const { Title, Paragraph } = Typography;

export function OrganizationRegisterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "48px 16px",
      }}
    >
      <Row justify="center">
        <Col xs={24} sm={22} md={16} lg={12} xl={10}>
          <Title level={2}>Registro de organización médica</Title>

          <Paragraph>
            Registra una clínica u hospital dentro de la plataforma. Al
            finalizar, el sistema creará el tenant, ejecutará las migraciones y
            generará el usuario OWNER inicial.
          </Paragraph>

          <OrganizationRegisterForm />
        </Col>
      </Row>
    </div>
  );
}