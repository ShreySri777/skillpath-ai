import os
from pathlib import Path

import certifi
from dotenv import load_dotenv


# Resolve the backend directory and load environment variables.
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)


# Configure the trusted CA bundle for TLS connections.
# Preserve SSL_CERT_FILE if it has already been configured explicitly.
os.environ.setdefault("SSL_CERT_FILE", certifi.where())


from neo4j import GraphDatabase


# Read Neo4j credentials from environment variables.
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")


def get_neo4j_driver():
    """Create a Neo4j driver using environment credentials."""
    missing_variables = [
        name
        for name, value in (
            ("NEO4J_URI", NEO4J_URI),
            ("NEO4J_USERNAME", NEO4J_USERNAME),
            ("NEO4J_PASSWORD", NEO4J_PASSWORD),
        )
        if not value
    ]

    if missing_variables:
        raise RuntimeError(
            "Missing required environment variables: "
            + ", ".join(missing_variables)
        )

    return GraphDatabase.driver(
        NEO4J_URI,
        auth=(NEO4J_USERNAME, NEO4J_PASSWORD),
    )
