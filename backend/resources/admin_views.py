"""
Admin-specific API views for resource and report management.
All views require is_staff=True.
"""

import logging
from datetime import timedelta

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from resources.models import Resource, Report
from resources.serializers import ResourceListSerializer
from users.models import User

logger = logging.getLogger(__name__)


def require_staff(request):
    """Return a 403 Response if not staff, else None."""
    if not request.user.is_staff:
        return Response(
            {"detail": "Admin access required."},
            status=status.HTTP_403_FORBIDDEN,
        )
    return None


# ──────────────────────────────────────────────
# Admin Stats
# ──────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    """
    Return overview stats for the admin dashboard.
    """
    err = require_staff(request)
    if err:
        return err

    today = timezone.now().date()
    thirty_days_ago = timezone.now() - timedelta(days=30)

    total_resources = Resource.objects.count()
    pending_approvals = Resource.objects.filter(status="pending").count()
    approved_today = Resource.objects.filter(
        status="approved", updated_at__date=today
    ).count()
    total_users = User.objects.count()
    active_users = User.objects.filter(last_active_date__gte=thirty_days_ago.date()).count()
    open_reports = Report.objects.filter(status="open").count()

    return Response(
        {
            "total_resources": total_resources,
            "pending_approvals": pending_approvals,
            "approved_today": approved_today,
            "total_users": total_users,
            "active_users": active_users,
            "open_reports": open_reports,
        },
        status=status.HTTP_200_OK,
    )


# ──────────────────────────────────────────────
# Admin Resource Management
# ──────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_resource_list(request):
    """
    Paginated list of all resources with optional status filter and search.
    Query params: status (all|pending|approved|rejected), search, limit, offset
    """
    err = require_staff(request)
    if err:
        return err

    filter_status = request.query_params.get("status", "all")
    search = request.query_params.get("search", "").strip()
    limit = int(request.query_params.get("limit", 20))
    offset = int(request.query_params.get("offset", 0))

    queryset = Resource.objects.select_related("uploaded_by", "faculty", "department").order_by("-created_at")

    if filter_status != "all":
        queryset = queryset.filter(status=filter_status)

    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(course_code__icontains=search)
        )

    total_count = queryset.count()
    paginated = queryset[offset: offset + limit]
    serializer = ResourceListSerializer(paginated, many=True)

    return Response(
        {
            "count": total_count,
            "limit": limit,
            "offset": offset,
            "results": serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_approve_resource(request, resource_id):
    """Approve a resource."""
    err = require_staff(request)
    if err:
        return err

    try:
        resource = Resource.objects.get(id=resource_id)
    except Resource.DoesNotExist:
        return Response({"detail": "Resource not found."}, status=status.HTTP_404_NOT_FOUND)

    resource.status = "approved"
    resource.save(update_fields=["status", "updated_at"])
    logger.info(f"Resource {resource.id} approved by admin {request.user.id}")
    return Response({"detail": f"Resource '{resource.title}' approved."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_reject_resource(request, resource_id):
    """Reject a resource with optional reason."""
    err = require_staff(request)
    if err:
        return err

    try:
        resource = Resource.objects.get(id=resource_id)
    except Resource.DoesNotExist:
        return Response({"detail": "Resource not found."}, status=status.HTTP_404_NOT_FOUND)

    reason = request.data.get("reason", "Rejected by admin")
    resource.status = "rejected"
    resource.processing_error = f"Admin rejection: {reason}"
    resource.save(update_fields=["status", "processing_error", "updated_at"])
    logger.info(f"Resource {resource.id} rejected by admin {request.user.id}")
    return Response({"detail": f"Resource '{resource.title}' rejected."}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def admin_delete_resource(request, resource_id):
    """Permanently delete a resource."""
    err = require_staff(request)
    if err:
        return err

    try:
        resource = Resource.objects.get(id=resource_id)
    except Resource.DoesNotExist:
        return Response({"detail": "Resource not found."}, status=status.HTTP_404_NOT_FOUND)

    title = resource.title
    resource.delete()
    logger.info(f"Resource '{title}' deleted by admin {request.user.id}")
    return Response({"detail": f"Resource '{title}' deleted."}, status=status.HTTP_200_OK)


# ──────────────────────────────────────────────
# Admin Resource Analytics
# ──────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_resource_analytics(request):
    """
    Return resource analytics:
    - Counts by status
    - Weekly uploads for the last 8 weeks
    """
    err = require_staff(request)
    if err:
        return err

    # Status breakdown
    status_counts = {
        "pending": Resource.objects.filter(status="pending").count(),
        "approved": Resource.objects.filter(status="approved").count(),
        "rejected": Resource.objects.filter(status="rejected").count(),
        "processing": Resource.objects.filter(status="processing").count(),
    }

    # Weekly uploads — last 8 weeks
    weeks = []
    now = timezone.now()
    for i in range(7, -1, -1):
        week_start = now - timedelta(weeks=i + 1)
        week_end = now - timedelta(weeks=i)
        count = Resource.objects.filter(created_at__gte=week_start, created_at__lt=week_end).count()
        weeks.append(
            {
                "week": week_start.strftime("%-d %b"),
                "count": count,
            }
        )

    return Response(
        {
            "status_breakdown": status_counts,
            "weekly_uploads": weeks,
        },
        status=status.HTTP_200_OK,
    )


# ──────────────────────────────────────────────
# Admin Reports Management
# ──────────────────────────────────────────────

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_report_list(request):
    """
    List reports. Supports ?status=open|dismissed|all&limit=&offset=
    """
    err = require_staff(request)
    if err:
        return err

    filter_status = request.query_params.get("status", "all")
    limit = int(request.query_params.get("limit", 20))
    offset = int(request.query_params.get("offset", 0))

    queryset = Report.objects.select_related("resource", "reported_by").order_by("-created_at")

    if filter_status != "all":
        queryset = queryset.filter(status=filter_status)

    total_count = queryset.count()
    paginated = queryset[offset: offset + limit]

    data = [
        {
            "id": str(r.id),
            "resource_id": str(r.resource.id),
            "resource_title": r.resource.title,
            "course_code": r.resource.course_code,
            "reason": r.reason,
            "reported_by": r.reported_by.full_name if r.reported_by else "Anonymous",
            "date_reported": r.created_at.strftime("%-d %b, %Y"),
            "status": r.status,
        }
        for r in paginated
    ]

    return Response(
        {"count": total_count, "limit": limit, "offset": offset, "results": data},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_dismiss_report(request, report_id):
    """Mark a report as dismissed."""
    err = require_staff(request)
    if err:
        return err

    try:
        report = Report.objects.get(id=report_id)
    except Report.DoesNotExist:
        return Response({"detail": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

    report.status = "dismissed"
    report.save(update_fields=["status", "updated_at"])
    return Response({"detail": "Report dismissed."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_resolve_report_remove_resource(request, report_id):
    """Resolve report by deleting the reported resource."""
    err = require_staff(request)
    if err:
        return err

    try:
        report = Report.objects.get(id=report_id)
    except Report.DoesNotExist:
        return Response({"detail": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

    resource_title = report.resource.title
    # Delete the resource (cascades to report)
    report.resource.delete()
    return Response(
        {"detail": f"Resource '{resource_title}' deleted and report resolved."},
        status=status.HTTP_200_OK,
    )
