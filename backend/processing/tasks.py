"""
Celery tasks for resource processing and catalogue generation.
"""

import logging
from typing import Dict, Any
from datetime import datetime

from django.utils import timezone
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

from resources.models import Resource
from catalogues.models import Catalogue, Topic, QuizQuestion
from processing.file_extractors import extract_text_from_file
from processing.groq_service import GroqService
from processing.validators import validate_groq_response

logger = logging.getLogger(__name__)


def chunk_text(text: str, max_chars: int = 3000) -> list:
    """
    Split text into chunks for processing.

    Args:
        text: Full text to chunk
        max_chars: Maximum characters per chunk

    Returns:
        List of text chunks
    """
    if not text or len(text) == 0:
        return []
    chunks = [text[i : i + max_chars] for i in range(0, len(text), max_chars)]
    logger.info(f"Split {len(text)} chars into {len(chunks)} chunks")
    return chunks


@shared_task(bind=True, max_retries=0)
def extract_text_from_resource(self, resource_id: str) -> Dict[str, Any]:
    """
    Extract text from uploaded resource file.

    Args:
        resource_id: UUID of Resource object

    Returns:
        Dictionary with extraction status and text length
    """
    try:
        logger.warning(f"[EXTRACT] ⚠️  TASK STARTED: extract_text_from_resource for {resource_id}")
        resource = Resource.objects.get(id=resource_id)
        logger.warning(f"[EXTRACT] ✅ Resource found: {resource.title}, File: {resource.file}")

        if not resource.file:
            raise ValueError("Resource has no file attached")

        # Get file path and type
        file_path = resource.file.path
        file_type = resource.file_type
        logger.warning(f"[EXTRACT] 📁 File path: {file_path}, Type: {file_type}")

        # Extract text
        logger.warning(f"[EXTRACT] 🔄 Extracting text...")
        raw_text = extract_text_from_file(file_path, file_type)
        logger.warning(f"[EXTRACT] ✅ Text extracted: {len(raw_text)} characters")

        # Save extracted text to resource
        resource.raw_text = raw_text
        resource.processing_started_at = timezone.now()
        resource.save(update_fields=['raw_text', 'processing_started_at'])
        logger.warning(f"[EXTRACT] 💾 Text saved to database")

        result = {
            "status": "success",
            "text_length": len(raw_text),
            "resource_id": str(resource_id),
        }
        logger.warning(f"[EXTRACT] ✅ TASK COMPLETE: {result}")
        return result

    except Exception as e:
        logger.error(f"[EXTRACT] ❌ TASK FAILED: {e}", exc_info=True)
        _notify_admin_failure(resource_id, f"Text extraction failed: {str(e)}")
        raise


@shared_task(bind=True, max_retries=0)
def chunk_and_process_with_groq(self, resource_id: str) -> Dict[str, Any]:
    """
    Chunk extracted text and send to Groq API for processing.

    Args:
        resource_id: UUID of Resource object

    Returns:
        Dictionary with processed content from Groq
    """
    try:
        logger.warning(f"[GROQ] ⚠️  TASK STARTED: chunk_and_process_with_groq for {resource_id}")
        resource = Resource.objects.get(id=resource_id)
        logger.warning(f"[GROQ] ✅ Resource found: {resource.title}")

        if not resource.raw_text:
            raise ValueError("Resource has no extracted text")

        # Initialize Groq service
        logger.warning(f"[GROQ] 🤖 Initializing Groq service...")
        groq_service = GroqService()

        # Chunk text
        logger.warning(f"[GROQ] ✂️  Chunking text...")
        chunks = chunk_text(resource.raw_text, max_chars=3000)
        if not chunks:
            raise ValueError("Text chunking resulted in empty chunks")
        logger.warning(f"[GROQ] ✅ Created {len(chunks)} chunks from {len(resource.raw_text)} chars")

        # Process chunks with Groq
        logger.warning(f"[GROQ] 🔄 Processing {len(chunks)} chunks with Groq API...")
        groq_data = groq_service.process_chunks(chunks)
        logger.warning(f"[GROQ] ✅ Groq processing complete")

        logger.warning(
            f"[GROQ] 📊 Response: {len(groq_data.get('subtopics', []))} topics, "
            f"{len(groq_data.get('quiz_questions', []))} questions"
        )

        logger.warning(f"[GROQ] ✅ TASK COMPLETE")
        return groq_data

    except Exception as e:
        logger.error(f"[GROQ] ❌ TASK FAILED: {e}", exc_info=True)
        _notify_admin_failure(resource_id, f"Groq processing failed: {str(e)}")
        raise


@shared_task(bind=True, max_retries=0)
def create_catalogue(self, resource_id: str, groq_data: Dict[str, Any]) -> Dict[str, str]:
    """
    Validate Groq response and create Catalogue object.

    Args:
        resource_id: UUID of Resource object
        groq_data: Dictionary from Groq API with subtopics, summaries, quiz_questions

    Returns:
        Dictionary with success status and catalogue_id
    """
    try:
        logger.warning(f"[CATALOGUE] ⚠️  TASK STARTED: create_catalogue for {resource_id}")
        resource = Resource.objects.get(id=resource_id)
        logger.warning(f"[CATALOGUE] ✅ Resource found: {resource.title}")

        # Validate Groq response
        logger.warning(f"[CATALOGUE] 🔍 Validating Groq response...")
        is_valid, error_msg = validate_groq_response(groq_data)
        if not is_valid:
            raise ValueError(f"Validation failed: {error_msg}")
        logger.warning(f"[CATALOGUE] ✅ Validation passed")

        # Create summary from first few summaries
        summary_text = " ".join(groq_data.get("summaries", [])[:3])
        logger.warning(f"[CATALOGUE] 📝 Summary created: {len(summary_text)} chars")

        # Create Catalogue
        logger.warning(f"[CATALOGUE] 💾 Creating Catalogue object...")
        catalogue = Catalogue.objects.create(
            resource=resource,
            title=resource.title,
            summary=summary_text,
            content_json=groq_data,  # JSONField stores the full structured data
        )
        logger.warning(f"[CATALOGUE] ✅ Catalogue created: {catalogue.id}")

        # Create Topics and Quiz Questions
        _populate_topics_from_groq(catalogue, groq_data)

        # Update resource status to pending (awaiting admin approval)
        logger.warning(f"[CATALOGUE] 📊 Updating resource status to 'pending'...")
        resource.status = "pending"
        resource.processing_completed_at = timezone.now()
        resource.save(update_fields=['status', 'processing_completed_at'])
        logger.warning(f"[CATALOGUE] ✅ Resource status updated")

        # Notify admin that resource is ready for review
        logger.warning(f"[CATALOGUE] 📧 Sending admin notification...")
        _notify_admin_success(resource_id, catalogue.id)
        logger.warning(f"[CATALOGUE] ✅ Admin notified")

        result = {
            "status": "success",
            "catalogue_id": str(catalogue.id),
            "resource_id": str(resource_id),
        }
        logger.warning(f"[CATALOGUE] ✅ TASK COMPLETE: {result}")
        return result

    except Exception as e:
        logger.error(f"[CATALOGUE] ❌ TASK FAILED: {e}", exc_info=True)
        _notify_admin_failure(resource_id, f"Catalogue creation failed: {str(e)}")
        raise


@shared_task(bind=True, max_retries=0)
def process_resource_for_catalogue(self, resource_id: str) -> Dict[str, str]:
    """
    Process an existing resource to create a catalogue.
    Uses existing raw_text when available, otherwise extracts from file.
    """
    logger.warning(f"[PIPELINE] ⚠️  TASK STARTED: process_resource_for_catalogue for resource {resource_id}")
    try:
        resource = Resource.objects.get(id=resource_id)
        logger.warning(f"[PIPELINE] ✅ Resource retrieved: {resource.title}")

        if not resource.raw_text:
            if not resource.file:
                raise ValueError("Resource has no extracted text or file to process")

            logger.warning(f"[PIPELINE] 🔄 Extracting text from file...")
            extract_text_from_resource(resource_id)

        logger.warning(f"[PIPELINE] 🔄 Processing with Groq API...")
        groq_result = chunk_and_process_with_groq(resource_id)

        logger.warning(f"[PIPELINE] 🔄 Creating catalogue...")
        catalogue_result = create_catalogue(resource_id, groq_result)

        logger.warning(f"[PIPELINE] 🎉 ✅ PIPELINE COMPLETE FOR {resource_id}")
        return {
            "status": "complete",
            "resource_id": str(resource_id),
            "catalogue_id": catalogue_result.get("catalogue_id"),
        }

    except Exception as e:
        logger.error(f"[PIPELINE] 💥 PIPELINE FAILED for {resource_id}: {e}", exc_info=True)
        try:
            resource = Resource.objects.get(id=resource_id)
            resource.status = "failed"
            resource.processing_error = f"Processing failed: {str(e)}"
            resource.processing_completed_at = timezone.now()
            resource.save(
                update_fields=['status', 'processing_error', 'processing_completed_at']
            )
            logger.warning(f"[PIPELINE] 📝 Resource marked as failed: {resource_id}")
        except Exception as update_err:
            logger.error(f"[PIPELINE] ❌ Failed to update resource status: {update_err}", exc_info=True)

        _notify_admin_failure(resource_id, f"Pipeline failed: {str(e)}")
        return {
            "status": "failed",
            "resource_id": str(resource_id),
            "error": str(e),
        }


@shared_task(bind=True, max_retries=0)
def process_resource_upload(self, resource_id: str) -> Dict[str, str]:
    """
    Master task that orchestrates the entire resource processing pipeline.

    This task:
    1. Extracts text from file
    2. Chunks text and sends to Groq API
    3. Validates response
    4. Creates Catalogue
    5. Updates Resource status

    Args:
        resource_id: UUID of Resource object

    Returns:
        Final status dictionary
    """
    logger.warning(f"[PIPELINE] ⚠️  TASK STARTED: process_resource_upload for resource {resource_id}")
    
    try:
        logger.warning(f"[PIPELINE] 📦 Retrieving resource {resource_id}")
        resource = Resource.objects.get(id=resource_id)
        logger.warning(f"[PIPELINE] ✅ Resource retrieved: {resource.title}")

        logger.warning(f"[PIPELINE] 🔄 Step 1/3: Extracting text from file...")
        try:
            extraction_result = extract_text_from_resource(resource_id)
            logger.warning(f"[PIPELINE] ✅ Text extraction complete: {extraction_result}")
        except Exception as extract_err:
            logger.error(f"[PIPELINE] ❌ Extraction failed: {extract_err}", exc_info=True)
            raise ValueError(f"Text extraction failed: {str(extract_err)}")

        logger.warning(f"[PIPELINE] 🔄 Step 2/3: Processing with Groq API...")
        try:
            groq_result = chunk_and_process_with_groq(resource_id)
            logger.warning(f"[PIPELINE] ✅ Groq processing complete: {groq_result}")
        except Exception as groq_err:
            logger.error(f"[PIPELINE] ❌ Groq processing failed: {groq_err}", exc_info=True)
            raise ValueError(f"Groq processing failed: {str(groq_err)}")

        logger.warning(f"[PIPELINE] 🔄 Step 3/3: Creating catalogue...")
        try:
            catalogue_result = create_catalogue(resource_id, groq_result)
            logger.warning(f"[PIPELINE] ✅ Catalogue created: {catalogue_result}")
        except Exception as catalogue_err:
            logger.error(f"[PIPELINE] ❌ Catalogue creation failed: {catalogue_err}", exc_info=True)
            raise ValueError(f"Catalogue creation failed: {str(catalogue_err)}")

        logger.warning(f"[PIPELINE] 🎉 ✅ PIPELINE COMPLETE FOR {resource_id}")
        return {
            "status": "complete",
            "resource_id": str(resource_id),
            "catalogue_id": catalogue_result.get("catalogue_id"),
        }

    except Exception as e:
        logger.error(f"[PIPELINE] 💥 PIPELINE FAILED for {resource_id}: {e}", exc_info=True)
        
        # Update resource to failed status
        try:
            resource = Resource.objects.get(id=resource_id)
            resource.status = "failed"
            resource.processing_error = f"Processing failed: {str(e)}"
            resource.processing_completed_at = timezone.now()
            resource.save(
                update_fields=['status', 'processing_error', 'processing_completed_at']
            )
            logger.warning(f"[PIPELINE] 📝 Resource marked as failed: {resource_id}")
        except Exception as update_err:
            logger.error(f"[PIPELINE] ❌ Failed to update resource status: {update_err}", exc_info=True)

        # Notify admin of failure
        _notify_admin_failure(resource_id, f"Pipeline failed: {str(e)}")
        return {
            "status": "failed",
            "resource_id": str(resource_id),
            "error": str(e),
        }


def _notify_admin_failure(resource_id: str, error_message: str) -> None:
    """
    Notify admin of processing failure.

    Args:
        resource_id: UUID of failed Resource
        error_message: Error description
    """
    try:
        resource = Resource.objects.get(id=resource_id)
        admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@example.com')

        subject = f"Resource Upload Failed: {resource.title}"
        message = f"""
Resource Upload Processing Failed

Resource: {resource.title}
Course: {resource.course_code} - {resource.course_name}
Uploaded by: {resource.uploaded_by.full_name}
Error: {error_message}
Timestamp: {timezone.now()}

Please investigate and contact the user if necessary.

Resource ID: {resource.id}
"""

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            fail_silently=True,  # Don't raise if email fails
        )
        logger.info(f"Admin failure notification sent for {resource_id}")

    except Exception as e:
        logger.error(f"Failed to send admin failure notification: {e}")


def _notify_admin_success(resource_id: str, catalogue_id: str) -> None:
    """
    Notify admin that resource is ready for review.

    Args:
        resource_id: UUID of processed Resource
        catalogue_id: UUID of created Catalogue
    """
    try:
        resource = Resource.objects.get(id=resource_id)
        admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@example.com')

        # Get summary of first few lines of summary
        catalogue = Catalogue.objects.get(id=catalogue_id)
        summary_preview = (catalogue.summary[:200] + "...") if catalogue.summary else "No summary"

        subject = f"New Resource Ready for Review: {resource.title}"
        message = f"""
New Resource Uploaded and Processed

Resource: {resource.title}
Course: {resource.course_code} - {resource.course_name}
Faculty: {resource.faculty.name}
Level: {resource.level}
Uploaded by: {resource.uploaded_by.full_name}

Summary:
{summary_preview}

Status: Pending Admin Approval

Action Required: Review the generated catalogue and approve or reject this resource.

Resource ID: {resource.id}
Catalogue ID: {catalogue.id}
"""

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            fail_silently=True,
        )
        logger.info(f"Admin success notification sent for {resource_id}")

    except Exception as e:
        logger.error(f"Failed to send admin success notification: {e}")


def _populate_topics_from_groq(catalogue: Catalogue, groq_data: Dict[str, Any]) -> None:
    subtopics = groq_data.get('subtopics', [])
    summaries = groq_data.get('summaries', [])
    quiz_questions = groq_data.get('quiz_questions', [])

    if not subtopics:
        return

    created_topics = []
    for order, subtopic_title in enumerate(subtopics):
        summary = summaries[order] if order < len(summaries) else ''
        topic, _ = Topic.objects.get_or_create(
            catalogue=catalogue,
            order=order,
            defaults={
                'title': subtopic_title,
                'content': summary,
                'summary': summary,
            }
        )
        created_topics.append(topic)

    if quiz_questions and created_topics:
        questions_per_topic = max(1, len(quiz_questions) // len(created_topics))
        for question_order, question_data in enumerate(quiz_questions):
            topic_index = min(question_order // questions_per_topic, len(created_topics) - 1)
            topic = created_topics[topic_index]

            question_text = question_data.get('question', '')
            options = question_data.get('options', [])
            correct_answer = question_data.get('answer', '')
            explanation = question_data.get('explanation', '')

            QuizQuestion.objects.get_or_create(
                topic=topic,
                question=question_text,
                defaults={
                    'options': options,
                    'correct_answer': correct_answer,
                    'explanation': explanation,
                    'order': question_order % questions_per_topic,
                }
            )
