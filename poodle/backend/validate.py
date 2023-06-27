from variables import secret_key
from werkzeug.exceptions import Unauthorized
import jwt

def validate_token(token):
    token = token.split(' ')[1]  
    try:
        payload = jwt.decode(
            token, 
            secret_key, 
            algorithms=['HS256']
        )
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise Unauthorized('Token has expired')
    except jwt.InvalidTokenError:
        raise Unauthorized('Invalid token')