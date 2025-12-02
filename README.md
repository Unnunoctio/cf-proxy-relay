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

Ejemplo básico de `wrangler.jsonc`:
``` jsonc
{
    "name": "cf-proxy-relay",
    "main": "src/index.js",
    "compatibility_date": "2025-11-28",
    "vars": {
        "API_KEY": "your-secure-api-key"
    }
}
```

---

## 🔑 Variables de Entorno

| Variable | Descripción |
| --- | --- |
| `API_KEY` | Clave secreta necesaria para autenticar todas las solicitudes. |


Puedes definirla en:
- wrangler.jsonc

- Cloudflare Dashboard → Workers → Settings → Variables

---

## 📡 Uso del API
**Endpoint**
``` nginx
POST /
```

**Headers Requeridos**
| Header | Valor |
| --- | --- |
| `Content-Type` | `application/json` |
| `X-API-Key` | Debe coincidir con tu `API_KEY` |

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

---

## 📜 Licencia
Este proyecto está bajo la licencia MIT.