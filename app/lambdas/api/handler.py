import json
import os


def lambda_handler(event, context):
    response = {
        "message": "Lambda is working",
        "aws_region": os.environ.get("AWS_REGION"),
        "documents_bucket": os.environ.get("DOCUMENTS_BUCKET_NAME"),
        "submissions_table": os.environ.get("SUBMISSIONS_TABLE_NAME"),
        "sns_topic_arn": os.environ.get("SNS_TOPIC_ARN"),
        "event": event
    }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(response)
    }