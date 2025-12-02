import { authApiKey } from "../middleware/auth";
import { executeProxy } from "../services/proxy";
import { formatError, formatResponse } from "../utils/response";
import { validateRequest } from "../validators/request";

export async function proxyHandler(request, env, ctx) {
    try {
        if (request.method !== "POST") {
            return formatError("Method not allowed", 405)
        }

        // TODO: Autentication
        const authResult = await authApiKey(request, env)
        if (!authResult.success) {
            return formatError(authResult.error, 401)
        }

        // TODO: Parse & Validate
        const body = await request.json()
        const validation = validateRequest(body)
        if (!validation.success) {
            return formatError(validation.error, 400)
        }

        // TODO: Ejecutar Proxy
        const proxyResult = await executeProxy(body, env)
        
        // TODO: Response
        return formatResponse(proxyResult)
    } catch (error) {
        if (error.name === "AbortError") {
            return formatError("Request timeout", 504)
        }

        return formatError(error.message, 500)
    }
}