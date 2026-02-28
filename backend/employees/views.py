"""
views.py — API views for the HRMS Lite application.

Two ViewSets are defined:
  - EmployeeViewSet  : handles CRUD for employee records
  - AttendanceViewSet: handles CRUD for attendance records, plus
                       custom endpoints for statistics and dashboard summary
"""

from django.utils import timezone
from django.db.models import Count, Q

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    Provides full CRUD operations for Employee records.
    Employees are returned alphabetically by full name.
    """
    queryset = Employee.objects.all().order_by('full_name')
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Optional search filter by name, employee_id, or department
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(employee_id__icontains=search) |
                Q(department__icontains=search)
            )
        return queryset


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    Handles attendance records.

    Supports filtering by employee, date range via query params:
      ?employee_id=<id>&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD

    Custom endpoints:
      GET /api/attendance/statistics/     — per-employee summary
      GET /api/attendance/dashboard_stats/ — today's summary for the Dashboard
    """
    queryset = Attendance.objects.all().select_related('employee').order_by('-date')
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by employee
        employee_id = self.request.query_params.get('employee_id', '').strip()
        if employee_id:
            queryset = queryset.filter(employee__id=employee_id)

        # Filter by date range
        start_date = self.request.query_params.get('start_date', '').strip()
        end_date = self.request.query_params.get('end_date', '').strip()
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

    def update(self, request, *args, **kwargs):
        """
        Support partial updates (PATCH) so callers can update just 'status'
        without resending the full record payload.
        """
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Returns a per-employee attendance breakdown:
        total days, present days, and absent days.
        Respects the same filters as the main list endpoint.
        """
        queryset = Attendance.objects.all()

        employee_id = request.query_params.get('employee_id', '').strip()
        start_date = request.query_params.get('start_date', '').strip()
        end_date = request.query_params.get('end_date', '').strip()

        if employee_id:
            queryset = queryset.filter(employee__id=employee_id)
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        stats = queryset.values(
            'employee__id',
            'employee__full_name',
            'employee__employee_id',
            'employee__department',
        ).annotate(
            total_days=Count('id'),
            present_days=Count('id', filter=Q(status='Present')),
            absent_days=Count('id', filter=Q(status='Absent')),
        ).order_by('employee__full_name')

        return Response(list(stats))

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Returns today's high-level attendance numbers for the Dashboard:
        total employees, how many are present, absent, and not yet marked.
        """
        today = timezone.now().date()
        total_employees = Employee.objects.count()

        today_records = Attendance.objects.filter(date=today)
        present_today = today_records.filter(status='Present').count()
        absent_today = today_records.filter(status='Absent').count()

        return Response({
            'total_employees':   total_employees,
            'present_today':     present_today,
            'absent_today':      absent_today,
            'not_marked_today':  total_employees - present_today - absent_today,
        })
