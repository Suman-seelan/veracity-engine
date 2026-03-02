"""
utils/logger.py
────────────────
Structured JSON logging middleware + root logger configuration.
"""

from __future__ import annotations

import logging
import time
import uuid

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


def configure_logging(level: str = "INFO") -> None:
    """
    Set up the root/app logger with a consistent format.
    In production swap the handler for a JSON log sink.
    """
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs every request with:
      • method, path, status code
      • wall-clock latency in ms
      • unique request ID (echoed as X-Request-ID header)
    """

    logger = logging.getLogger("veracity.access")

    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = str(uuid.uuid4())[:8]
        start = time.perf_counter()

        response: Response = await call_next(request)

        elapsed_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{elapsed_ms:.1f}ms"

        self.logger.info(
            "[%s] %s %s → %d  (%.1f ms)",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response
