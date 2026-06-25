import json
import os
import uuid
from datetime import datetime, timezone

import boto3


s3_client = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
sns_client = boto3.client("sns")

SUBMISSIONS_TABLE_NAME = os.environ["SUBMISSIONS_TABLE_NAME"]
DOCUMENTS_BUCKET_NAME = os.environ["DOCUMENTS_BUCKET_NAME"]
SNS_TOPIC_ARN = os.environ["SNS_TOPIC_ARN"]

table = dynamodb.Table(SUBMISSIONS_TABLE_NAME)


def build_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }


def get_request_body(event):
    body = event.get("body")
    if not body:
        return {}

    if isinstance(body, str):
        return json.loads(body)

    return body


def get_request_identity(event):
    headers = event.get("headers", {}) or {}

    return {
        "user_role": headers.get("x-user-role"),
        "user_id": headers.get("x-user-id"),
        "user_email": headers.get("x-user-email")
    }


def require_role(identity, allowed_roles):
    if identity["user_role"] not in allowed_roles:
        return False
    return True


def handle_health():
    return build_response(200, {
        "message": "API is healthy",
        "aws_region": os.environ.get("AWS_REGION"),
        "documents_bucket": DOCUMENTS_BUCKET_NAME,
        "submissions_table": SUBMISSIONS_TABLE_NAME
    })


def handle_upload_url(event, identity):
    if not require_role(identity, ["supplier"]):
        return build_response(403, {"message": "Forbidden"})

    body = get_request_body(event)
    file_name = body.get("file_name")
    document_type = body.get("document_type")

    if not file_name or not document_type:
        return build_response(400, {
            "message": "file_name and document_type are required"
        })

    submission_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc).isoformat()
    s3_key = f"uploads/{identity['user_id']}/{submission_id}/{file_name}"

    upload_url = s3_client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": DOCUMENTS_BUCKET_NAME,
            "Key": s3_key
        },
        ExpiresIn=300
    )

    item = {
        "submission_id": submission_id,
        "supplier_id": identity["user_id"],
        "supplier_email": identity["user_email"],
        "document_type": document_type,
        "file_name": file_name,
        "s3_key": s3_key,
        "upload_timestamp": timestamp,
        "status": "Received"
    }

    table.put_item(Item=item)

    sns_client.publish(
        TopicArn=SNS_TOPIC_ARN,
        Subject="New supplier document submitted",
        Message=json.dumps({
            "message": "A new supplier document has been submitted.",
            "submission_id": submission_id,
            "supplier_id": identity["user_id"],
            "supplier_email": identity["user_email"],
            "document_type": document_type,
            "file_name": file_name,
            "status": "Received"
        }, indent=2)
    )

    return build_response(200, {
        "submission_id": submission_id,
        "upload_url": upload_url,
        "s3_key": s3_key
    })


def handle_get_submissions(identity):
    if not require_role(identity, ["supplier", "reviewer"]):
        return build_response(403, {"message": "Forbidden"})

    response = table.scan()
    items = response.get("Items", [])

    if identity["user_role"] == "supplier":
        items = [item for item in items if item.get("supplier_id") == identity["user_id"]]

    items.sort(key=lambda x: x.get("upload_timestamp", ""), reverse=True)

    return build_response(200, {
        "items": items
    })


def handle_update_status(event, identity):
    if not require_role(identity, ["reviewer"]):
        return build_response(403, {"message": "Forbidden"})

    path_parameters = event.get("pathParameters", {}) or {}
    submission_id = path_parameters.get("submission_id")

    if not submission_id:
        return build_response(400, {"message": "submission_id is required"})

    body = get_request_body(event)
    status = body.get("status")

    allowed_statuses = ["Received", "Under Review", "Approved", "Rejected"]

    if status not in allowed_statuses:
        return build_response(400, {
            "message": f"status must be one of: {', '.join(allowed_statuses)}"
        })

    response = table.get_item(Key={"submission_id": submission_id})
    item = response.get("Item")

    if not item:
        return build_response(404, {"message": "Submission not found"})

    table.update_item(
        Key={"submission_id": submission_id},
        UpdateExpression="SET #status = :status",
        ExpressionAttributeNames={
            "#status": "status"
        },
        ExpressionAttributeValues={
            ":status": status
        }
    )

    return build_response(200, {
        "message": "Submission status updated",
        "submission_id": submission_id,
        "status": status
    })


def lambda_handler(event, context):
    http_method = event.get("requestContext", {}).get("http", {}).get("method")
    raw_path = event.get("rawPath")
    identity = get_request_identity(event)

    if http_method == "GET" and raw_path == "/health":
        return handle_health()

    if http_method == "POST" and raw_path == "/upload-url":
        return handle_upload_url(event, identity)

    if http_method == "GET" and raw_path == "/submissions":
        return handle_get_submissions(identity)

    if http_method == "PATCH" and raw_path.startswith("/submissions/") and raw_path.endswith("/status"):
        return handle_update_status(event, identity)

    return build_response(404, {"message": "Not found"})