import os
from .auth import authenticate_user
from utils.helpers import get_logger

logger = get_logger(__name__)

class Application:
    def __init__(self, name: str):
        self.name = name
        
    def start(self):
        logger.info(f"Starting {self.name}")
        auth_success = authenticate_user("admin", "secret")
        if auth_success:
            self.run_server()
            
    def run_server(self):
        pass

def main():
    app = Application("CodeGraphTest")
    app.start()

if __name__ == "__main__":
    main()
