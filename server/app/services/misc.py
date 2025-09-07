import boto3

# Connect to your local MinIO
s3 = boto3.client(
	's3',
	endpoint_url='http://127.0.0.1:9000',
	aws_access_key_id='minioadmin',
	aws_secret_access_key='minioadmin',
)

bucket_name = 'my-bucket'

# Step 1: Delete all objects in the bucket
objects = s3.list_objects_v2(Bucket=bucket_name)
print(objects)
if 'Contents' in objects:
	for obj in objects['Contents']:
		s3.delete_object(Bucket=bucket_name, Key=obj['Key'])

# Step 2: Delete the bucket
s3.delete_bucket(Bucket=bucket_name)
print(f"Bucket '{bucket_name}' deleted.")
