# Monita Backend

API para exploración, filtrado, análisis y exportación de recursos tabulares. Provee endpoints robustos y seguros para ser consumidos por el frontend Monita u otros clientes.

## Características principales

- Endpoints RESTful para preview, filtrado, KPIs, gráficos y exportación de datos tabulares.
- Soporte para archivos CSV, XLSX, XLS.
- Manejo eficiente de memoria y archivos grandes (chunksize, límites).
- Rate limiting configurable y caché para metadatos.
- Validaciones de seguridad: dominio, extensión, tamaño de archivo.
- Logging, manejo de errores y mensajes claros.
- Accesible vía OpenAPI/Swagger.

## Instalación y dependencias

``bash
pip install -r requirements.txt

## Variables de entorno recomendadas (puedes usar .env):

## CKAN_BASE_URL
- MAX_FILE_SIZE_MB
- ALLOWED_DOMAINS
- REQUEST_TIMEOUT
- MAX_RETRIES

## Endpoints principales
GET /resources/{resource_id}/preview
Preview de las primeras filas del recurso.
GET /resources/{resource_id}/columns
Lista de columnas del recurso.
GET /resources/{resource_id}/filter
Filtrado y paginación de datos.
GET /resources/{resource_id}/kpis
KPIs automáticos para columnas numéricas.
GET /resources/{resource_id}/chart
Datos agregados para gráficos (histograma, barras, pastel, línea).
Ejemplo de uso
GET /resources/{resource_id}/filter?page=1&page_size=20&filters={"columna":"valor"}
GET /resources/{resource_id}/kpis
GET /resources/{resource_id}/chart?column=consumo&chart_type=histogram&bins=10

## Seguridad y límites
# Solo se aceptan URLs de dominios permitidos y extensiones válidas.
# Límite de tamaño de archivo configurable (por defecto: 100MB).
# Rate limiting por endpoint (ej: 10/minuto para preview).
# Exportación limitada a 10,000 filas por petición.
# Manejo de errores y mensajes claros (400, 404, 413, 429, 500).

## Advertencias y errores
# Si el recurso no es tabular, se retorna 400.
# Si se excede el límite de tamaño, se retorna 413.
# Si se supera el rate limit, se retorna 429.
# Todos los errores relevantes se muestran en el frontend.

## Testing
# Se recomienda agregar pruebas unitarias y de integración con pytest y httpx.
# Ejemplo mínimo de test en tests/test_resources.py.
# Documentación OpenAPI
# Accesible en /docs y /redoc al levantar el servidor.

## Contacto y soporte:
# Para dudas o sugerencias, contacta al equipo Monita.