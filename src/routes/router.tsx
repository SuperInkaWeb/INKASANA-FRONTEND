import { createBrowserRouter } from "react-router-dom";
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
import { MyAgendaPage } from "../features/agenda/pages/MyAgendaPage";
import { ClinicAgendaPage } from "../features/agenda/pages/ClinicAgendaPage";
import { BillingPage } from "../features/billing/pages/BillingPage";

import { MarketplaceDoctorsPage } from "../features/marketplace/pages/MarketplaceDoctorsPage";
import { MarketplaceDoctorDetailPage } from "../features/marketplace/pages/MarketplaceDoctorDetailPage";
import { MarketplaceClinicsPage } from "../features/marketplace/pages/MarketplaceClinicPage";
import { MarketplaceClinicDetailPage } from "../features/marketplace/pages/MarketplaceClinicsDetailPage";
import { ClinicMarketplaceProfilePage } from "../features/marketplace/pages/ClinicMarketplaceProfilePage";
import { MyMarketplaceRedirectPage } from "../features/marketplace/pages/MyMarketplaceRedirectPage";

import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { HomeRedirect } from "./HomeRedirect";
import { PatientAccessPage } from "../features/patient/pages/PatientAccessPage";
import { PatientLoginPage } from "../features/patient/pages/PatientLoginPage";
import { PatientDashboardPage } from "../features/patient/pages/PatientDashboardPage";
import { PatientAppointmentsPage } from "../features/patient/pages/PatientAppointmentsPage";
import { PatientAgendaPage } from "../features/patient/pages/PatientAgendaPage";
import { PatientProfilePage } from "../features/patient/pages/PatientProfilePage";

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
  { path: "/access", element: <PatientAccessPage /> },
  { path: "/patient/login", element: <PatientLoginPage /> },

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
    path: "/marketplace/clinics",
    element: <MarketplaceClinicsPage />,
  },
  {
    path: "/marketplace/clinics/:slug",
    element: <MarketplaceClinicDetailPage />,
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
            element: <HomeRedirect />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          { path: "patient/dashboard", element: <PatientDashboardPage /> },
          { path: "patient/appointments", element: <PatientAppointmentsPage /> },
          { path: "patient/agenda", element: <PatientAgendaPage /> },
          { path: "patient/profile", element: <PatientProfilePage /> },
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
              {
                path: "clinic-profile",
                element: <ClinicMarketplaceProfilePage />,
              },
              {
                path: "my-marketplace",
                element: <MyMarketplaceRedirectPage />,
              },
              {
                path: "agenda-clinica",
                element: <ClinicAgendaPage />,
              },
              {
                path: "billing",
                element: <BillingPage />,
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
          {
            element: <RoleRoute allowedRoles={["DOCTOR"]} />,
            children: [
              {
                path: "agenda",
                element: <MyAgendaPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
