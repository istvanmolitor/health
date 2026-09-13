"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path, re_path
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from healthlog.api import CurrentUserView, HealthEntryViewSet, LoginView, LogoutView, RegisterView

router = DefaultRouter()
router.register('entries', HealthEntryViewSet, basename='healthentry')

admin_spa = ensure_csrf_cookie(TemplateView.as_view(template_name='healthlog/admin_spa.html'))

urlpatterns = [
    path('api/auth/user/', CurrentUserView.as_view(), name='api-current-user'),
    path('api/auth/login/', LoginView.as_view(), name='api-login'),
    path('api/auth/register/', RegisterView.as_view(), name='api-register'),
    path('api/auth/logout/', LogoutView.as_view(), name='api-logout'),
    path('api/', include(router.urls)),
    path('admin/', admin_spa),
    re_path(r'^admin/.+$', admin_spa),
    path('', include('healthlog.urls')),
]
