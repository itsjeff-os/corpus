"""Ingestion Engine service — turns messy sources into usable intelligence."""

from .pipeline import IngestionPipeline
from .normalizer import Normalizer
from .deduper import Deduper
from .chunker import Chunker
from .entity_extractor import EntityExtractor
from .fact_extractor import FactExtractor

__all__ = [
    "IngestionPipeline",
    "Normalizer",
    "Deduper",
    "Chunker",
    "EntityExtractor",
    "FactExtractor",
]
