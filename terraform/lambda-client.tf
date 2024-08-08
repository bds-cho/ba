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

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/util/test.js"
  output_path = "${path.module}/util/test.zip"
}

resource "aws_lambda_function" "test" {
  filename      = "${path.module}/util/test.zip"
  function_name = "test"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "test.handler"
  runtime       = "nodejs18.x"
}

resource "aws_lambda_function_url" "public_url" {
  function_name      = aws_lambda_function.test.function_name
  authorization_type = "NONE"
}
