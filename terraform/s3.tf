resource "aws_s3_bucket" "bucket" {
  bucket = "tf-ba-bucket"
}

resource "aws_s3_object" "object" {
  bucket = aws_s3_bucket.bucket.id
  key    = "s3-object.txt"
  source = "${path.module}/../util/s3-object.txt"
}