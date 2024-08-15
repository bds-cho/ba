resource "aws_instance" "helper-ec2" {
  ami               = "ami-0e872aee57663ae2d" # ubuntu-server-24.04-amd64-hvm
  instance_type     = "t2.micro"              # 1CPU-1GiB
  tags              = { Name = "helper-ec2" }
  availability_zone = "eu-central-1a"

  user_data = <<-EOL
    #!/bin/bash -xe
    apt update
    apt install -y git
    cd /root/ && git clone https://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@github.com/bds-cho/ba.git
  EOL
}
