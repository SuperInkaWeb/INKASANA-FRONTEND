import { Alert, Card, Empty, Space, Spin, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "../../../app/store/auth.store";
import { doctorService } from "../../doctors/services/doctor.service";
import { DoctorAvailabilityManager } from "../components/DoctorAvailabilityManager";

const { Title, Text } = Typography;

export function MyAgendaPage() {
  const { userId } = useAuthStore();

  // El doctor no tiene un endpoint "/me" propio: se busca su registro de
  // doctor dentro del listado del tenant filtrando por tenantUserId, que es
  // el mismo id que guarda el store de auth al iniciar sesión.
  const doctorsQuery = useQuery({
    queryKey: ["doctors", "for-current-user"],
    queryFn: () => doctorService.findAll(),
  });

  const myDoctor = doctorsQuery.data?.find(
    (doctor) => doctor.tenantUserId === userId
  );

  if (doctorsQuery.isLoading) {
    return (
      <Card>
        <Spin />
      </Card>
    );
  }

  if (doctorsQuery.isError) {
    return (
      <Alert
        type="error"
        message="No se pudo cargar tu información de doctor"
        showIcon
      />
    );
  }

  if (!myDoctor) {
    return (
      <Card>
        <Empty description="Tu usuario no tiene un perfil de doctor asociado. Contacta a un administrador de la clínica." />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Mi agenda
        </Title>
        <Space>
          <Text type="secondary">{myDoctor.fullName}</Text>
          {myDoctor.specialties?.map((specialty) => (
            <Tag key={specialty.id} color="blue">
              {specialty.name}
            </Tag>
          ))}
        </Space>
      </div>

      <DoctorAvailabilityManager doctorId={myDoctor.id} canEdit />
    </Space>
  );
}
