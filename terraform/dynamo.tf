resource "aws_dynamodb_table" "dynamo" {
  name = "dynamo"
  billing_mode = "PROVISIONED"
  read_capacity = 5
  write_capacity = 5
  hash_key = "column1"
  range_key = "column2"
  attribute {
    name = "column1"
    type = "S"
  }
  attribute {
    name = "column2"
    type = "S"
  }
}

