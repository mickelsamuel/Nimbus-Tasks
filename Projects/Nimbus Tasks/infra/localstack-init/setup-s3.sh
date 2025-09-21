#!/bin/bash

echo "Setting up S3 bucket for Nimbus Tasks..."

# Create the S3 bucket
awslocal s3 mb s3://nimbus-uploads

# Set bucket policy to allow public read access for uploaded files
awslocal s3api put-bucket-policy --bucket nimbus-uploads --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::nimbus-uploads/*"
    }
  ]
}'

# Configure CORS for the bucket
awslocal s3api put-bucket-cors --bucket nimbus-uploads --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}'

echo "S3 bucket setup complete!"

# List buckets to verify
awslocal s3 ls