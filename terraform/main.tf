terraform {
    required_providers {
        cloudflare = {
            source = "cloudflare/cloudflare"
            version = "5.16.0"
        }
    }
}

provider "cloudflare" {
    api_token = var.cloudflare_api_token
}

resource "cloudflare_worker" "proxy_relay" {
    account_id      = var.cloudflare_account_id
    name            = var.worker_name

    subdomain       = {
        enabled = true
        previews_enabled = false
    }

    observability   = {
        enabled = true
        head_sampling_rate = 0.05
        logs = {
            enabled = true
            head_sampling_rate = 0.05
            invocation_logs = true
        }
    }
}

resource "cloudflare_worker_version" "proxy_relay_production" {
    account_id          = var.cloudflare_account_id
    worker_id           = cloudflare_worker.proxy_relay.id
    compatibility_date  = "2026-01-26"
    main_module         = "index.js"

    modules = [
        {
            content_file = "${path.module}/../dist/index.js"
            content_type = "application/javascript+module"
            name         = "index.js"
        }
    ]

    bindings = [
        {
            type = "secret_text",
            name = "API_KEY",
            text = var.api_key
        }
    ]
}

resource "cloudflare_workers_deployment" "proxy_relay_deployment" {
    account_id = var.cloudflare_account_id
    script_name = cloudflare_worker.proxy_relay.name
    strategy = "percentage"

    versions = [
        {
            percentage = 100
            version_id = cloudflare_worker_version.proxy_relay_production.id
        }
    ]

    annotations = {
        workers_message = "Deployed by Terraform"
    }
}

output "worker_url" {
    description = "URL of the Cloudflare Worker"
    value = "https://${var.worker_name}.${var.cloudflare_account_id}.workers.dev"
}
