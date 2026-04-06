"""
Validation utilities for Groq responses and resource processing.
"""

import logging
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)


class ValidationError(Exception):
    """Custom exception for validation errors."""
    pass


def validate_groq_response(data: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Validate Groq API response structure and content.

    Args:
        data: Dictionary from Groq API response

    Returns:
        Tuple of (is_valid, error_message)
        - is_valid: True if valid, False otherwise
        - error_message: Empty string if valid, error description if invalid
    """
    try:
        # Check required top-level fields
        required_fields = ["subtopics", "summaries", "quiz_questions"]
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"

        # Validate subtopics
        if not isinstance(data["subtopics"], list):
            return False, "subtopics must be a list"
        if len(data["subtopics"]) == 0:
            return False, "subtopics list cannot be empty"
        for idx, topic in enumerate(data["subtopics"]):
            if not isinstance(topic, str) or not topic.strip():
                return False, f"subtopics[{idx}] must be non-empty string"

        # Validate summaries
        if not isinstance(data["summaries"], list):
            return False, "summaries must be a list"
        if len(data["summaries"]) == 0:
            return False, "summaries list cannot be empty"
        for idx, summary in enumerate(data["summaries"]):
            if not isinstance(summary, str) or not summary.strip():
                return False, f"summaries[{idx}] must be non-empty string"
            if len(summary) < 10:
                return False, f"summaries[{idx}] too short (min 10 chars)"

        # Validate quiz_questions
        if not isinstance(data["quiz_questions"], list):
            return False, "quiz_questions must be a list"
        if len(data["quiz_questions"]) == 0:
            return False, "quiz_questions list cannot be empty"

        for idx, quiz in enumerate(data["quiz_questions"]):
            if not isinstance(quiz, dict):
                return False, f"quiz_questions[{idx}] must be an object"

            # Check required quiz fields
            required_quiz_fields = ["question", "options", "answer"]
            for field in required_quiz_fields:
                if field not in quiz:
                    return False, f"quiz_questions[{idx}] missing {field}"

            # Validate question
            if not isinstance(quiz["question"], str) or not quiz["question"].strip():
                return (False, f"quiz_questions[{idx}] question must be non-empty string")
            if len(quiz["question"]) < 10:
                return False, f"quiz_questions[{idx}] question too short (min 10 chars)"

            # Validate options
            if not isinstance(quiz["options"], list):
                return False, f"quiz_questions[{idx}] options must be a list"
            if len(quiz["options"]) < 2:
                return False, f"quiz_questions[{idx}] must have at least 2 options"
            if len(quiz["options"]) > 10:
                return False, f"quiz_questions[{idx}] too many options (max 10)"

            for opt_idx, option in enumerate(quiz["options"]):
                if not isinstance(option, str) or not option.strip():
                    return (False, f"quiz_questions[{idx}] options[{opt_idx}] must be non-empty string")

            # Validate answer
            if not isinstance(quiz["answer"], str) or not quiz["answer"].strip():
                return False, f"quiz_questions[{idx}] answer must be non-empty string"
            if quiz["answer"] not in quiz["options"]:
                return (
                    False,
                    f"quiz_questions[{idx}] answer '{quiz['answer']}' not in options",
                )

        logger.info("Groq response validation successful")
        return True, ""

    except Exception as e:
        logger.error(f"Validation error: {e}")
        return False, f"Validation error: {str(e)}"


def validate_file_upload(file_object, max_size_bytes: int = 50 * 1024 * 1024) -> Tuple[bool, str]:
    """
    Validate uploaded file.

    Args:
        file_object: Django UploadedFile object
        max_size_bytes: Maximum file size in bytes (default 50MB)

    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        # Check file size
        if file_object.size > max_size_bytes:
            max_mb = max_size_bytes / (1024 * 1024)
            return False, f"File too large (max {max_mb}MB)"

        # Check file extension is in allowed list
        allowed_extensions = {
            'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt',
            'jpg', 'jpeg', 'png', 'gif', 'webp'
        }
        filename = file_object.name.lower()
        if '.' not in filename:
            return False, "File has no extension"

        ext = filename.split('.')[-1]
        if ext not in allowed_extensions:
            return False, f"File type .{ext} not allowed"

        logger.info(f"File validation successful: {filename}")
        return True, ""

    except Exception as e:
        logger.error(f"File validation error: {e}")
        return False, f"File validation error: {str(e)}"


def validate_resource_metadata(data: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Validate resource metadata from upload request.

    Args:
        data: Dictionary with resource metadata

    Returns:
        Tuple of (is_valid, error_message)
    """
    try:
        required_fields = {
            'title': str,
            'course_code': str,
            'course_name': str,
            'faculty_id': str,
            'level': str,
        }

        for field, expected_type in required_fields.items():
            if field not in data:
                return False, f"Missing required field: {field}"
            if not isinstance(data[field], expected_type):
                return False, f"{field} must be {expected_type.__name__}"
            if isinstance(data[field], str) and not data[field].strip():
                return False, f"{field} cannot be empty"

        # Validate title length
        if len(data['title']) < 5:
            return False, "title must be at least 5 characters"
        if len(data['title']) > 255:
            return False, "title must be at most 255 characters"

        # Validate level is numeric
        try:
            int(data['level'])
        except ValueError:
            return False, "level must be numeric"

        logger.info("Resource metadata validation successful")
        return True, ""

    except Exception as e:
        logger.error(f"Metadata validation error: {e}")
        return False, f"Metadata validation error: {str(e)}"
