# app/config.py
from pydantic import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Configuración existente
    CKAN_BASE_URL: str = "https://datos.cali.gov.co/api/3/action"
    AGUA_DATASET_ID: str = "xxxx-agua-dataset-id"
    AGUA_DATASET_URL: str = "https://datos.cali.gov.co/path/to/agua.csv"
    ENERGIA_DATASET_ID: str = "xxxx-energia-dataset-id"
    ENERGIA_DATASET_URL: str = "https://datos.cali.gov.co/path/to/energia.csv"
    
    # Configuración de seguridad
    MAX_FILE_SIZE_MB: int = 100  # Límite de 100MB
    ALLOWED_DOMAINS: List[str] = ["datos.cali.gov.co"]
    REQUEST_TIMEOUT: int = 30  # segundos
    MAX_RETRIES: int = 3
    
    # Configuración de rendimiento
    CHUNK_SIZE: int = 10000  # Número de filas por chunk
    PANDAS_READ_CHUNKSIZE: int = 1000  # Tamaño de chunk para lectura de pandas
    
    # Configuración general
    API_VERSION: str = "1.0.0"
    DEBUG: bool = False

# Instancia de configuración
settings = Settings()

# Para compatibilidad con código existente
CKAN_BASE_URL = settings.CKAN_BASE_URL
API_VERSION = settings.API_VERSION