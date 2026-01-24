variable "cloudflare_api_token" {
    description = "Cloudflare API token"
    type        = string
    sensitive   = true
}

variable "cloudflare_account_id" {
    description = "Cloudflare account ID"
    type        = string
}

variable "worker_name" {
    description = "Worker name"
    type        = string
    default     = "cf-proxy-relay"
}

variable "api_key" {
    description = "API key for authenticated requests"
    type        = string
    sensitive   = true
}
