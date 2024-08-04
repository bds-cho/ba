resource "aws_db_instance" "rds" {
  allocated_storage = 1
  db_name = "rds"
  identifier = "rds"
  engine = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.micro"    # 2CPU-1GiB
  username = "admin"
  password = "adminadmin"
  skip_final_snapshot = true
  multi_az = false
  publicly_accessible = true
  availability_zone = var.az
}

output "rds_endpoint" {
  value       = aws_db_instance.rds.endpoint
}
