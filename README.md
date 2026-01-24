# 🚀 cf-proxy-relay

Un **Cloudflare Worker seguro, ligero y extensible** que actúa como un **proxy relay** para realizar solicitudes HTTP hacia servicios externos.

Incluye autenticación mediante API Key, control de CORS, validación estricta de entrada y manejo centralizado de errores.

Este proyecto fue creado para **evitar los bloqueos producidos por el propio servicio de Cloudflare (Bot Challenge / bot detection)** cuando se necesitan realizar solicitudes desde entornos que Cloudflare identifica como automatizados.

---

## ✨ Características

- **CORS Automático**
  Manejo nativo de solicitudes `OPTIONS` y cabeceras configurables.

- **Autenticación por API Key**
  Requiere el header `X-API-Key` para todas las solicitudes.

- **Validación de Entrada**
  - URL válida (`http` o `https`)
  - Métodos permitidos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`

- **Proxy Seguro**
  Reenvía headers, método, cuerpo y timeout personalizados.

- **Timeout y AbortController**
  Control de solicitudes lentas o colgadas.

- **Errores Estructurados**
  Respuestas JSON claras y consistentes para depuración y consumo por APIs.

- **Infraestructura como Código**
  Despliegue automatizado con Terraform.

---

## 📦 Instalación

1. Clonar el repositorio:

``` bash
git clone <repository-url>
cd cf-proxy-relay
```

2. Instalar dependencias:

``` bash
pnpm install
```

---

## ⚙️ Configuración

### 1. Configurar Terraform:

``` bash
# Copiar archivo de ejemplo
cp terraform.tfvars.example terraform.tfvars

# Editar con tus credenciales
nano terraform.tfvars
```

### 2. Obtener Credenciales de Cloudflare:

**API Token:**
1. Ve a https://dash.cloudflare.com/profile/api-tokens
2. Click en "Create Token"
3. Usa la plantilla "Edit Cloudflare Workers"
4. Copia el token generado

**Account ID:**
1. Ve a https://dash.cloudflare.com
2. Selecciona cualquier sitio
3. En la barra lateral derecha, verás tu "Account ID"

### 3. Llenar `terraform.tfvars`:

``` hcl
cloudflare_api_token  = "your-cloudflare-api-token"
cloudflare_account_id = "your-cloudflare-account-id"
worker_name           = "your-worker-name"
api_key               = "your-api-key-securely-32-characters-min"
```

---

## 🚀 Despliegue

### Desarrollo Local

``` bash
pnpm dev
```

### Deploy a Producción (con Terraform)

``` bash
# Opción 1: Usando npm scripts
pnpm run tf:init
pnpm run deploy

# Opción 2: Manual
pnpm run build
terraform init
terraform plan
terraform apply
```

### Comandos Terraform Disponibles

``` bash
pnpm run tf:init      # Inicializar Terraform
pnpm run tf:plan      # Ver plan de despliegue
pnpm run tf:deploy    # Desplegar a Cloudflare
pnpm run tf:destroy   # Eliminar el Worker
```

---

## 📡 Uso del API

**Endpoint**
``` nginx
POST https://cf-proxy-relay.<account-id>.workers.dev
```

**Headers Requeridos**

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `X-API-Key` | Tu `API_KEY` configurada |

---

🔄 Cuerpo de la Solicitud

``` jsonc
{
    "url": "https://api.example.com/data",
    "method": "POST",
    "headers": {
        "Authorization": "Bearer token"
    },
    "body": {
        "some": "data"
    },
    "timeout": 5000
}
```

**Parámetros**

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `url` | String | Sí | URL destino (http/https). |
| `method` | String | No | Método HTTP (default: `GET`). |
| `headers` | Object | No | Cabeceras adicionales a enviar. |
| `body` | Object | No | Se serializa automáticamente a JSON. |
| `timeout` | Number | No | Tiempo de espera en milisegundos (default: `30000`).

---

## 🧪 Ejemplo cURL

``` bash
curl -X POST https://your-worker.workers.dev \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your-secure-api-key" \
    -d '{
        "url": "https://jsonplaceholder.typicode.com/posts",
        "method": "POST",
        "headers": {
            "User-Agent": "cf-proxy-relay"
        },
        "body": {
            "title": "foo",
            "body": "bar",
            "userId": 1
        }
    }'
```

---

## 🔐 Seguridad Importante

Este Worker actúa como un open proxy autenticado, por lo que se recomienda:

- Usar API Keys largas y seguras (32+ chars)

- Implementar allowlist de dominios destino

- Limitar tamaño máximo del body

- Agregar rate limiting vía Cloudflare Rules o Turnstile

- Nunca commitear `terraform.tfvars` (está en `.gitignore`)

---

## 🛠️ Desarrollo

### Requisitos

- Node.js >= 18
- pnpm
- Terraform >= 1.0
- Cuenta de Cloudflare

### Scripts Disponibles

``` bash
pnpm dev          # Servidor de desarrollo local
pnpm build        # Construir bundle
pnpm deploy       # Desplegar a Cloudflare
```

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT.
