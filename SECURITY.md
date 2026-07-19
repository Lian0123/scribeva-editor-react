# Security

Security issues should be reported privately to the repository maintainers
rather than opened as public issues.

This package delegates HTML sanitization, URL policy, paste normalization, and
serialization to `scribeva-editor`. Applications must still validate and
sanitize content on the server, enforce authorization, and use a suitable
Content Security Policy. Blob image URLs are local previews and must be
replaced with durable application URLs before persistence.
