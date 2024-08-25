resource "aws_dynamodb_table" "dynamo" {
  name           = "dynamo"
  billing_mode   = "PROVISIONED"
  read_capacity  = 25
  write_capacity = 5
  hash_key       = "id"
  attribute {
    name = "id"
    type = "N"
  }
}

resource "aws_dynamodb_table_item" "items" {
  count = 10
  table_name = aws_dynamodb_table.dynamo.name
  hash_key   = aws_dynamodb_table.dynamo.hash_key
  item = <<ITEM
  {
    "id": {"N":"${count.index+1}"},
    "email": {"S":"user${format("%03d",count.index+1)}@example.com"}
  }
  ITEM
}