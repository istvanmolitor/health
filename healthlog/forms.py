from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import HealthEntry


class HealthEntryForm(forms.ModelForm):
    class Meta:
        model = HealthEntry
        fields = ['date', 'weight_kg', 'sleep_hours', 'mood', 'notes']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }


class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username']
