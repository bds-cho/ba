data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

// ACCES TO VPC-RESOURCES, WRITE TO CLOUDWATCH, ETC
resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn  = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

// FOR LAMBDA-S3 ONLY
resource "aws_iam_role_policy_attachment" "lambda_s3roles" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

resource "aws_lambda_function" "lambda-s3-fn" {
  filename      = "${path.module}/../../util/lambda-s3-fn.zip"
  function_name = "lambda-s3-fn"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "lambda-s3-fn.handler"
  runtime       = "nodejs20.x"
  reserved_concurrent_executions = 990
  memory_size = 1769      // 1CPU-1.65GiB
  depends_on = [ aws_s3_object.object ]
}

resource "aws_lambda_function_url" "public_url" {
  function_name      = aws_lambda_function.lambda-s3-fn.function_name
  authorization_type = "NONE"
}

output "path" {
  value = path.module
}