import pandas as pd

def load_csv(url, encoding="utf-8"):
    # Puedes agregar caching, logging, manejo de errores, etc.
    return pd.read_csv(url, encoding=encoding)