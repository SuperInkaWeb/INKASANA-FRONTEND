export type BillingSubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "PAST_DUE"
  | "CANCELED"
  | "INCOMPLETE"
  | "UNPAID"
  | "NONE";

export interface BillingSummary {
  status: BillingSubscriptionStatus;
  planName: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export type SubscriptionPlanCode = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

export interface CheckoutSessionResponse {
  url: string;
}

export interface PaymentHistoryItem {
  id: string;
  purpose: string;
  invoiceNumber: string | null;
  amountCents: number;
  currency: string;
  status: string;
  paidAt: string | null;
}
