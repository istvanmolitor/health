from django import forms

from .models import HealthEntry


class HealthEntryForm(forms.ModelForm):
    class Meta:
        model = HealthEntry
        fields = ['date', 'weight_kg', 'sleep_hours', 'mood', 'notes']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'notes': forms.Textarea(attrs={'rows': 3}),
        }
