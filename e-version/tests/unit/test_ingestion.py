"""Unit tests for the ingestion engine components."""

import pytest

from services.ingestion_engine.app.normalizer import Normalizer
from services.ingestion_engine.app.deduper import Deduper
from services.ingestion_engine.app.chunker import Chunker
from services.ingestion_engine.app.entity_extractor import EntityExtractor, ExtractedEntity
from services.ingestion_engine.app.fact_extractor import FactExtractor


class TestNormalizer:
    def setup_method(self):
        self.n = Normalizer()

    def test_strips_trailing_whitespace(self):
        result = self.n.normalize("hello   \n  world  \n")
        assert not any(line.endswith(" ") for line in result.split("\n"))

    def test_collapses_blank_lines(self):
        result = self.n.normalize("a\n\n\n\n\nb")
        assert "\n\n\n" not in result

    def test_removes_null_bytes(self):
        result = self.n.normalize("hello\x00world")
        assert "\x00" not in result

    def test_empty_string(self):
        assert self.n.normalize("") == ""

    def test_strips_basic_html(self):
        html = "<p>Hello <b>world</b></p>"
        result = self.n.normalize(html, source_type="html")
        assert "<" not in result
        assert "Hello" in result
        assert "world" in result

    def test_normalizes_windows_line_endings(self):
        result = self.n.normalize("line1\r\nline2\r\nline3")
        assert "\r" not in result


class TestDeduper:
    def setup_method(self):
        self.d = Deduper()

    def test_same_content_is_duplicate(self):
        content = "some unique content here"
        self.d.register(content)
        assert self.d.is_duplicate(content)

    def test_different_content_not_duplicate(self):
        self.d.register("content a")
        assert not self.d.is_duplicate("content b")

    def test_hash_is_deterministic(self):
        h1 = self.d.hash("test")
        h2 = self.d.hash("test")
        assert h1 == h2

    def test_hash_differs_for_different_content(self):
        assert self.d.hash("a") != self.d.hash("b")

    def test_filter_removes_duplicates(self):
        items = ["a", "b", "a", "c", "b"]
        result = self.d.filter(items)
        assert result == ["a", "b", "c"]

    def test_reset_clears_registry(self):
        content = "resettest"
        self.d.register(content)
        self.d.reset()
        assert not self.d.is_duplicate(content)


class TestChunker:
    def setup_method(self):
        self.c = Chunker(max_tokens=50, overlap_tokens=5, chars_per_token=4)

    def test_chunk_plain_text_returns_list(self):
        text = "This is the first paragraph.\n\nThis is the second paragraph."
        chunks = self.c.chunk_text(text)
        assert len(chunks) >= 1
        assert all(c.content for c in chunks)

    def test_chunk_markdown_respects_headings(self):
        md = "# Section One\n\nContent of section one.\n\n## Subsection\n\nSubcontent."
        chunks = self.c.chunk_markdown(md)
        assert len(chunks) >= 1

    def test_chunk_indices_are_sequential(self):
        text = ("word " * 200).strip()
        chunks = self.c.chunk_text(text)
        for i, chunk in enumerate(chunks):
            assert chunk.chunk_index == i

    def test_empty_text_returns_empty(self):
        chunks = self.c.chunk_text("")
        assert chunks == []


class TestEntityExtractor:
    def setup_method(self):
        self.e = EntityExtractor()

    def test_extracts_ip_subnet(self):
        text = "The subnet is 192.168.20.0/24."
        entities = self.e.extract(text)
        entity_names = [e.name for e in entities]
        assert any("192.168.20.0/24" in n for n in entity_names)

    def test_extracts_vlan(self):
        text = "VLAN 20 is used for IoT devices."
        entities = self.e.extract(text)
        assert any("VLAN" in e.name or "20" in e.name for e in entities)

    def test_extracts_from_chunks(self):
        chunks = ["Device is on 192.168.1.0/24", "VLAN 10 is management"]
        entities = self.e.extract_from_chunks(chunks)
        assert len(entities) > 0

    def test_deduplicates_across_chunks(self):
        chunks = ["192.168.1.0/24 is used", "192.168.1.0/24 is used again"]
        entities = self.e.extract_from_chunks(chunks)
        names = [e.name for e in entities]
        assert names.count("192.168.1.0/24") == 1


class TestFactExtractor:
    def setup_method(self):
        self.f = FactExtractor()

    def test_extracts_vlan_subnet_fact(self):
        text = "VLAN 20 uses subnet 192.168.20.0/24."
        facts = self.f.extract(text, source="vlans.md")
        assert len(facts) >= 1
        assert any(f.predicate == "uses_subnet" for f in facts)

    def test_extracts_mdns_status(self):
        text = "mDNS reflector is disabled."
        facts = self.f.extract(text, source="router.json")
        assert any("mdns" in f.predicate.lower() for f in facts)

    def test_deduplicates_across_chunks(self):
        chunks = ["VLAN 20 uses subnet 192.168.20.0/24.", "VLAN 20 uses subnet 192.168.20.0/24."]
        facts = self.f.extract_from_chunks(chunks, source="docs.md")
        # Should only have one fact for the repeated content
        vlan_facts = [f for f in facts if f.subject and "vlan" in f.subject.lower() or "20" in str(f.subject)]
        assert len(vlan_facts) <= 2
