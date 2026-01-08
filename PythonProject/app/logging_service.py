import logging
import sys

def setup_logging():
    """
    Configures structured logging for the application.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(filename)s - %(funcName)s - %(message)s",
        stream=sys.stdout,
    )
    # You can add more handlers here, for example, to log to a file
    # file_handler = logging.FileHandler("app.log")
    # file_handler.setFormatter(logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s"))
    # logging.getLogger().addHandler(file_handler)

logger = logging.getLogger(__name__)
