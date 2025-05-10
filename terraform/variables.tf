variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default = "marine-clarity-458118-k6"
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "rakul-ca2-cluster"
}

variable "location" {
  description = "The GCP location (region or zone)"
  type        = string
  default     = "us-central1-c"
}
