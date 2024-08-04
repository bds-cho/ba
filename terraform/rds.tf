resource "aws_db_instance" "rds" {
  allocated_storage = 5
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
  provisioner "local-exec" {
    command = "mysql --host=${self.address} --port=${self.port} --user=${self.username} --password=${self.password} < ./util/rds-data-gen.sql"
  }
}
