import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { brandingService } from "../../branding/services/branding.service";

export function useOnboardingGuard(isAuthenticated: boolean) {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isAuthenticated) return;

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
  }, [isAuthenticated, location.pathname, navigate]);

  return { checking };
}