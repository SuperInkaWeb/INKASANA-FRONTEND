import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { ProfilePage } from "../features/auth/pages/ProfilePage";

import { DashboardPage } from "../features/admin/pages/DashboardPage";
import { DoctorsPage } from "../features/doctors/pages/DoctorsPage";
import { DoctorProfilePage } from "../features/doctors/pages/DoctorProfilePage";
import { PatientsPage } from "../features/patients/pages/PatientsPage";
import { AppointmentsPage } from "../features/appointments/pages/AppointmentsPage";
import { OrganizationRegisterPage } from "../features/organizations/pages/OrganizationRegisterPage";
import { BrandingPage } from "../features/branding/pages/BrandingPage";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";
import { UsersPage } from "../features/users/pages/UsersPage";
import { SpecialtiesPage } from "../features/specialties/pages/SpecialtiesPage";

import { MarketplaceDoctorsPage } from "../features/marketplace/pages/MarketplaceDoctorsPage";
import { MarketplaceDoctorDetailPage } from "../features/marketplace/pages/MarketplaceDoctorDetailPage";

import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register-organization",
    element: <OrganizationRegisterPage />,
  },
  {
    path: "/access-denied",
    element: <AccessDeniedPage />,
  },

  // Marketplace público
  {
    path: "/marketplace/doctors",
    element: <MarketplaceDoctorsPage />,
  },
  {
    path: "/marketplace/doctors/:slug",
    element: <MarketplaceDoctorDetailPage />,
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "onboarding",
            element: <OnboardingPage />,
          },
          {
            path: "branding",
            element: <BrandingPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            element: <RoleRoute allowedRoles={["OWNER", "ADMIN"]} />,
            children: [
              {
                path: "users",
                element: <UsersPage />,
              },
              {
                path: "specialties",
                element: <SpecialtiesPage />,
              },
              {
                path: "doctors",
                element: <DoctorsPage />,
              },
              {
                path: "doctors/:id",
                element: <DoctorProfilePage />,
              },
            ],
          },
          {
            element: (
              <RoleRoute
                allowedRoles={[
                  "OWNER",
                  "ADMIN",
                  "DOCTOR",
                  "THERAPIST",
                  "RECEPTIONIST",
                ]}
              />
            ),
            children: [
              {
                path: "patients",
                element: <PatientsPage />,
              },
              {
                path: "appointments",
                element: <AppointmentsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);