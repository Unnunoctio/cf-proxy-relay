# cf-proxy-relay

Un **Cloudflare Worker seguro, ligero y extensible** que actúa como un **proxy relay** para realizar solicitudes HTTP hacia servicios externos.

Incluye autenticación mediante API Key, control de CORS, validación estricta de entrada y manejo centralizado de errores.

Este proyecto fue creado para **evitar los bloqueos producidos por el propio servicio de Cloudflare (Bot Challenge / bot detection)** cuando se necesitan realizar solicitudes desde entornos que Cloudflare identifica como automatizados.

---

## Características

- **CORS Automático** — manejo nativo de solicitudes `OPTIONS` y cabeceras configurables.
- **Autenticación por API Key** — requiere el header `X-API-Key` para todas las solicitudes.
- **Validación de Entrada** — URL válida (`http`/`https`), métodos permitidos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **Proxy Seguro** — reenvía headers, método, cuerpo y timeout personalizados.
- **Timeout y AbortController** — control de solicitudes lentas o colgadas.
- **Errores Estructurados** — respuestas JSON claras y consistentes.

---

## Instalación

```bash
git clone <repository-url>
cd cf-proxy-relay
pnpm install
```

---

## Configuración

### Desarrollo local

Copia el archivo de ejemplo y agrega tu API key:

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars` es leído automáticamente por `wrangler dev`.

### Producción

El secret `API_KEY` se gestiona directamente con Wrangler:

```bash
wrangler secret put API_KEY
```

---

## Despliegue

```bash
pnpm dev       # Servidor de desarrollo local
pnpm deploy    # Deploy a Cloudflare Workers
```

---

## API

**Endpoint**
```
POST https://<worker-name>.<account-subdomain>.workers.dev
```

**Headers requeridos**

| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `X-API-Key` | Tu `API_KEY` configurada |

**Cuerpo de la solicitud**

```jsonc
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

| Parámetro | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `url` | String | Sí | URL destino (http/https). |
| `method` | String | No | Método HTTP (default: `GET`). |
| `headers` | Object | No | Cabeceras adicionales a enviar. |
| `body` | Object | No | Se serializa automáticamente a JSON. |
| `timeout` | Number | No | Tiempo de espera en ms (default: `30000`). |

**Ejemplo cURL**

```bash
curl -X POST https://your-worker.workers.dev \
    -H "Content-Type: application/json" \
    -H "X-API-Key: your-secure-api-key" \
    -d '{
        "url": "https://jsonplaceholder.typicode.com/posts",
        "method": "POST",
        "body": { "title": "foo", "body": "bar", "userId": 1 }
    }'
```

---

## Seguridad

Este Worker actúa como un open proxy autenticado. Recomendaciones:

- Usar API Keys largas y seguras (32+ chars)
- Implementar allowlist de dominios destino
- Limitar tamaño máximo del body
- Agregar rate limiting vía Cloudflare Rules o Turnstile

---

## Requisitos

- Node.js >= 18
- pnpm
- Cuenta de Cloudflare

---

## Licencia

MIT
