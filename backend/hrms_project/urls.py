"""
urls.py — Root URL configuration for the HRMS Lite Django project.

URL patterns:
  /           → api_root  (shows available endpoints in browser)
  /admin/     → Django admin panel
  /api/       → All REST API endpoints (employees, attendance, stats)
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    """
    Returns a friendly JSON overview when someone visits the root URL.
    Useful during development to quickly see what endpoints are available.
    """
    return JsonResponse({
        'message': 'HRMS Lite API is running ✅',
        'version': '1.0.0',
        'endpoints': {
            'admin':                '/admin/',
            'employees':            '/api/employees/',
            'attendance':           '/api/attendance/',
            'attendance_statistics': '/api/attendance/statistics/',
            'dashboard_stats':      '/api/attendance/dashboard_stats/',
        },
    })


urlpatterns = [
    path('',       api_root,             name='api-root'),
    path('admin/', admin.site.urls),
    path('api/',   include('employees.urls')),
]
