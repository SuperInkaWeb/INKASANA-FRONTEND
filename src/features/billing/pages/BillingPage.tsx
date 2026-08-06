import {
  CheckCircleOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Col, Descriptions, Popconfirm, Result, Row, Space, Tag, Typography, message } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  cancelSubscription,
  createCheckoutSession,
  getBillingSummary,
} from "../api/billing.api";
import type { SubscriptionPlanCode } from "../types/billing.types";

const { Title, Text, Paragraph } = Typography;

const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Activa", color: "success" },
  TRIALING: { label: "En prueba", color: "processing" },
  PAST_DUE: { label: "Pago pendiente", color: "warning" },
  CANCELED: { label: "Cancelada", color: "default" },
  INCOMPLETE: { label: "Pago incompleto", color: "warning" },
  UNPAID: { label: "Sin pagar", color: "error" },
  NONE: { label: "Sin suscripción", color: "default" },
};

const plans: Array<{
  code: SubscriptionPlanCode;
  name: string;
  description: string;
  priceLabel: string;
  features: string[];
  featured?: boolean;
  free?: boolean;
}> = [
  {
    code: "STARTER",
    name: "Esencial",
    description: "Una base ordenada para administrar tu consultorio.",
    priceLabel: "Gratis",
    features: ["Agenda online", "Pacientes y citas", "Soporte inicial"],
    free: true,
  },
  {
    code: "PROFESSIONAL",
    name: "Profesional",
    description: "Para equipos clinicos que quieren operar con mayor capacidad.",
    priceLabel: "S/ 50 al mes",
    features: ["Todo lo esencial", "Gestion de equipo", "Agenda de clinica"],
    featured: true,
  },
  {
    code: "ENTERPRISE",
    name: "Vip",
    description: "Acompanamiento para organizaciones con requerimientos especiales.",
    priceLabel: "S/ 150 al mes",
    features: ["Todo lo profesional", "Configuracion a medida", "Soporte prioritario"],
  },
];

export function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const autoCheckoutStarted = useRef(false);
  const requestedPlan = searchParams.get("plan") as SubscriptionPlanCode | null;
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.code === requestedPlan) ?? plans[1],
    [requestedPlan]
  );
  const queryClient = useQueryClient();
  const summaryQuery = useQuery({ queryKey: ["billing-summary"], queryFn: getBillingSummary });
  const redirectTo = (url: string) => window.location.assign(url);
  const checkout = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => redirectTo(url),
    onError: () => message.error("No fue posible iniciar el checkout."),
  });
  const cancel = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      message.success("Se programó la cancelación de tu suscripción.");
      queryClient.invalidateQueries({ queryKey: ["billing-summary"] });
    },
    onError: () => message.error("No fue posible cancelar la suscripción."),
  });

  useEffect(() => {
    if (
      searchParams.get("checkout") === "1" &&
      !autoCheckoutStarted.current &&
      !checkout.isPending
    ) {
      autoCheckoutStarted.current = true;
      checkout.mutate(selectedPlan.code);
      setSearchParams({ plan: selectedPlan.code }, { replace: true });
    }
  }, [checkout, searchParams, selectedPlan.code, setSearchParams]);

  if (summaryQuery.isLoading) {
    return <Result icon={<LoadingOutlined />} title="Cargando facturación..." />;
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return <Result status="error" title="No se pudo cargar la facturación" subTitle="Inténtalo nuevamente en unos minutos." />;
  }

  const summary = summaryQuery.data;
  const state = statusLabels[summary.status] ?? statusLabels.NONE;
  const hasSubscription = !["NONE", "CANCELED"].includes(summary.status);
  const renewalDate = summary.currentPeriodEnd
    ? new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date(summary.currentPeriodEnd))
    : "-";

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={2}>Facturación y suscripción</Title>
        <Text type="secondary">Elige un plan y gestiona el pago de tu organización en un entorno seguro.</Text>
      </div>

      {summary.status === "PAST_DUE" && (
        <Alert type="warning" showIcon icon={<ExclamationCircleOutlined />} message="Hay un pago pendiente" description="Actualiza tu método de pago desde el portal para conservar el servicio activo." />
      )}

      <Card title="Estado de la suscripción" extra={<Tag color={state.color}>{state.label}</Tag>}>
        <Descriptions column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Plan">{summary.planName ?? "Sin plan contratado"}</Descriptions.Item>
          <Descriptions.Item label="Próxima renovación">{renewalDate}</Descriptions.Item>
          {summary.cancelAtPeriodEnd && <Descriptions.Item label="Cancelación" span={2}>La suscripción finalizará al término del período actual.</Descriptions.Item>}
        </Descriptions>
      </Card>

      {!hasSubscription && (
        <section aria-labelledby="plans-title">
          <Title id="plans-title" level={3}>Elige el plan de tu organización</Title>
          <Row gutter={[20, 20]}>
            {plans.map((plan) => (
              <Col xs={24} md={8} key={plan.code}>
                <article className={`subscription-plan${plan.featured ? " subscription-plan--featured" : ""}`}>
                  {plan.featured && <span className="subscription-plan__badge">RECOMENDADO</span>}
                  <Title level={4}>{plan.name}</Title>
                  <Paragraph>{plan.description}</Paragraph>
                  <div className="subscription-plan__price">{plan.priceLabel}</div>
                  <ul>
                    {plan.features.map((feature) => <li key={feature}><CheckCircleOutlined />{feature}</li>)}
                  </ul>
                  <Button
                    type={plan.featured ? "primary" : "default"}
                    icon={plan.free ? undefined : <CreditCardOutlined />}
                    loading={checkout.isPending && selectedPlan.code === plan.code}
                    disabled={plan.free}
                    onClick={() => !plan.free && checkout.mutate(plan.code)}
                    block
                  >
                    {plan.free ? "Ya tienes la versión gratis" : `Elegir ${plan.name}`}
                  </Button>
                </article>
              </Col>
            ))}
          </Row>
        </section>
      )}

      {hasSubscription && (
        <Card title="Gestionar pago" extra={<SafetyCertificateOutlined style={{ color: "#16803d" }} />}>
          <Space direction="vertical" size="middle">
            <Text>Si cancelas, tu suscripción seguirá activa hasta el final del período ya pagado.</Text>
            <Popconfirm
              title="¿Cancelar suscripción?"
              description="Seguirá activa hasta el final del período actual."
              okText="Sí, cancelar"
              cancelText="Volver"
              onConfirm={() => cancel.mutate()}
            >
              <Button danger icon={<CreditCardOutlined />} loading={cancel.isPending}>
                Cancelar suscripción
              </Button>
            </Popconfirm>
          </Space>
        </Card>
      )}
    </Space>
  );
}
