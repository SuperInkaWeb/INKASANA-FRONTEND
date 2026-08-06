# INKASANA Frontend

## Despliegue con Docker

El `Dockerfile` construye el frontend con Vite y lo sirve mediante Nginx. Es
compatible con Render y Railway: el contenedor escucha el puerto que la
plataforma entregue mediante `PORT` (8080 si no se define).

Las variables `VITE_*` se integran en el JavaScript durante la construccion,
por lo que deben configurarse como **build arguments**, no solo como variables
de ejecucion. Usa estos cuatro argumentos en tu plataforma:

- `VITE_API_URL`: URL publica del backend, por ejemplo `https://api.ejemplo.com`
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`

Ejemplo de prueba local:

```powershell
docker build -t inkasana-frontend `
  --build-arg VITE_API_URL=https://api.ejemplo.com `
  --build-arg VITE_AUTH0_DOMAIN=tu-dominio.us.auth0.com `
  --build-arg VITE_AUTH0_CLIENT_ID=tu-client-id `
  --build-arg VITE_AUTH0_AUDIENCE=https://api.ejemplo.com .
docker run --rm -p 8080:8080 inkasana-frontend
```

Antes de publicar, actualiza en el backend `FRONTEND_URL` y `ALLOWED_ORIGINS`
con la URL final del frontend, y agregala tambien a las URLs permitidas de
Auth0 (callback, logout y web origins).

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
