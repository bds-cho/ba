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

// FOR LAMBDA-DYNAMO ONLY
resource "aws_iam_role_policy_attachment" "lambda_dynamoroles" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
}

resource "aws_lambda_function" "lambda-dynamo-fn" {
  filename      = "${path.module}/../../util/lambda-dynamo-fn.zip"
  function_name = "lambda-dynamo-fn"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "lambda-dynamo-fn.handler"
  runtime       = "nodejs20.x"
  #vpc_config {
  #  subnet_ids = [ "subnet-0658837f6a09e2595" ]
  #  security_group_ids = [ "sg-06f602494cd511886" ]
  #}
  #reserved_concurrent_executions = 1000
}

resource "aws_lambda_function_url" "public_url" {
  function_name      = aws_lambda_function.lambda-dynamo-fn.function_name
  authorization_type = "NONE"
}

output "path" {
  value = path.module
}