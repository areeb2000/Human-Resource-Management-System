"""
serializers.py — DRF serializers for Employee and Attendance models.
"""

from django.utils import timezone
from rest_framework import serializers

from .models import Employee, Attendance


class EmployeeSerializer(serializers.ModelSerializer):
    """Serializes all Employee fields for API responses."""

    class Meta:
        model = Employee
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializes Attendance records and includes read-only fields
    pulled from the related Employee (name, employee_id, department)
    so the frontend doesn't need a second API call.
    """

    # Read-only fields sourced from the related Employee object
    employee_name       = serializers.ReadOnlyField(source='employee.full_name')
    employee_emp_id     = serializers.ReadOnlyField(source='employee.employee_id')
    employee_department = serializers.ReadOnlyField(source='employee.department')

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee',
            'employee_name',
            'employee_emp_id',
            'employee_department',
            'date',
            'status',
        ]

    def validate(self, data):
        """
        Business rules:
        1. Attendance cannot be recorded for a future date.
        2. A duplicate record cannot be created for the same employee + date
           (use the Edit / PATCH flow to change an existing record instead).

        Note: on PATCH requests the 'date' field may be absent from `data`,
        so we guard with data.get() before applying date-based checks.
        """
        date = data.get('date')

        if date:
            if date > timezone.now().date():
                raise serializers.ValidationError(
                    "Attendance cannot be marked for future dates."
                )

            # Duplicate check only applies when creating a brand-new record
            if self.instance is None:
                duplicate = Attendance.objects.filter(
                    employee=data['employee'],
                    date=date,
                ).first()

                if duplicate:
                    raise serializers.ValidationError(
                        f"Attendance already marked as '{duplicate.status}' for this employee "
                        f"on {date}. Use the Edit button to update the existing record."
                    )

        return data
