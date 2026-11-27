"""Noa de pruebas: para desarrollar sin gastar créditos de ElevenLabs.

Noa de verdad es un agente de ElevenLabs: oye, piensa (con el modelo que tenga el agente en el panel
de ElevenLabs) y habla. Todo eso gasta créditos.

En el modo de pruebas:
- Oye y habla el navegador (gratis). Eso está en persona.html (ConversacionDePruebas).
- Piensa Gemini con la clave GEMINI_API_KEY (plan gratis de Google AI Studio), con el MISMO prompt
  (agent/noa_prompt.md) y las MISMAS herramientas (agent/tools.json) que el agente de ElevenLabs.

Aquí no se ejecuta ninguna herramienta. Se devuelven a la pantalla de Javi, que las ejecuta igual que
con ElevenLabs: las de cliente con el mismo código de persona.html, y las webhook llamando a la misma
ruta del backend. Así se prueba lo mismo que usará Noa de verdad.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlparse

AGENTE = Path(__file__).resolve().parents[2] / "agent"
MODELO_POR_DEFECTO = "gemini-flash-latest"
URL_GEMINI = "https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent"


class SinConfigurar(Exception):
    """Falta la clave de Gemini o los archivos de agent/."""


class CuotaAgotada(Exception):
    """Gemini dice 429: se ha gastado la cuota gratis (por minuto o por día)."""


class FalloGemini(Exception):
    """Gemini ha fallado o ha devuelto algo que no se entiende."""


def modelo() -> str:
    return os.getenv("GEMINI_MODEL") or MODELO_POR_DEFECTO


def estado() -> dict[str, Any]:
    """Si el modo de pruebas puede funcionar. Lo pregunta la pantalla antes de abrir la conversación."""
    motivo = None
    if not os.getenv("GEMINI_API_KEY"):
        motivo = "falta GEMINI_API_KEY en .env"
    elif not (AGENTE / "noa_prompt.md").exists() or not (AGENTE / "tools.json").exists():
        motivo = "no encuentro agent/noa_prompt.md o agent/tools.json"
    return {"listo": motivo is None, "motivo": motivo, "modelo": modelo()}


# ---------- El prompt y las herramientas de Noa (los mismos que en ElevenLabs) ----------

def prompt(nombre: str) -> str:
    """El primer bloque de código de agent/noa_prompt.md, con {{nombre}} cambiado."""
    texto = (AGENTE / "noa_prompt.md").read_text(encoding="utf-8")
    bloque = re.search(r"```[^\n]*\n(.*?)```", texto, re.DOTALL)
    if not bloque:
        raise SinConfigurar("agent/noa_prompt.md no tiene el bloque del prompt")
    return bloque.group(1).replace("{{nombre}}", nombre).strip()


def herramientas() -> list[dict[str, Any]]:
    return json.loads((AGENTE / "tools.json").read_text(encoding="utf-8"))["tools"]


def _parametros(h: dict[str, Any]) -> dict[str, Any] | None:
    """Los parámetros de una herramienta como los pide Gemini. None si no tiene."""
    if h["type"] == "client":
        props = dict(h.get("parameters", {}).get("properties", {}))
        requeridos = list(h.get("parameters", {}).get("required", []))
    else:
        api = h.get("api_schema", {})
        ruta = api.get("path_params_schema", {})
        cuerpo = api.get("request_body_schema", {})
        props = {**ruta, **cuerpo.get("properties", {})}
        requeridos = [*ruta, *cuerpo.get("required", [])]
    if not props:
        return None
    return {"type": "object", "properties": props, "required": requeridos}


def declaraciones() -> list[dict[str, Any]]:
    """Las herramientas de agent/tools.json en el formato de Gemini (functionDeclarations)."""
    salida = []
    for h in herramientas():
        d = {"name": h["name"], "description": h.get("description", "")}
        params = _parametros(h)
        if params:
            d["parameters"] = params
        salida.append(d)
    return salida


def webhook(nombre: str, args: dict[str, Any]) -> dict[str, Any] | None:
    """Para una herramienta webhook: método, ruta del backend (sin el dominio de Render) y cuerpo.

    La pantalla la llama en su mismo servidor. None si es de cliente o no existe.
    """
    h = next((x for x in herramientas() if x["name"] == nombre), None)
    if not h or h["type"] != "webhook":
        return None
    api = h["api_schema"]
    metodo = api.get("method", "GET").upper()
    en_ruta = set(api.get("path_params_schema", {}))
    ruta = urlparse(api["url"]).path
    for p in en_ruta:
        ruta = ruta.replace("{" + p + "}", quote(str(args.get(p, "")), safe=""))
    cuerpo = {k: v for k, v in args.items() if k not in en_ruta}
    return {"metodo": metodo, "ruta": ruta, "cuerpo": cuerpo if metodo != "GET" else None}


# ---------- La conversación ----------
# La pantalla guarda la conversación y la manda entera en cada turno. Cada paso es uno de estos:
#   {"rol": "persona", "texto": ...}     lo que dice Javi
#   {"rol": "noa", "texto": ...}         lo que dice Noa sin pasar por Gemini (el saludo)
#   {"rol": "contexto", "texto": ...}    información de la pantalla (como sendContextualUpdate)
#   {"rol": "modelo", "partes": [...]}   la respuesta de Gemini tal cual (con sus firmas: Gemini 3 las exige)
#   {"rol": "resultado", "nombre": ..., "resultado": ..., "id": ...}   lo que devolvió una herramienta

def contenidos(historial: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """La conversación en el formato de Gemini. Junta los pasos seguidos del mismo lado."""
    salida: list[dict[str, Any]] = []

    def poner(rol: str, partes: list[dict[str, Any]]) -> None:
        if salida and salida[-1]["role"] == rol:
            salida[-1]["parts"].extend(partes)
        else:
            salida.append({"role": rol, "parts": list(partes)})

    for paso in historial:
        rol = paso.get("rol")
        if rol == "persona":
            poner("user", [{"text": paso.get("texto") or ""}])
        elif rol == "contexto":
            poner("user", [{"text": f"[Información de Willo. No la leas tal cual] {paso.get('texto') or ''}"}])
        elif rol == "noa":
            poner("model", [{"text": paso.get("texto") or ""}])
        elif rol == "modelo":
            if paso.get("partes"):
                poner("model", paso["partes"])
        elif rol == "resultado":
            respuesta = {"name": paso.get("nombre") or "", "response": {"resultado": paso.get("resultado")}}
            if paso.get("id"):
                respuesta["id"] = paso["id"]
            poner("user", [{"functionResponse": respuesta}])
    if salida and salida[0]["role"] == "model":   # Gemini quiere que empiece la persona
        salida.insert(0, {"role": "user", "parts": [{"text": "[Willo] Empieza la conversación."}]})
    return salida


async def _llamar_gemini(cuerpo: dict[str, Any]) -> dict[str, Any]:
    """Manda el turno a Gemini. Los tests sustituyen esta función (no gastan ni necesitan clave)."""
    import httpx

    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise SinConfigurar("Falta GEMINI_API_KEY en .env")
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.post(URL_GEMINI.format(modelo=modelo()), headers={"x-goog-api-key": key}, json=cuerpo)
    if r.status_code == 429:
        raise CuotaAgotada("Se ha acabado la cuota gratis de Gemini. Espera un poco o prueba mañana.")
    if r.status_code >= 400:
        raise FalloGemini(f"Gemini respondió {r.status_code}: {r.text[:300]}")
    return r.json()


async def pensar(nombre: str, historial: list[dict[str, Any]]) -> dict[str, Any]:
    """Un turno de Noa. Devuelve lo que dice (texto) y las herramientas que quiere usar (llamadas).

    "partes" es la respuesta de Gemini tal cual: la pantalla la guarda en la conversación como
    {"rol": "modelo", "partes": ...} para el turno siguiente.
    """
    e = estado()
    if not e["listo"]:
        raise SinConfigurar(e["motivo"])
    cuerpo = {
        "systemInstruction": {"parts": [{"text": prompt(nombre)}]},
        "contents": contenidos(historial),
        "tools": [{"functionDeclarations": declaraciones()}],
    }
    datos = await _llamar_gemini(cuerpo)
    try:
        partes = (datos.get("candidates") or [{}])[0].get("content", {}).get("parts", []) or []
    except (AttributeError, IndexError, TypeError) as err:
        raise FalloGemini(f"Respuesta de Gemini que no se entiende: {err}") from err
    texto = " ".join(p["text"].strip() for p in partes
                     if isinstance(p, dict) and p.get("text") and not p.get("thought")).strip()
    llamadas = []
    for p in partes:
        fc = p.get("functionCall") if isinstance(p, dict) else None
        if not fc:
            continue
        args = fc.get("args") or {}
        llamadas.append({"nombre": fc.get("name", ""), "args": args, "id": fc.get("id"),
                         "webhook": webhook(fc.get("name", ""), args)})
    return {"texto": texto, "llamadas": llamadas, "partes": partes}
