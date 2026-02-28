"""
models.py — Database models for HRMS Lite.

Two models are defined:
  Employee   — stores basic employee profile information
  Attendance — stores a daily attendance record per employee
"""

from django.db import models


class Employee(models.Model):
    """
    Represents a company employee.

    Fields:
        employee_id  — unique identifier assigned by HR (e.g. "EMP001")
        full_name    — employee's full legal name
        email        — unique work email address
        department   — department the employee belongs to (e.g. "Engineering")
        created_at   — timestamp when the record was first created
    """

    employee_id = models.CharField(max_length=20, unique=True)
    full_name   = models.CharField(max_length=100)
    email       = models.EmailField(unique=True)
    department  = models.CharField(max_length=50)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.employee_id})"


class Attendance(models.Model):
    """
    Records whether an employee was Present or Absent on a given date.
    Only one record is allowed per employee per date (enforced by unique_together).
    """

    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent',  'Absent'),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='attendance_records',
    )
    date   = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        # Prevents duplicate attendance records for the same employee on the same day
        unique_together = ('employee', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.employee.full_name} — {self.date} — {self.status}"
