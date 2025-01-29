import logging
def register_error_handlers(app):
    error_responses = {
        400: "Bad Request",
        403: "Forbidden",
        404: "Not Found",
        500: "Internal Server Error"
    }

    for code, message in error_responses.items():
        @app.errorhandler(code)
        def handle_error(error, message=message, code=code):
            logging.error(f"Error {code}: {str(error)}")
            return {"error": message}, code
