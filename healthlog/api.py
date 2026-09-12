from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import HealthEntry
from .serializers import HealthEntrySerializer


class HealthEntryViewSet(viewsets.ModelViewSet):
    queryset = HealthEntry.objects.all()
    serializer_class = HealthEntrySerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
