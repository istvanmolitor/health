from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Seed default users (admin/admin superuser).'

    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={'is_staff': True, 'is_superuser': True},
        )
        user.set_password('admin')
        user.is_staff = True
        user.is_superuser = True
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS('Created admin user (admin/admin).'))
        else:
            self.stdout.write(self.style.SUCCESS('Updated existing admin user password.'))
