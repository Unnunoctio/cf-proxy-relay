
export function handleOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,*"
        }
    })
}

export function safeJsonParse(text) {
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}