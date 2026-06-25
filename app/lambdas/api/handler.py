import json
import os


def lambda_handler(event, context):
    http_method = event.get("requestContext", {}).get("http", {}).get("method")
    raw_path = event.get("rawPath")

    if http_method == "GET" and raw_path == "/health":
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "message": "API is healthy",
                "aws_region": os.environ.get("AWS_REGION"),
                "documents_bucket": os.environ.get("DOCUMENTS_BUCKET_NAME"),
                "submissions_table": os.environ.get("SUBMISSIONS_TABLE_NAME")
            })
        }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "message": "Lambda is working",
            "event": event
        })
    }