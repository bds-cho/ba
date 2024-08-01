resource "aws_instance" "ec2-client" {
  ami = "ami-0e872aee57663ae2d" # ubuntu-server-24.04-amd64-hvm
  instance_type = "t2.micro"
  tags = { Name = "ec2-client" }

  user_data = <<-EOL
    #!/bin/bash -xe
    apt update
    apt install -y git curl zip jq
    wget https://github.com/grafana/k6/releases/download/v0.52.0/k6-v0.52.0-linux-amd64.deb -P /
    dpkg -i /k6-v0.51.0-linux-amd64.deb && rm -f /k6-v0.51.0-linux-amd64.deb
  EOL
}