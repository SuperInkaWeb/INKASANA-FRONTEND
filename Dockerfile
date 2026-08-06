# --- Etapa 1: construir la aplicacion Vite ---
FROM node:22-alpine AS build
WORKDIR /app

# Se instala primero para aprovechar la cache de Docker.
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

# Vite incorpora estas variables en el bundle durante la compilacion.
ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ENV VITE_API_URL=$VITE_API_URL \
    VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE
RUN npm run build

# --- Etapa 2: servir los archivos estaticos con Nginx ---
FROM nginx:1.27-alpine

# Render y Railway definen PORT. Nginx procesa los archivos de templates al iniciar.
ENV PORT=8080
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
