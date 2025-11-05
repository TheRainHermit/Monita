import pandas as pd

def load_csv(url):
    # Puedes agregar caching aquí si es necesario
    return pd.read_csv(url, encoding="utf-8")