from django.db import models


class HealthEntry(models.Model):
    date = models.DateField(unique=True)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    sleep_hours = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    mood = models.PositiveSmallIntegerField(
        choices=[(1, '😞'), (2, '🙁'), (3, '😐'), (4, '🙂'), (5, '😄')],
        default=3,
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'{self.date} ({self.get_mood_display()})'
