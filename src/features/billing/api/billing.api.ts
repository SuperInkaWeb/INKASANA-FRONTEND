import { api } from "../../../shared/api/api";
import type {
  BillingSummary,
  CheckoutSessionResponse,
  SubscriptionPlanCode,
} from "../types/billing.types";

export async function getBillingSummary(): Promise<BillingSummary> {
  const { data } = await api.get<BillingSummary>("/api/billing/subscription");
  return data;
}

export async function createCheckoutSession(
  planCode: SubscriptionPlanCode
): Promise<CheckoutSessionResponse> {
  const { data } = await api.post<CheckoutSessionResponse>(
    "/api/billing/checkout-session",
    { planCode }
  );
  return data;
}

// Mercado Pago no tiene un portal de cliente como Stripe.
// En su lugar exponemos un endpoint propio que cancela la suscripción activa.
export async function cancelSubscription(): Promise<BillingSummary> {
  const { data } = await api.post<BillingSummary>("/api/billing/subscription/cancel");
  return data;
}
