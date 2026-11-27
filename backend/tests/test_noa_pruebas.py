"""Noa de pruebas (gratis): oye y habla el navegador, piensa Gemini. Ningún test llama a Gemini de verdad."""
import pytest

from app import noa_pruebas


@pytest.fixture()
def gemini_falso(monkeypatch):
    """Sustituye a Gemini. Guarda lo que le llegó y devuelve lo que pongamos en "respuesta"."""
    monkeypatch.setenv("GEMINI_API_KEY", "clave-de-test")
    falso = {"llamadas": [], "respuesta": {"candidates": [{"content": {"role": "model",
                                                                       "parts": [{"text": "Hola, Javi."}]}}]}}

    async def llamar(cuerpo):
        falso["llamadas"].append(cuerpo)
        return falso["respuesta"]

    monkeypatch.setattr(noa_pruebas, "_llamar_gemini", llamar)
    return falso


def test_sin_clave_no_esta_listo(client, monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    e = client.get("/api/noa-pruebas/estado").json()
    assert e["listo"] is False and "GEMINI_API_KEY" in e["motivo"]
    assert client.post("/api/noa-pruebas/turno", json={"historial": []}).status_code == 503


def test_usa_el_mismo_prompt_y_las_mismas_herramientas_que_elevenlabs(client, gemini_falso):
    r = client.post("/api/noa-pruebas/turno",
                    json={"nombre": "Javi", "historial": [{"rol": "persona", "texto": "¿Cuánto me queda?"}]})
    assert r.status_code == 200 and r.json()["texto"] == "Hola, Javi."
    cuerpo = gemini_falso["llamadas"][0]
    sistema = cuerpo["systemInstruction"]["parts"][0]["text"]
    assert sistema.startswith("Eres Noa") and "{{nombre}}" not in sistema and "Hablas con Javi" in sistema
    nombres = {d["name"] for d in cuerpo["tools"][0]["functionDeclarations"]}
    assert nombres == {h["name"] for h in noa_pruebas.herramientas()}
    assert cuerpo["contents"] == [{"role": "user", "parts": [{"text": "¿Cuánto me queda?"}]}]


def test_las_webhook_van_a_la_misma_ruta_del_backend(client, gemini_falso):
    gemini_falso["respuesta"] = {"candidates": [{"content": {"parts": [
        {"functionCall": {"name": "apuntar_resultado_envio", "args": {"aviso_id": "av_1", "enviado": False}},
         "thoughtSignature": "firma"}]}}]}
    r = client.post("/api/noa-pruebas/turno", json={"historial": [{"rol": "persona", "texto": "No lo envío"}]}).json()
    ll = r["llamadas"][0]
    assert ll["nombre"] == "apuntar_resultado_envio"
    assert ll["webhook"] == {"metodo": "POST", "ruta": "/api/personas/javi/avisos/av_1/resultado",
                             "cuerpo": {"enviado": False}}
    # La firma de Gemini vuelve tal cual: la pantalla la guarda para el turno siguiente
    assert r["partes"][0]["thoughtSignature"] == "firma"


def test_las_de_cliente_las_ejecuta_la_pantalla(client, gemini_falso):
    gemini_falso["respuesta"] = {"candidates": [{"content": {"parts": [
        {"text": "Vale."}, {"functionCall": {"name": "evaluar_compra", "args": {"importe": 45, "concepto": "la entrada"}}}]}}]}
    r = client.post("/api/noa-pruebas/turno", json={"historial": [{"rol": "persona", "texto": "¿Puedo?"}]}).json()
    assert r["texto"] == "Vale."
    assert r["llamadas"] == [{"nombre": "evaluar_compra", "args": {"importe": 45, "concepto": "la entrada"},
                              "id": None, "webhook": None}]


def test_la_conversacion_sigue_con_el_resultado_de_la_herramienta(client, gemini_falso):
    partes = [{"functionCall": {"name": "consultar_huchas", "args": {}}, "thoughtSignature": "firma"}]
    client.post("/api/noa-pruebas/turno", json={"historial": [
        {"rol": "noa", "texto": "Hola, Javi. Soy Noa."},
        {"rol": "contexto", "texto": "Círculo de apoyo de Javi: Ana (hermana)."},
        {"rol": "persona", "texto": "¿Cuánto me queda?"},
        {"rol": "modelo", "partes": partes},
        {"rol": "resultado", "nombre": "consultar_huchas", "resultado": "{\"queda\": 120}"},
    ]})
    roles = [c["role"] for c in gemini_falso["llamadas"][0]["contents"]]
    assert roles == ["user", "model", "user", "model", "user"]   # empieza la persona y se alternan
    contenidos = gemini_falso["llamadas"][0]["contents"]
    assert contenidos[3]["parts"] == partes   # la firma vuelve a Gemini sin tocar
    assert contenidos[4]["parts"][0]["functionResponse"]["name"] == "consultar_huchas"


def test_sin_cuota_da_429(client, gemini_falso, monkeypatch):
    async def agotada(cuerpo):
        raise noa_pruebas.CuotaAgotada("Se ha acabado la cuota gratis de Gemini.")

    monkeypatch.setattr(noa_pruebas, "_llamar_gemini", agotada)
    assert client.post("/api/noa-pruebas/turno", json={"historial": []}).status_code == 429


def test_no_toca_la_voz_de_elevenlabs(client, monkeypatch):
    """El modo de pruebas es aparte: /api/voz/decir sigue pidiendo la clave de ElevenLabs."""
    monkeypatch.delenv("ELEVENLABS_API_KEY", raising=False)
    assert client.post("/api/voz/decir", json={"texto": "Hola"}).status_code == 503
