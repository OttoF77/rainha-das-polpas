# ============================================================================
# Dockerfile - Frontend Next.js (Rainha das Polpas - Static Export)
# ============================================================================
# Build multi-stage para exportação estática Next.js servida via Nginx

# STAGE 1: BUILDER
FROM node:22-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Copia manifestos de dependências para aproveitar cache de camadas
COPY package.json package-lock.json ./

# Instala dependências no builder com cache mount (fallback para npm install se houver divergência de optionalDeps entre versões do npm)
RUN --mount=type=cache,target=/root/.npm sh -c 'npm ci || npm install --no-audit --no-fund'

# Garante que os binários nativos necessários para a plataforma Linux estão presentes
RUN npm install --no-save lightningcss-linux-arm64-gnu @tailwindcss/oxide-linux-arm64-gnu 2>/dev/null || \
    npm install --no-save lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu 2>/dev/null || true

# Copia o restante dos arquivos do projeto
COPY . .

ARG NEXT_PUBLIC_SITE_URL=http://localhost:3005
ARG NEXT_PUBLIC_BASE_PATH=""
ARG NEXT_PUBLIC_SITE_SLUG=rainhadaspolpas
ARG NEXT_PUBLIC_SYSOTTO_API_URL=/sysotto-api
ARG NEXT_PUBLIC_WHATSAPP_PHONE=5588997099082

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH \
    NEXT_PUBLIC_SITE_SLUG=$NEXT_PUBLIC_SITE_SLUG \
    NEXT_PUBLIC_SYSOTTO_API_URL=$NEXT_PUBLIC_SYSOTTO_API_URL \
    NEXT_PUBLIC_WHATSAPP_PHONE=$NEXT_PUBLIC_WHATSAPP_PHONE \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Gera a exportação estática em out/
RUN npm run build

# Prepara estrutura de arquivos e template Nginx respeitando NEXT_PUBLIC_BASE_PATH e proxy da API Sysotto
RUN node -e ' \
  const fs = require("node:fs"); \
  let basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim().replace(/\/+$/, ""); \
  if (basePath && !basePath.startsWith("/")) basePath = "/" + basePath; \
  const distDir = "/srv/dist" + basePath; \
  fs.mkdirSync(distDir, { recursive: true }); \
  fs.cpSync("out", distDir, { recursive: true }); \
  const prefix = basePath || ""; \
  const redirects = basePath \
    ? `\n    location = / {\n        return 302 ${basePath}/;\n    }\n\n    location = ${basePath} {\n        return 301 ${basePath}/;\n    }\n` \
    : ""; \
  const proxyBlock = `    location ~ ^/sysotto-api/(.*)$ {\n        resolver 127.0.0.11 valid=30s ipv6=off;\n        set $sysotto_upstream "\${SYSOTTO_API_UPSTREAM}";\n        proxy_pass $sysotto_upstream/$1$is_args$args;\n        proxy_http_version 1.1;\n        proxy_ssl_server_name on;\n        proxy_set_header Host $proxy_host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_set_header X-Forwarded-Host $http_host;\n        proxy_set_header X-Tenant-Id "";\n        proxy_connect_timeout 3s;\n        proxy_read_timeout 10s;\n    }\n`; \
  const conf = `server {\n    listen 3000;\n    server_name _;\n    absolute_redirect off;\n    root /usr/share/nginx/html;\n    index index.html;\n\n    gzip on;\n    gzip_types text/plain text/css application/javascript application/json image/svg+xml application/xml;\n\n    add_header X-Content-Type-Options "nosniff" always;\n    add_header X-Frame-Options "DENY" always;\n    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n\n    location = /healthz {\n        access_log off;\n        default_type text/plain;\n        return 200 "ok\\n";\n    }\n\n${proxyBlock}${redirects}\n    location ${prefix}/_next/static/ {\n        expires 1y;\n        try_files $uri =404;\n    }\n\n    location ${prefix}/images/ {\n        expires 1d;\n        try_files $uri =404;\n    }\n\n    location ${prefix}/ {\n        try_files $uri $uri/ $uri.html =404;\n    }\n\n    error_page 404 ${prefix}/404.html;\n}\n`; \
  fs.writeFileSync("/srv/default.conf.template", conf); \
'

# STAGE 2: RUNTIME
FROM nginx:1.27-alpine AS runner

ENV SYSOTTO_API_UPSTREAM=http://sysotto-backend:5036 \
    NGINX_ENVSUBST_FILTER=SYSOTTO_API_UPSTREAM

# Ajusta Nginx para executar como usuário não-root na porta 3000
RUN sed -i 's/^user[[:space:]]\+nginx;//' /etc/nginx/nginx.conf \
    && sed -i 's|/run/nginx.pid|/tmp/nginx.pid|g' /etc/nginx/nginx.conf \
    && mkdir -p /etc/nginx/templates \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /etc/nginx/templates /usr/share/nginx/html

COPY --from=builder --chown=nginx:nginx /srv/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder --chown=nginx:nginx /srv/dist /usr/share/nginx/html

USER nginx
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
