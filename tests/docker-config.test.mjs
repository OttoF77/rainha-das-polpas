import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

test("Infraestrutura Docker local (Dockerfile, Compose, .dockerignore e run-docker.sh)", () => {
  const dockerfilePath = path.join(rootDir, "Dockerfile");
  const dockerignorePath = path.join(rootDir, ".dockerignore");
  const composePath = path.join(rootDir, "docker-compose.yml");
  const scriptPath = path.join(rootDir, "run-docker.sh");

  assert.ok(fs.existsSync(dockerfilePath), "Dockerfile deve existir");
  assert.ok(fs.existsSync(dockerignorePath), ".dockerignore deve existir");
  assert.ok(fs.existsSync(composePath), "docker-compose.yml deve existir");
  assert.ok(fs.existsSync(scriptPath), "run-docker.sh deve existir");

  const dockerfile = fs.readFileSync(dockerfilePath, "utf-8");
  assert.ok(dockerfile.includes("FROM node:22-slim AS builder"), "Dockerfile deve usar multi-stage com node:22-slim");
  assert.ok(dockerfile.includes("AS runner"), "Dockerfile deve possuir stage runner");
  assert.ok(dockerfile.includes("USER nginx"), "Dockerfile deve rodar em usuário não-root");
  assert.ok(dockerfile.includes("EXPOSE 3000"), "Dockerfile deve expor porta 3000");
  assert.ok(dockerfile.includes("absolute_redirect off"), "Nginx deve preservar host/porta em redirecionamentos");
  assert.ok(dockerfile.includes("/sysotto-api/"), "Nginx deve expor proxy reverso /sysotto-api/ para API Sysotto");
  assert.ok(dockerfile.includes('proxy_set_header X-Tenant-Id ""'), "Proxy Nginx deve suprimir X-Tenant-Id");

  const compose = fs.readFileSync(composePath, "utf-8");
  assert.ok(compose.includes("rainha-das-polpas-web"), "Compose deve declarar serviço rainha-das-polpas-web");
  assert.ok(compose.includes("FRONTEND_PORT:-3005"), "Compose deve suportar FRONTEND_PORT com fallback 3005");
  assert.ok(compose.includes("NEXT_PUBLIC_SITE_URL"), "Compose deve suportar NEXT_PUBLIC_SITE_URL");
  assert.ok(compose.includes("NEXT_PUBLIC_BASE_PATH"), "Compose deve suportar NEXT_PUBLIC_BASE_PATH");
  assert.ok(compose.includes("NEXT_PUBLIC_SITE_SLUG"), "Compose deve suportar NEXT_PUBLIC_SITE_SLUG");
  assert.ok(compose.includes("NEXT_PUBLIC_SYSOTTO_API_URL"), "Compose deve suportar NEXT_PUBLIC_SYSOTTO_API_URL");
  assert.ok(compose.includes("NEXT_PUBLIC_WHATSAPP_PHONE"), "Compose deve suportar NEXT_PUBLIC_WHATSAPP_PHONE");
  assert.ok(compose.includes("SYSOTTO_API_UPSTREAM"), "Compose deve configurar SYSOTTO_API_UPSTREAM");
  assert.ok(compose.includes("SYSOTTO_DOCKER_NETWORK:-sysotto_sysotto-network"), "Compose deve conectar na rede externa sysotto_sysotto-network");
  assert.ok(compose.includes("external: true"), "Rede Sysotto deve ser declarada como external: true");

  const standaloneComposePath = path.join(rootDir, "docker-compose.standalone.yml");
  assert.ok(fs.existsSync(standaloneComposePath), "docker-compose.standalone.yml deve existir");

  const scriptStat = fs.statSync(scriptPath);
  assert.ok((scriptStat.mode & 0o111) !== 0, "run-docker.sh deve possuir permissão de execução");

  const script = fs.readFileSync(scriptPath, "utf-8");
  assert.ok(script.startsWith("#!/usr/bin/env bash"), "run-docker.sh deve usar #!/usr/bin/env bash");
  assert.ok(script.includes("set -Eeuo pipefail"), "run-docker.sh deve usar set -Eeuo pipefail");
  assert.ok(script.includes("docker compose"), "run-docker.sh deve usar docker compose v2");
  assert.ok(script.includes("--standalone"), "run-docker.sh deve suportar modo --standalone");
});
