from django.contrib import admin

from .models import HealthEntry


@admin.register(HealthEntry)
class HealthEntryAdmin(admin.ModelAdmin):
    list_display = ('date', 'weight_kg', 'sleep_hours', 'mood')
    list_filter = ('mood',)
    ordering = ('-date',)
