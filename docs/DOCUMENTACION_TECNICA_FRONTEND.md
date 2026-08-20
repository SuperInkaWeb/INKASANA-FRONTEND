# Manual Técnico - INKASANA Frontend

Este documento describe la arquitectura técnica y las decisiones de implementación de la aplicación web de **INKASANA**. El frontend permite operar organizaciones de salud, administrar agenda y citas, acceder al marketplace público y utilizar el portal de paciente.

---

## 1. Arquitectura de la aplicación

### Framework y ejecución

La aplicación es una **SPA (Single Page Application)** desarrollada con React y TypeScript. Vite se utiliza para desarrollo, compilación y generación de los archivos estáticos que consume el navegador.

| Componente | Implementación | Responsabilidad |
| :--- | :--- | :--- |
| UI | React 19 + Ant Design 6 | Páginas, formularios, tablas, modales y layout. |
| Compilación | Vite 8 + TypeScript 6 | Desarrollo local, tipado y build. |
| Rutas | React Router DOM 7 | Navegación pública, privada y por rol. |
| Datos remotos | TanStack React Query 5 | Caché, queries, mutaciones e invalidación. |
| Estado de sesión | Zustand 5 | Token, usuario, roles, schema y scope. |
| HTTP | Axios | Cliente REST, bearer token e interceptores. |
| Identidad | Auth0 React SDK | Login y sincronización de sesión. |

### Organización por dominios

El código sigue una estructura **feature-first**. Cada módulo contiene sus páginas, tipos, componentes y servicios de API relacionados. Las piezas compartidas permanecen fuera de los módulos de negocio.

```text
src/
  app/          providers y store de autenticación
  routes/       router, guardas y redirecciones
  layouts/      AppLayout para zonas autenticadas
  shared/api/   instancia Axios común
  features/     módulos funcionales de la aplicación
```

Los módulos de `features` incluyen `auth`, `users`, `doctors`, `patients`, `agenda`, `appointments`, `marketplace`, `patient`, `billing`, `branding`, `onboarding`, `organizations`, `specialties` y `public-register`.

---

## 2. Estado, autenticación y datos

### Estado global con Zustand

`src/app/store/auth.store.ts` conserva el contexto de sesión: token, datos del usuario, roles, schema y scope. Los valores necesarios para reanudar la sesión se guardan en `localStorage`; al cerrar sesión o recibir una respuesta no autorizada se eliminan las credenciales persistidas.

### Datos remotos con React Query

React Query se utiliza para obtener y modificar recursos remotos. Las páginas usan `useQuery` para consultas y `useMutation` para operaciones de escritura. Después de una operación exitosa se invalida o actualiza la query correspondiente para reflejar los cambios sin recargar la página.

Este patrón se aplica, entre otros, a usuarios, doctores, pacientes, disponibilidad, slots, citas, especialidades y facturación.

### Autenticación y autorización

`AuthInitializer` restaura la sesión existente y decide el destino posterior al login. `AuthTokenSync` obtiene o sincroniza el token de Auth0 con el backend. Para pacientes se guarda temporalmente `auth_flow = PATIENT` y `post_login_path` para redirigir al portal correspondiente.

La protección de rutas se implementa con:

- `PrivateRoute`: exige una sesión autenticada.
- `RoleRoute`: limita rutas a roles autorizados.
- `HomeRedirect`: decide el destino inicial según la sesión y el rol.

La protección visual del navegador no reemplaza la autorización del backend: cada petición privada sigue siendo validada por la API mediante JWT, rol y tenant.

---

## 3. Comunicación con el backend

Todas las peticiones REST comparten la instancia definida en `src/shared/api/api.ts`.

- La URL base se obtiene desde `VITE_API_URL`; en desarrollo usa `http://localhost:8080` cuando no está definida.
- `setAuthToken` actualiza el header `Authorization: Bearer <token>`.
- Un interceptor agrega el token persistido a las solicitudes.
- Ante una respuesta `401`, el interceptor limpia `access_token` y los roles para evitar una sesión inválida.

Cada feature concentra sus operaciones HTTP en archivos `api` o `service`. Por ejemplo:

| Módulo | Servicio o API |
| :--- | :--- |
| Autenticación | `auth.api.ts`, `auth.service.ts` |
| Agenda y slots | `agenda.service.ts`, `slot.service.ts` |
| Citas | `appointment.service.ts` |
| Doctores | `doctor.service.ts` |
| Usuarios | `user.service.ts` |
| Marketplace | `marketplace.api.ts`, `clinic-profile.service.ts` |
| Paciente | `patient-portal.api.ts` |
| Facturación | `billing.api.ts` |

Las fotografías de doctor y las imágenes de perfil de clínica se envían como `multipart/form-data`, reutilizando el `baseURL` central y adjuntando el bearer token.

---

## 4. Rutas y áreas funcionales

### Rutas públicas

| Ruta | Función |
| :--- | :--- |
| `/` | Landing o redirección de inicio. |
| `/login` | Inicio de sesión de organización. |
| `/register-organization` | Registro público de organización. |
| `/access` y `/patient/login` | Acceso e inicio de sesión de paciente. |
| `/marketplace/doctors` | Listado público de médicos. |
| `/marketplace/doctors/:slug` | Ficha pública de un médico. |
| `/marketplace/clinics` | Listado público de clínicas. |
| `/marketplace/clinics/:slug` | Ficha pública de una clínica. |
| `/access-denied` | Pantalla de permiso insuficiente. |

### Rutas autenticadas

| Ruta o grupo | Función |
| :--- | :--- |
| `/dashboard` | Panel operativo actual. |
| `/onboarding`, `/branding`, `/profile` | Configuración inicial, identidad y perfil. |
| `/users`, `/specialties`, `/doctors` | Administración de usuarios, especialidades y doctores. |
| `/patients`, `/appointments`, `/agenda`, `/agenda-clinica` | Operación clínica, agenda y citas. |
| `/clinic-profile`, `/my-marketplace` | Perfil de la organización en marketplace. |
| `/billing` | Suscripción, pagos, checkout y cancelación. |
| `/patient/*` | Dashboard, citas, agenda, perfil y marketplace del paciente. |

---

## 5. Áreas funcionales

### Operación clínica

`DoctorsPage`, `DoctorProfilePage`, `PatientsPage` y `AppointmentsPage` gestionan la operación de la organización. Incluyen creación y edición de datos, cambios de estado, consultas, formularios y tablas. `DoctorAvailabilityManager` permite configurar disponibilidad recurrente y excepciones por médico.

### Marketplace y portal de paciente

El marketplace muestra perfiles públicos de doctores y clínicas. Las vistas de detalle consumen el backend para cargar información, especialidades, slots y el inicio de checkout de citas.

El portal de paciente incluye dashboard, perfil, citas, agenda y una vista de marketplace adaptada al usuario autenticado.

### Facturación y branding

`BillingPage` consulta el resumen de suscripción, el historial de pagos, inicia checkout y permite solicitar cancelación. `BrandingPage` administra la información visual de la organización.

---

## 6. Configuración y desarrollo

Las variables de entorno del frontend se incorporan durante el build. Por esta razón, las variables `VITE_*` no deben incluir secretos privados.

| Variable | Uso |
| :--- | :--- |
| `VITE_API_URL` | URL pública del backend. |
| `VITE_AUTH0_DOMAIN` | Dominio de Auth0. |
| `VITE_AUTH0_CLIENT_ID` | Cliente público de Auth0. |
| `VITE_AUTH0_AUDIENCE` | Audience utilizada para los tokens. |

Comandos habituales:

```powershell
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

---

## 7. Despliegue y validación

El frontend está desplegado en **Vercel**. La variable `VITE_API_URL` apunta al backend desplegado en Render, que utiliza Neon como base de datos de producción. Auth0 debe conservar las URLs de callback, logout y web origin del dominio final de Vercel; el backend debe tener ese dominio incluido en CORS.

Antes de una liberación se debe ejecutar `npm run lint` y `npm run build`. La validación funcional debe cubrir marketplace, login, restricciones por rol, agenda, citas, cargas de imagen y checkout.

---

## 8. Pendientes técnicos del frontend

Las siguientes capacidades no están implementadas y dependen de la API y permisos pendientes del backend:

- Dashboard de Super Admin con métricas, filtros y acciones de plataforma.
- Vistas de soporte para el rol `ADMIN`.
- Bandejas de aprobación, rechazo y bloqueo de clínicas, hospitales, doctores, pacientes y tenants.
- Dashboard de clínica u hospital para `ORG_ADMIN`.
- Menús, rutas y permisos visuales para `ASSISTANT` en agenda, citas y atención operativa.
- Pruebas de interfaz para `SUPER_ADMIN`, `ADMIN`, `ORG_ADMIN` y `ASSISTANT`, incluyendo staging.
- Visualización del estado de confirmaciones y recordatorios por WhatsApp y email.
- Sugerencia editable de especialidad y resumen de motivo de cita generado como asistencia para el médico.
- QA de producción en Vercel contra Render y Neon con cuentas controladas.
