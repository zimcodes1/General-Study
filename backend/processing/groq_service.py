"""
Groq API service for AI-powered content processing.
Handles summarization, topic extraction, and quiz generation.
"""

import json
import logging
from typing import Dict, List, Any, Optional
from django.conf import settings

try:
    from groq import Groq
except ImportError:
    raise ImportError("groq package not installed. Run: pip install groq")

logger = logging.getLogger(__name__)


class GroqService:
    """Service for interacting with Groq API."""

    def __init__(self):
        """Initialize Groq client with API key from settings."""
        self.api_key = getattr(settings, 'GROQ_API_KEY', None)
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not configured in Django settings")
        self.client = Groq(api_key=self.api_key)
        self.model = getattr(settings, "GROQ_MODEL", None) or "llama-3.1-70b-versatile"
        self.max_tokens = 2000

    def process_chunk(self, text_chunk: str, chunk_index: int) -> Dict[str, Any]:
        """
        Process a single text chunk and extract structured information.

        Args:
            text_chunk: Text to process
            chunk_index: Index of chunk (for logging)

        Returns:
            Dictionary with keys: subtopics, summaries, quiz_questions
            Example: {
                "subtopics": ["Topic 1", "Topic 2"],
                "summaries": ["Summary 1", "Summary 2"],
                "quiz_questions": [
                    {
                        "question": "What is...",
                        "options": ["A", "B", "C", "D"],
                        "answer": "A"
                    }
                ]
            }
        """
        try:
            logger.info(f"Processing chunk {chunk_index} ({len(text_chunk)} chars)")

            prompt = self._build_prompt(text_chunk)
            messages = [
                {
                    "role": "system",
                    "content": "You are an academic assistant specializing in educational content. "
                    "Return ONLY valid JSON. No markdown, no extra text.",
                },
                {"role": "user", "content": prompt},
            ]

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.3,  # Lower temp for consistency
                max_tokens=self.max_tokens,
            )
            choices = getattr(response, "choices", []) or []
            content = choices[0].message.content if choices else ""
            usage = getattr(response, "usage", None)

            if not content:
                raise ValueError("Groq returned empty content")

            # Log token usage when available
            if usage:
                prompt_tokens = getattr(usage, "prompt_tokens", None)
                completion_tokens = getattr(usage, "completion_tokens", None)
                if prompt_tokens is not None and completion_tokens is not None:
                    logger.info(
                        f"Chunk {chunk_index} processed - "
                        f"Input: {prompt_tokens}, Output: {completion_tokens} tokens"
                    )

            # Parse and validate JSON
            result = self._parse_response(content)
            return result

        except Exception as e:
            logger.error(f"Groq API call failed for chunk {chunk_index}: {e}")
            raise

    @staticmethod
    def _build_prompt(text_chunk: str) -> str:
        """Build the prompt for Groq API."""
        return f"""Analyze the following study material and extract structured learning content.

INPUT TEXT:
{text_chunk}

Return ONLY a valid JSON object with this exact structure:
{{
    "subtopics": ["Topic 1", "Topic 2", "Topic 3"],
    "summaries": ["Summary for topic 1", "Summary for topic 2", "Summary for topic 3"],
    "quiz_questions": [
        {{
            "question": "What is the main concept of topic 1?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Option A",
            "explanation": "Explanation of why this is correct"
        }}
    ]
}}

RULES:
- Extract 2-4 main subtopics from the text
- Create concise summaries (1-2 sentences each)
- Generate 1-2 multiple choice questions
- Summaries must be clear and educational
- Quiz options must be plausible distractors
- Ensure topics are in logical order
- Use simple, clear language

Return ONLY the JSON object. No extra text or markdown."""

    @staticmethod
    def _parse_response(content: str) -> Dict[str, Any]:
        """
        Parse Groq response and validate structure.

        Args:
            content: Raw response from Groq API

        Returns:
            Parsed dictionary with validated structure

        Raises:
            ValueError: If JSON is invalid or missing required fields
        """
        try:
            # Clean the response (remove markdown code blocks if present)
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            # Parse JSON
            data = json.loads(content)

            # Validate required fields
            required_fields = ["subtopics", "summaries", "quiz_questions"]
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")

            # Validate types
            if not isinstance(data["subtopics"], list):
                raise ValueError("subtopics must be a list")
            if not isinstance(data["summaries"], list):
                raise ValueError("summaries must be a list")
            if not isinstance(data["quiz_questions"], list):
                raise ValueError("quiz_questions must be a list")

            # Validate quiz structure
            for idx, quiz in enumerate(data["quiz_questions"]):
                if not isinstance(quiz, dict):
                    raise ValueError(f"quiz_questions[{idx}] must be an object")
                required_quiz_fields = ["question", "options", "answer"]
                for field in required_quiz_fields:
                    if field not in quiz:
                        raise ValueError(f"quiz_questions[{idx}] missing {field}")

            logger.debug(f"Response parsed successfully: {len(data['subtopics'])} topics, "
                        f"{len(data['quiz_questions'])} questions")
            return data

        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}\nContent: {content[:200]}")
            raise ValueError(f"Invalid JSON response from Groq: {e}") from e

    def process_chunks(self, chunks: List[str]) -> Dict[str, Any]:
        """
        Process multiple chunks and combine results.

        Args:
            chunks: List of text chunks

        Returns:
            Combined result with all topics, summaries, and questions
        """
        logger.info(f"Processing {len(chunks)} chunks")
        all_subtopics = []
        all_summaries = []
        all_questions = []

        for idx, chunk in enumerate(chunks):
            try:
                result = self.process_chunk(chunk, idx)
                all_subtopics.extend(result.get("subtopics", []))
                all_summaries.extend(result.get("summaries", []))
                all_questions.extend(result.get("quiz_questions", []))
            except Exception as e:
                logger.error(f"Failed to process chunk {idx}: {e}")
                raise

        return {
            "subtopics": all_subtopics,
            "summaries": all_summaries,
            "quiz_questions": all_questions,
        }
