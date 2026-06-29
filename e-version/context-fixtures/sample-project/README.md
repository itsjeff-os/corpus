# Sample Project

## Overview

This is a sample project fixture for testing ingestion and retrieval.

## Goals

- Demonstrate multi-source context ingestion
- Validate entity extraction (Device, Network, Service, Project)
- Test conflict detection across sources

## Architecture

- Backend: Python FastAPI
- Database: PostgreSQL + pgvector
- Cache: Redis
- Search: Meilisearch

## Decisions

### 2026-04-01: Use pgvector for embeddings

We chose pgvector over Pinecone to keep the stack local-first and avoid
vendor lock-in. pgvector supports HNSW indexes from version 0.7+.

### 2026-04-15: Use Meilisearch for lexical search

Meilisearch provides BM25 + typo tolerance for lexical search. It is
self-hostable and has a simple API.
