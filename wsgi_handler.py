from apiEndpoint_react import app
from serverless_wsgi import handle_request

def handler(event, context):
    # Use serverless_wsgi to handle the request
    return handle_request(app, event, context)
