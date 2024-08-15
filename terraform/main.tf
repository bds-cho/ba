terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.60.0"
    }
  }
}

provider "aws" {
  region     = "eu-central-1"
  access_key = var.aws_access_id
  secret_key = var.aws_access_secret
}

variable "aws_access_id" {}
variable "aws_access_secret" {}
variable "az" {
  type    = string
  default = "eu-central-1a"
}

module "ec2-dynamo" {
  source = "./modules/ec2-dynamo"
}

module "ec2-rds" {
  source = "./modules/ec2-rds"
}

module "ec2-s3" {
  source = "./modules/ec2-s3"
}

module "lambda-dynamo" {
  source = "./modules/lambda-dynamo"
}

module "lambda-rds" {
  source = "./modules/lambda-rds"
}

module "lambda-s3" {
  source = "./modules/lambda-s3"
}