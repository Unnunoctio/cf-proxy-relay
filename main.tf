terraform {
    required_version = ">= 1.0"

    required_providers {
        cloudflare = {
            source = "cloudflare/cloudflare"
            version = "4.0.0"
        }
    }
}

provider "cloudflare" {
    api_token = var.cloudflare_api_token
}

resource "cloudflare_worker_script" "proxy_relay" {
    account_id = var.cloudflare_account_id
    name       = var.worker_name
    content    = file("${path.module}/dist/index.js")

    module     = true

    secret_text_binding {
        name = "API_KEY"
        text = var.api_key
    }
}

output "worker_url" {
    value = "https://${var.worker_name}.${var.cloudflare_account_id}.workers.dev"
}
