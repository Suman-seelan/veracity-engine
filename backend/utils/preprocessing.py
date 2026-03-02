"""
utils/preprocessing.py
───────────────────────
Text cleaning and URL-to-text scraping utilities.
"""

from __future__ import annotations

import re

import httpx
from bs4 import BeautifulSoup


def clean_text(text: str) -> str:
    """
    Normalise raw news text before tokenisation.

    Steps
    -----
    1. Collapse excessive whitespace / newlines
    2. Remove HTML tags that may have slipped through
    3. Strip leading/trailing whitespace
    """
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text)
    return text.strip()


async def fetch_url_content(url: str, timeout: float = 10.0) -> str:
    """
    Async HTTP GET → extract visible paragraph text via BeautifulSoup.

    Parameters
    ----------
    url : str
        Public news article URL.
    timeout : float
        Request timeout in seconds.

    Returns
    -------
    str
        Concatenated paragraph text, cleaned.

    Raises
    ------
    ValueError
        If the page returns no usable text.
    httpx.HTTPError
        On network / HTTP errors.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; VeracityEngine/1.0; +https://veracity-engine.ai)"
        )
    }
    async with httpx.AsyncClient(follow_redirects=True, timeout=timeout) as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "lxml")

    # Remove boilerplate elements
    for tag in soup(["script", "style", "nav", "header", "footer", "aside"]):
        tag.decompose()

    paragraphs = [p.get_text(separator=" ") for p in soup.find_all("p")]
    content = clean_text(" ".join(paragraphs))

    if len(content) < 50:
        raise ValueError(f"Could not extract readable content from URL: {url}")

    return content
