from rest_framework import serializers

from .models import HealthEntry


class HealthEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthEntry
        fields = ['id', 'date', 'weight_kg', 'sleep_hours', 'mood', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']
