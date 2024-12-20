resource "aws_instance" "ec2-client" {
  ami               = "ami-0e872aee57663ae2d" # ubuntu-server-24.04-amd64-hvm
  instance_type     = "t2.micro"              # 1CPU-1GiB
  tags              = { Name = "ec2-client" }
  availability_zone = "eu-central-1a"
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name
  depends_on = [ aws_db_instance.rds ]

  user_data = <<-EOL
    #!/bin/bash -xe
    apt update
    apt install -y git && snap install aws-cli --classic && export PATH=$PATH:/snap/bin
    git clone https://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@github.com/bds-cho/ba.git
    mkdir /root/k6 && cp /ba/k6-workspace/{k6,ec2-rds.js,util.js} /root/k6/ && rm -R /ba
    #cd /root/k6 && ./k6 run --log-format=json --log-output=file=./ec2-rds-<constant/spike>-$(date +%s)-runX.log -e LOAD=<constant/spiky> ./ec2-rds.js
    #aws s3 cp /root/k6/ s3://ba-bench-data --recursive --exclude "*" --include "*.log"
  EOL
}

resource "aws_iam_role" "ec2_s3_role" {
  name = "ec2-s3-access-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "s3_access_policy" {
  name = "s3-access-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      Resource = [
        "arn:aws:s3:::ba-bench-data",
        "arn:aws:s3:::ba-bench-data/*"
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "s3_policy_attachment" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = aws_iam_policy.s3_access_policy.arn
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "ec2-instance-profile"
  role = aws_iam_role.ec2_s3_role.name
}