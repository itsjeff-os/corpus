from __future__ import annotations

from typing import Literal

HomeChromaCollection = Literal[
    "home_ha_automations",
    "home_ha_reference",
    "home_system_docs",
    "home_patterns_rituals",
]

HOME_CHROMA_COLLECTIONS: tuple[HomeChromaCollection, ...] = (
    "home_ha_automations",
    "home_ha_reference",
    "home_system_docs",
    "home_patterns_rituals",
)

AUTOMATION_OBJECT_TYPES = {"automation", "blueprint", "script", "scene"}
REFERENCE_OBJECT_TYPES = {
    "binary_sensor",
    "button",
    "calendar",
    "climate",
    "conversation",
    "fan",
    "group",
    "humidifier",
    "input_boolean",
    "input_datetime",
    "input_number",
    "input_select",
    "input_text",
    "light",
    "media_player",
    "number",
    "person",
    "remote",
    "select",
    "sensor",
    "shell_command",
    "switch",
    "timer",
    "todo",
    "update",
    "vacuum",
    "weather",
    "zone",
}

PATTERN_DOC_HINTS = {
    "calibration",
    "context",
    "preference",
    "ritual",
    "routine",
    "pattern",
    "messages",
    "landed",
}


def collection_for_home_assistant_object(object_type: str) -> HomeChromaCollection:
    if object_type in AUTOMATION_OBJECT_TYPES:
        return "home_ha_automations"
    return "home_ha_reference"


def collection_for_document(path_hint: str, text_hint: str = "") -> HomeChromaCollection:
    haystack = f"{path_hint} {text_hint}".lower()
    if any(hint in haystack for hint in PATTERN_DOC_HINTS):
        return "home_patterns_rituals"
    return "home_system_docs"
