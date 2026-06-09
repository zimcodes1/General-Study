import os
import sys
import django

# Add the current directory (project root) to Python's search path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment manually
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

def set_user_staff():
    # Check if the email argument was passed in the terminal
    if len(sys.argv) < 2:
        print("Error: Please provide an email address.")
        print("Usage: python scripts/set_user_staff.py user@example.com")
        sys.exit(1)

    email_input = sys.argv[1]

    try:
        user = User.objects.get(email=email_input)
        
        if user.is_staff:
            print(f"User {user.email} is already a staff member.")
            return

        user.is_staff = True
        user.save()
        print(f"User {user.email} is_staff set to True")

    except User.DoesNotExist:
        print(f"Error: User with email '{email_input}' does not exist.")

if __name__ == '__main__':
    set_user_staff()
