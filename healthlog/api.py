from rest_framework import viewsets

from .models import HealthEntry
from .serializers import HealthEntrySerializer


class HealthEntryViewSet(viewsets.ModelViewSet):
    queryset = HealthEntry.objects.all()
    serializer_class = HealthEntrySerializer
    authentication_classes = []
    permission_classes = []
