import { Avatar, Button, Card, Space, Tag, Typography } from "antd";
import { EnvironmentOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import type { MarketplaceClinic } from "../types/marketplace.types";

const { Title, Text } = Typography;

type Props = {
  clinic: MarketplaceClinic;
};

export function ClinicMarketplaceCard({ clinic }: Props) {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/marketplace/clinics/${clinic.slug}`);
  };

  return (
    <Card
      hoverable
      style={{
        height: "100%",
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Space align="center">
        <Avatar
          size={72}
          shape="square"
          src={clinic.profileImageUrl || undefined}
          icon={<ShopOutlined />}
        />

        <div>
          <Title
            level={5}
            style={{
              margin: 0,
            }}
          >
            {clinic.displayName}
          </Title>

          {clinic.headline && (
            <Text type="secondary">{clinic.headline}</Text>
          )}
        </div>
      </Space>

      <Space wrap>
        {clinic.city && (
          <Tag icon={<EnvironmentOutlined />}>
            {clinic.city}
          </Tag>
        )}

        {clinic.country && (
          <Tag color="blue">
            {clinic.country}
          </Tag>
        )}
      </Space>

      {clinic.address && (
        <Text type="secondary">{clinic.address}</Text>
      )}

      <Button type="primary" block onClick={goToProfile}>
        Ver clínica
      </Button>
    </Card>
  );
}
