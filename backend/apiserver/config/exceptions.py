from rest_framework.exceptions import APIException


# Exceptions for Database Duplication Error
class DatabaseDuplicationError(APIException):
    status_code = 500
    default_detail = 'Internal Server error occurred. please contact to administrator.'
    default_code = 'internal_database_error'
