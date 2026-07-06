import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getMarketplaceDoctors } from "../api/marketplace.api";
import { DoctorMarketplaceCard } from "../components/DoctorMarketplaceCard";

const { Title, Text } = Typography;

export function MarketplaceDoctorsPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: [
      "marketplace-doctors",
      search,
      city,
      country,
      minPrice,
      maxPrice,
    ],
    queryFn: () =>
      getMarketplaceDoctors({
        search,
        city,
        country,
        minPrice: minPrice ?? undefined,
        maxPrice: maxPrice ?? undefined,
      }),
  });

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={2}>Encuentra doctores</Title>
          <Text type="secondary">
            Busca profesionales médicos publicados en HealthHub 360.
          </Text>
        </div>

        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Input
                placeholder="Buscar por nombre o descripción"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>

            <Col xs={24} md={4}>
              <Input
                placeholder="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Col>

            <Col xs={24} md={4}>
              <Input
                placeholder="País"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Col>

            <Col xs={12} md={3}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Precio min"
                value={minPrice}
                onChange={(value) => setMinPrice(value)}
              />
            </Col>

            <Col xs={12} md={3}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Precio max"
                value={maxPrice}
                onChange={(value) => setMaxPrice(value)}
              />
            </Col>

            <Col xs={24} md={2}>
              <Button block type="primary" onClick={() => refetch()}>
                Buscar
              </Button>
            </Col>
          </Row>
        </Card>

        {isError && (
          <Card>
            <Text type="danger">No se pudo cargar el marketplace.</Text>
          </Card>
        )}

        {!isLoading && data.length === 0 && !isError && (
          <Empty description="No se encontraron doctores publicados" />
        )}

        <Row gutter={[16, 16]}>
          {data.map((doctor) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={doctor.id}>
              <DoctorMarketplaceCard doctor={doctor} />
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
}