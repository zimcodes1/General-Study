import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

user_id = 'fb2904f66398495191cbb737d88ca5ca'
user = User.objects.get(id=user_id)
user.is_staff = True
user.save()
print(f"User {user.email} is_staff set to True")
