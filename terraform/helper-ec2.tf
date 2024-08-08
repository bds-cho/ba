resource "aws_instance" "helper-ec2" {
  ami               = "ami-0e872aee57663ae2d" # ubuntu-server-24.04-amd64-hvm
  instance_type     = "t2.micro"              # 1CPU-1GiB
  tags              = { Name = "helper-ec2" }
  availability_zone = var.az

  user_data = <<-EOL
    #!/bin/bash -xe
    apt update
    apt install -y git curl zip jq
    wget https://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@github.com/grafana/k6/releases/download/v0.52.0/k6-v0.52.0-linux-amd64.deb -P /
    dpkg -i /k6-v0.52.0-linux-amd64.deb && rm -f /k6-v0.52.0-linux-amd64.deb
    cd /root/ && git clone https://github.com/bds-cho/ba.git
  EOL
}
