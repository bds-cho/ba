resource "aws_instance" "helper-ec2" {
  ami               = "ami-0e872aee57663ae2d" # ubuntu-server-24.04-amd64-hvm
  instance_type     = "t2.micro"              # 1CPU-1GiB
  tags              = { Name = "helper-ec2" }
  availability_zone = "eu-central-1a"
  depends_on = [ aws_lambda_function_url.public_url ]
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name
  user_data = <<-EOL
    #!/bin/bash -xe
    apt update
    apt install -y git && snap install aws-cli --classic && export PATH=$PATH:/snap/bin
    export LAMBDA=${aws_lambda_function_url.public_url.function_url} && echo "export LAMBDA=$LAMBDA" >> /root/.bashrc
    git clone https://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@github.com/bds-cho/ba.git
    mkdir /root/k6 && cp /ba/k6-workspace/{k6,helper-lambda-dynamodb.js,util.js} /root/k6/ && rm -R /ba
    #cd /root/k6 && ./k6 run --log-format=json --log-output=file=./lambda-dynamo-<constant/spike>-$(date +%s)-runX.log -e LOAD=<constant/spiky> ./helper-lambda-dynamodb.js
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