import { useState } from "react"
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  DatePicker,
  message,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs"
import { createMarketplaceAppointmentCheckout, getMarketplaceDoctor, getMarketplaceDoctorSlots } from "../api/marketplace.api";

const { Title, Text, Paragraph } = Typography;

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export function MarketplaceDoctorDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const {
    data: doctor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["marketplace-doctor", slug],
    queryFn: () => getMarketplaceDoctor(slug!),
    enabled: !!slug,
  });
  // AGREGAR ESTA QUERY PARA LOS SLOTS:
  const { data: slotsData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["marketplace-doctor-slots", doctor?.doctorId, selectedDate],
    queryFn: () => getMarketplaceDoctorSlots(doctor!.doctorId!, selectedDate),
    enabled: !!doctor?.doctorId && !!selectedDate,
  });
  // AGREGAR ESTA FUNCIÓN MANEJADORA:
  const handleSelectSlot = (time: string) => {
    setSelectedSlot(time);
    const formattedTime = time.substring(0, 5);
    message.success(`Has seleccionado el horario de las ${formattedTime} del día ${selectedDate}.`);
  };
  const appointmentCheckout = useMutation({
    mutationFn: () => {
      if (!doctor?.doctorId || !slug || !selectedSlot) {
        throw new Error("Selecciona una fecha y un horario antes de continuar.");
      }
      return createMarketplaceAppointmentCheckout(slug, {
        doctorId: doctor.doctorId,
        date: selectedDate,
        time: selectedSlot,
      });
    },
    onSuccess: ({ url }) => window.location.assign(url),
    onError: (error: Error) => message.error(error.message || "No se pudo iniciar el pago de la cita."),
  });
  const handleAppointmentCheckout = () => {
    if (!selectedSlot) {
      message.warning("Selecciona primero una fecha y un horario disponible.");
      return;
    }
    appointmentCheckout.mutate();
  };

  const goBackToList = () => {
    // Si llegamos acá navegando dentro de la app (desde el listado general
    // de doctores o desde el detalle de una clínica), "location.key" no es
    // "default" y podemos volver exactamente a esa página anterior con
    // navigate(-1). Si se entró directo por URL (sin historial previo en
    // la app), no hay a dónde volver: mandamos al listado general.
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/marketplace/doctors");
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No se pudo cargar el perfil del doctor" />
        <Button onClick={goBackToList}>Volver al listado</Button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="Doctor no encontrado" />
        <Button onClick={goBackToList}>Volver al listado</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Card>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={4}>
              <Avatar
                size={120}
                src={doctor.profileImageUrl || undefined}
                icon={<UserOutlined />}
              />
            </Col>

            <Col xs={24} md={14}>
              <Title level={2} style={{ marginBottom: 4 }}>
                {doctor.displayName}
              </Title>

              {doctor.headline && (
                <Tag color="green">Especialidad: {doctor.headline}</Tag>
              )}

              <br />

              <Space wrap style={{ marginTop: 16 }}>
                {doctor.city && (
                  <Text>
                    <EnvironmentOutlined /> {doctor.city}
                  </Text>
                )}

                {doctor.country && <Text>{doctor.country}</Text>}
              </Space>
            </Col>

            <Col xs={24} md={6}>
              <Card>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {doctor.consultationPrice !== null &&
                    doctor.consultationPrice !== undefined && (
                      <Title level={3} style={{ margin: 0 }}>
                        S/ {doctor.consultationPrice}
                      </Title>
                    )}

                  {doctor.consultationDurationMinutes && (
                    <Text type="secondary">
                      Duración: {doctor.consultationDurationMinutes} minutos
                    </Text>
                  )}

                  <Button type="primary" block icon={<CalendarOutlined />} loading={appointmentCheckout.isPending} onClick={handleAppointmentCheckout}>
                    Agendar y pagar cita
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Sobre el doctor">
              {doctor.description ? (
                <Paragraph>{doctor.description}</Paragraph>
              ) : (
                <Text type="secondary">
                  Este doctor aún no ha agregado una descripción pública.
                </Text>
              )}
            </Card>
            <Card title="Horarios Disponibles" style={{ marginTop: 24 }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Text type="secondary">Selecciona una fecha para ver los turnos libres:</Text>
              <DatePicker
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(date) => {
                  if (date) {
                    setSelectedDate(date.format("YYYY-MM-DD"));
                    setSelectedSlot(null); // Resetear slot anterior
                  }
                }}
                disabledDate={(current) => {
                  // Solo permitir turnos desde hoy hasta 30 días en el futuro
                  return current && (current < dayjs().startOf("day") || current > dayjs().add(30, "day"));
                }}
                style={{ width: 250 }}
                allowClear={false}
              />
              {isLoadingSlots && <Skeleton active paragraph={{ rows: 2 }} />}
              {!isLoadingSlots && slotsData && slotsData.length > 0 && (
                <div>
                  {slotsData.map((day) => {
                    const isDayEmpty = !day.slots || day.slots.length === 0;
                    if (isDayEmpty) {
                      return (
                        <Empty
                          key={day.date}
                          description="No hay horarios de atención disponibles para este día."
                          style={{ margin: "20px 0" }}
                        />
                      );
                    }
                    return (
                      <div key={day.date}>
                        <Row gutter={[12, 12]}>
                          {day.slots.map((slot) => {
                            const timeString = slot.startTime.substring(0, 5); // Formato HH:mm
                            return (
                              <Col key={slot.startTime} xs={12} sm={8} md={6}>
                                <Button
                                  type={selectedSlot === slot.startTime ? "primary" : "default"}
                                  disabled={!slot.available}
                                  block
                                  onClick={() => handleSelectSlot(slot.startTime)}
                                >
                                  {timeString}
                                </Button>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    );
                  })}
                </div>
              )}
              {!isLoadingSlots && (!slotsData || slotsData.length === 0) && (
                <Empty description="Selecciona una fecha para ver disponibilidad." />
              )}
            </Space>
          </Card>
          {/* ============================================================ */}
        </Col>

          <Col xs={24} lg={8}>
            <Card title="Información de atención">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Especialidad">
                  {doctor.headline || "No definida"}
                </Descriptions.Item>

                <Descriptions.Item label="Ciudad">
                  {doctor.city || "No definida"}
                </Descriptions.Item>

                <Descriptions.Item label="País">
                  {doctor.country || "No definido"}
                </Descriptions.Item>

                <Descriptions.Item label="Dirección">
                  {doctor.address || "No definida"}
                </Descriptions.Item>

                <Descriptions.Item label="Precio">
                  {doctor.consultationPrice !== null &&
                  doctor.consultationPrice !== undefined
                    ? `S/ ${doctor.consultationPrice}`
                    : "No definido"}
                </Descriptions.Item>

                <Descriptions.Item label="Duración">
                  {doctor.consultationDurationMinutes
                    ? `${doctor.consultationDurationMinutes} minutos`
                    : "No definida"}
                </Descriptions.Item>

                <Descriptions.Item label="Días disponibles">
                  {doctor.availableDays && doctor.availableDays.length > 0 ? (
                    <Space wrap size={4}>
                      {doctor.availableDays.map((day) => (
                        <Tag key={day} color="purple">
                          {DAY_LABELS[day] ?? day}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    "No definidos"
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Horario">
                  {doctor.availableStartTime && doctor.availableEndTime
                    ? `${doctor.availableStartTime} - ${doctor.availableEndTime}`
                    : "No definido"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Button onClick={goBackToList}>Volver al listado</Button>
      </Space>
    </div>
  );
}
