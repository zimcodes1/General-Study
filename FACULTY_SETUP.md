# Faculty and Department Integration - Setup Instructions

## Backend Setup

### 1. Create and Run Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 2. Populate Faculty and Department Data

```bash
python manage.py populate_faculties
```

This will create:
- 9 Faculties (Natural and Applied Sciences, Law, Agriculture, Engineering, Social Sciences, Arts, Education, Medicine, Management Sciences)
- 50+ Departments across all faculties

### 3. Update Existing Users (if any)

If you have existing users in the database, you'll need to manually assign them faculties and departments through the Django admin panel:

```bash
python manage.py createsuperuser  # If you haven't created one
python manage.py runserver
```

Visit `http://localhost:8000/admin` and update user records.

## Frontend Setup

No additional setup needed. The frontend will automatically:
- Fetch faculties on signup page load
- Load departments when a faculty is selected
- Display faculty/department in user profile

## Testing the Integration

### 1. Test Signup Flow
1. Navigate to `/signup`
2. Select a faculty (e.g., "Natural and Applied Sciences")
3. Department dropdown will populate with relevant departments
4. Select a department (e.g., "Computer Science")
5. Complete registration

### 2. Test Settings Page
1. Login and navigate to `/settings`
2. Change faculty - department dropdown updates
3. Save changes

## API Endpoints

- `GET /api/users/faculties/` - Get all faculties
- `GET /api/users/departments/` - Get all departments
- `GET /api/users/departments/?faculty_id=<uuid>` - Get departments by faculty

## Database Schema Changes

### User Model
- `department` (CharField) → `department` (ForeignKey to Department)
- Added: `faculty` (ForeignKey to Faculty)

### New Models
- `Faculty` (id, name, created_at)
- `Department` (id, name, faculty, created_at)

## Notes

- Email field is now read-only in settings (cannot be changed)
- Faculty selection is required before department selection
- Department dropdown is disabled until faculty is selected
- All existing functionality remains intact
