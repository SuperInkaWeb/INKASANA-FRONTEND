import { brandingService } from "../../branding/services/branding.service";
import type { TenantBrandingRequest } from "../../branding/services/branding.service";

export type OnboardingBrandingPayload = TenantBrandingRequest;

export const onboardingService = {
  saveBrandingStep: async (payload: OnboardingBrandingPayload) => {
    return brandingService.saveBranding({
      ...payload,
      onboardingCompleted: false,
    });
  },

  completeOnboarding: async (payload: OnboardingBrandingPayload) => {
    return brandingService.saveBranding({
      ...payload,
      onboardingCompleted: true,
    });
  },
};