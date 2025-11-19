import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_get_resource_columns_success():
    resource_id = "xxxx-agua-dataset-id"  # Debe existir y ser tabular
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get(f"/resources/{resource_id}/columns")
    assert resp.status_code == 200
    data = resp.json()
    assert "columns" in data
    assert isinstance(data["columns"], list)

@pytest.mark.asyncio
async def test_get_resource_columns_not_found():
    resource_id = "no-existe-123"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get(f"/resources/{resource_id}/columns")
    assert resp.status_code == 404

@pytest.mark.asyncio
async def test_get_resource_columns_invalid_format():
    resource_id = "xxxx-non-tabular-id"  # Un recurso válido pero NO tabular (ejemplo: PDF)
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get(f"/resources/{resource_id}/columns")
    assert resp.status_code == 400

@pytest.mark.asyncio
async def test_get_resource_columns_rate_limit():
    resource_id = "xxxx-agua-dataset-id"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Exceder el límite de 20/minuto (ajusta si cambiaste el rate limit)
        for _ in range(21):
            resp = await ac.get(f"/resources/{resource_id}/columns")
        assert resp.status_code == 429

@pytest.mark.asyncio
async def test_get_resource_columns_empty():
    resource_id = "xxxx-empty-tabular-id"  # Un recurso tabular válido pero vacío
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.get(f"/resources/{resource_id}/columns")
    assert resp.status_code == 200
    data = resp.json()
    assert data["columns"] == []