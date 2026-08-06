import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { brandingService } from "../../branding/services/branding.service";
import { useAuthStore } from "../../../app/store/auth.store";

export function useOnboardingGuard(isAuthenticated: boolean) {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(false);
  const { role, roles, scope } = useAuthStore();
  const isPatient = role === "PATIENT" || roles.includes("PATIENT");

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated || isPatient || scope !== "TENANT") return;

      if (location.pathname === "/onboarding") return;
      if (location.pathname === "/login") return;
      if (location.pathname === "/register-organization") return;

      try {
        setChecking(true);

        const branding = await brandingService.getBranding();

        if (!branding.onboardingCompleted) {
          navigate("/onboarding", { replace: true });
        }
      } catch (error) {
        console.error("Error verificando onboarding:", error);
      } finally {
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, isPatient, scope, location.pathname, navigate]);

  return { checking };
}
