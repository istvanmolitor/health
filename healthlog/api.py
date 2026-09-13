from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from rest_framework import status, viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import RegisterForm
from .models import HealthEntry
from .serializers import HealthEntrySerializer, UserSerializer


class HealthEntryViewSet(viewsets.ModelViewSet):
    queryset = HealthEntry.objects.all()
    serializer_class = HealthEntrySerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]


class CurrentUserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'authenticated': False})
        return Response({'authenticated': True, 'user': UserSerializer(request.user).data})


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        form = AuthenticationForm(request._request, data=request.data)
        if not form.is_valid():
            return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
        login(request._request, form.get_user())
        return Response({'user': UserSerializer(form.get_user()).data})


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        form = RegisterForm(request.data)
        if not form.is_valid():
            return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
        user = form.save()
        login(request._request, user)
        return Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request._request)
        return Response(status=status.HTTP_204_NO_CONTENT)
