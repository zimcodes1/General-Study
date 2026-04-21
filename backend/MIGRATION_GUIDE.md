# Phase 3 Models - Migration Guide

## Run Migrations

Execute these commands in order:

```bash
cd backend

# Create migrations for all apps
python manage.py makemigrations resources
python manage.py makemigrations catalogues
python manage.py makemigrations progress
python manage.py makemigrations assessments
python manage.py makemigrations gamification

# Apply all migrations
python manage.py migrate

# Verify migrations
python manage.py showmigrations
```

## Expected Output

You should see migrations created for:
- ✅ resources (Resource, Review, Bookmark models)
- ✅ catalogues (Catalogue model)
- ✅ progress (Progress model)
- ✅ assessments (Assessment model)
- ✅ gamification (Gamification model)

## Access Admin Panel

```bash
# Start server
python manage.py runserver

# Visit admin panel
http://localhost:8000/admin
```

You should now see these sections in admin:
- **RESOURCES**
  - Resources
  - Reviews
  - Bookmarks
- **CATALOGUES**
  - Catalogues
- **PROGRESS**
  - Progress
- **ASSESSMENTS**
  - Assessments
- **GAMIFICATION**
  - Gamifications
- **USERS**
  - Users
  - Faculties
  - Departments

## Test Data Creation (Optional)

You can create test data through the admin panel or Django shell:

```python
python manage.py shell

from users.models import User
from users.faculty_models import Faculty, Department
from resources.models import Resource

# Get a user
user = User.objects.first()

# Get faculty and department
faculty = Faculty.objects.get(name='Natural and Applied Sciences')
department = Department.objects.get(name='Computer Science', faculty=faculty)

# Create a test resource
resource = Resource.objects.create(
    title='Introduction to Python Programming',
    course_code='CSC 101',
    course_name='Introduction to Computer Science',
    faculty=faculty,
    department=department,
    level='100',
    file_url='https://example.com/python-intro.pdf',
    file_type='pdf',
    uploaded_by=user,
    status='approved'
)

print(f"Created resource: {resource}")
```

## Troubleshooting

### Issue: Migration conflicts
**Solution:** Delete migration files (except `__init__.py`) and recreate:
```bash
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
python manage.py makemigrations
python manage.py migrate
```

### Issue: Foreign key constraint errors
**Solution:** Ensure faculties and departments are populated:
```bash
python manage.py populate_faculties
```

### Issue: Models not showing in admin
**Solution:** Restart the Django server:
```bash
# Stop server (Ctrl+C)
python manage.py runserver
```

## Next Steps

After successful migration:
1. ✅ Models are created
2. ✅ Admin panel is configured
3. ⏭️ Create serializers for API
4. ⏭️ Create views and endpoints
5. ⏭️ Implement file upload
6. ⏭️ Integrate AI for catalogue generation
