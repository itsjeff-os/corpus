# Staging and audit data

This directory is the service's only writable persistent surface. It contains
pending change sets, approval records, execution reports, and JSONL audit
events. It must not contain credentials or live service data.

