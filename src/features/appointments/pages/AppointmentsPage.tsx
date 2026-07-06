import { Card, Empty, Typography } from "antd";

const { Title, Text } = Typography;

export function AppointmentsPage() {
  return (
    <>
      <Title level={2}>Citas</Title>
      <Text>Gestión de citas médicas y agendamientos.</Text>

      <Card style={{ marginTop: 24 }}>
        <Empty description="Todavía no hay citas registradas" />
      </Card>
    </>
  );
}