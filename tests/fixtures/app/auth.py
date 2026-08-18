class BaseAuth:
    def verify(self, token):
        pass

def authenticate_user(username, password):
    if username == "admin" and password == "secret":
        return True
    return False
