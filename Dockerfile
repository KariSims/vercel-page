# ---- Build stage ---------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

# Public web3forms access key — must be present at build time since Vite
# inlines VITE_* vars into the JS bundle (no server left to hold a secret).
# Passed in by docker-compose.yml (build.args), sourced from .env.
ARG VITE_WEB3FORMS_ACCESS_KEY
ENV VITE_WEB3FORMS_ACCESS_KEY=$VITE_WEB3FORMS_ACCESS_KEY

# Install dependencies first so this layer is cached as long as the
# lockfile doesn't change (much faster rebuilds when only src/ changes).
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage --------------------------------------------------------
# Static site: no Node runtime needed to serve it, nginx is enough and keeps
# the final image small (~40 MB vs. several hundred MB with a Node base).
FROM nginx:1.27-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
