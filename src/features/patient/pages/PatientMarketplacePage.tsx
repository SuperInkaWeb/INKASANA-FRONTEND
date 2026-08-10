import { Empty, Input, Row, Col, Select, Space, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../../../shared/api/api";
import { ClinicMarketplaceCard } from "../../marketplace/components/ClinicMarketplaceCard";
import { getMarketplaceClinics } from "../../marketplace/api/marketplace.api";

const { Title, Text } = Typography;

type Specialty = {
  id: string;
  name: string;
};

export function PatientMarketplacePage() {
  const [clinicSearch, setClinicSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [specialty, setSpecialty] = useState<string | undefined>();

  const { data: clinics = [], isLoading: clinicsLoading } = useQuery({
    queryKey: ["patient-marketplace-clinics", clinicSearch],
    queryFn: () => getMarketplaceClinics({ search: clinicSearch }),
  });

  const { data: specialties = [] } = useQuery({
    queryKey: ["active-specialties"],
    queryFn: async () => {
      const { data } = await api.get<Specialty[]>("/api/platform/specialties/active");
      return data;
    },
  });

  return (
    <Space direction="vertical" size={32} style={{ width: "100%" }}>
      <div>
        <Title level={2}>Marketplace</Title>
        <Text type="secondary">
          Encuentra clínicas y, próximamente, profesionales de salud.
        </Text>
      </div>

      <section>
        <Title level={3}>Clínicas</Title>
        <Input.Search
          allowClear
          placeholder="Buscar clínica por nombre"
          value={clinicSearch}
          onChange={(event) => setClinicSearch(event.target.value)}
          style={{ maxWidth: 440, marginBottom: 20 }}
        />

        {!clinicsLoading && clinics.length === 0 ? (
          <Empty description="No se encontraron clínicas" />
        ) : (
          <Row gutter={[16, 16]}>
            {clinics.map((clinic) => (
              <Col xs={24} sm={12} lg={8} key={clinic.id}>
                <ClinicMarketplaceCard clinic={clinic} />
              </Col>
            ))}
          </Row>
        )}
      </section>

      <section>
        <Title level={3}>Doctores</Title>
        <Text type="secondary">
          La búsqueda estará lista para usar cuando se publiquen doctores en el marketplace.
        </Text>
        <Row gutter={[16, 16]} style={{ marginTop: 16, maxWidth: 720 }}>
          <Col xs={24} md={12}>
            <Input
              allowClear
              placeholder="Buscar doctor por nombre"
              value={doctorSearch}
              onChange={(event) => setDoctorSearch(event.target.value)}
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              allowClear
              placeholder="Filtrar por especialidad"
              value={specialty}
              onChange={setSpecialty}
              options={specialties.map((item) => ({ value: item.name, label: item.name }))}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
        <Empty
          description={
            doctorSearch || specialty
              ? "Aún no hay doctores disponibles con esos filtros"
              : "Próximamente podrás encontrar doctores aquí"
          }
          style={{ marginTop: 24 }}
        />
      </section>
    </Space>
  );
}
