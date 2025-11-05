@router.get("/health", tags=["health"])
def health_check():
    # Aquí podrías agregar chequeos adicionales (DB, CKAN, etc.)
    return {
        "status": "ok",
        "ckan": "ok",  # o "fail" si falla la conexión
        "version": "1.0.0"
    }